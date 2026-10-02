/**
 * Calcul du prix d'une course. Fonctions pures, sans accès réseau :
 * c'est ce module qui fait foi côté serveur pour tout montant encaissé.
 */
import {
  pricingConfig,
  type Coordinates,
  type OptionId,
  type Vehicle,
  type VehicleId,
  type Zone,
} from '@/config/pricing'
import { isFrenchPublicHoliday, isSunday } from '@/lib/holidays'

export type PlacePoint = Coordinates & { postcode?: string; city?: string }

export type QuoteInput = {
  from: PlacePoint
  to: PlacePoint
  distanceKm: number
  durationMin: number
  /** Date locale (Europe/Paris) au format YYYY-MM-DD. */
  date: string
  /** Heure locale au format HH:mm. */
  time: string
  passengers: number
  luggage: number
  vehicleId: VehicleId
  /** Quantité par option. */
  options?: Partial<Record<OptionId, number>>
}

export type QuoteLine = { label: string; amount: number }

export type TripMode = 'oneway' | 'return' | 'hourly'

export type QuoteLeg = {
  label: string
  date: string
  time: string
  total: number
  surcharges: { night: boolean; sundayHoliday: boolean }
}

export type Quote = {
  mode: TripMode
  basis: 'flat' | 'metered' | 'hourly'
  /** Détail par trajet (aller-retour). */
  legs?: QuoteLeg[]
  /** Durée réservée (mise à disposition). */
  hours?: number
  vehicleId: VehicleId
  vehicleName: string
  vehicleCount: number
  flatRate?: { fromZone: string; toZone: string; price: number }
  lines: QuoteLine[]
  surcharges: { night: boolean; sundayHoliday: boolean }
  /** Prix total TTC. */
  total: number
  /** Montant à régler en ligne (acompte ou totalité selon la configuration). */
  dueNow: number
  /** Solde à régler au chauffeur. */
  balance: number
  paymentMode: 'deposit' | 'full'
  depositPercent: number
  distanceKm: number
  durationMin: number
}

export const roundMoney = (n: number) => Math.round(n * 100) / 100

const EARTH_RADIUS_KM = 6371

export function haversineKm(a: Coordinates, b: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

export function getVehicle(id: VehicleId): Vehicle {
  const vehicle = pricingConfig.vehicles.find((v) => v.id === id)
  if (!vehicle) throw new Error(`Véhicule inconnu : ${id}`)
  return vehicle
}

/** Zone tarifaire d'un point : d'abord par code postal, sinon par rayon. */
export function findZone(point: PlacePoint, zones: readonly Zone[] = pricingConfig.zones): Zone | undefined {
  const postcode = point.postcode?.trim()
  if (postcode) {
    const byPostcode = zones.find((z) => z.postcodes?.some((p) => postcode.startsWith(p)))
    if (byPostcode) return byPostcode
  }
  return zones.find(
    (z) => z.center && z.radiusKm !== undefined && haversineKm(point, z.center) <= z.radiusKm,
  )
}

export function findFlatRate(zoneA: string, zoneB: string) {
  return pricingConfig.flatRates.find(
    ({ zones }) =>
      (zones[0] === zoneA && zones[1] === zoneB) || (zones[0] === zoneB && zones[1] === zoneA),
  )
}

export function isNightHour(hour: number): boolean {
  const { startHour, endHour } = pricingConfig.night
  return startHour > endHour ? hour >= startHour || hour < endHour : hour >= startHour && hour < endHour
}

export function isSundayOrHoliday(isoDate: string): boolean {
  return isSunday(isoDate) || isFrenchPublicHoliday(isoDate)
}

/** Nombre de véhicules nécessaires pour les passagers et bagages. */
export function vehiclesNeeded(vehicle: Vehicle, passengers: number, luggage: number): number {
  const byPassengers = Math.ceil(Math.max(1, passengers) / vehicle.passengers)
  const byLuggage = Math.ceil(Math.max(0, luggage) / vehicle.luggage)
  return Math.min(vehicle.fleetCount, Math.max(1, byPassengers, byLuggage))
}

export function computeDueNow(total: number): { dueNow: number; balance: number } {
  if (pricingConfig.paymentMode === 'full') return { dueNow: total, balance: 0 }
  const dueNow = Math.ceil((total * pricingConfig.depositPercent) / 100)
  return { dueNow, balance: roundMoney(total - dueNow) }
}

export function computeQuote(input: QuoteInput): Quote {
  const vehicle = getVehicle(input.vehicleId)
  const vehicleCount = vehiclesNeeded(vehicle, input.passengers, input.luggage)
  const lines: QuoteLine[] = []

  const fromZone = findZone(input.from)
  const toZone = findZone(input.to)
  const flat = fromZone && toZone && fromZone.id !== toZone.id ? findFlatRate(fromZone.id, toZone.id) : undefined

  let perVehicle: number
  let basis: Quote['basis']
  let flatRate: Quote['flatRate']

  if (flat && fromZone && toZone) {
    basis = 'flat'
    perVehicle = flat.price
    flatRate = { fromZone: fromZone.label, toZone: toZone.label, price: flat.price }
    lines.push({ label: `Forfait ${fromZone.label} → ${toZone.label}`, amount: flat.price })
  } else {
    basis = 'metered'
    const { baseFare, perKm, perMinute, minimumFare } = pricingConfig.metered
    const km = Math.max(0, input.distanceKm)
    const min = Math.max(0, input.durationMin)
    const metered = baseFare + km * perKm + min * perMinute
    lines.push({ label: 'Prise en charge', amount: baseFare })
    lines.push({ label: `${km.toFixed(1)} km × ${perKm.toFixed(2)} €`, amount: roundMoney(km * perKm) })
    lines.push({ label: `${Math.round(min)} min × ${perMinute.toFixed(2)} €`, amount: roundMoney(min * perMinute) })
    if (metered < minimumFare) {
      lines.push({ label: 'Minimum de course', amount: roundMoney(minimumFare - metered) })
    }
    perVehicle = Math.max(metered, minimumFare)
  }

  if (vehicle.coefficient !== 1) {
    const delta = perVehicle * (vehicle.coefficient - 1)
    lines.push({ label: `${vehicle.name} (×${vehicle.coefficient})`, amount: roundMoney(delta) })
    perVehicle *= vehicle.coefficient
  }

  let subtotal = perVehicle * vehicleCount
  if (vehicleCount > 1) {
    lines.push({ label: `× ${vehicleCount} véhicules`, amount: roundMoney(perVehicle * (vehicleCount - 1)) })
  }

  const hour = Number(input.time.slice(0, 2))
  const night = Number.isInteger(hour) && isNightHour(hour)
  const sundayHoliday = isSundayOrHoliday(input.date)
  const base = subtotal
  if (night) {
    const amount = roundMoney((base * pricingConfig.night.surchargePercent) / 100)
    lines.push({ label: `Majoration de nuit (+${pricingConfig.night.surchargePercent} %)`, amount })
    subtotal += amount
  }
  if (sundayHoliday) {
    const amount = roundMoney((base * pricingConfig.sundayHoliday.surchargePercent) / 100)
    lines.push({ label: `Dimanche / jour férié (+${pricingConfig.sundayHoliday.surchargePercent} %)`, amount })
    subtotal += amount
  }

  for (const [id, option] of Object.entries(pricingConfig.options) as [OptionId, { label: string; price: number }][]) {
    const qty = Math.max(0, Math.floor(input.options?.[id] ?? 0))
    if (qty > 0) {
      const amount = roundMoney(option.price * qty)
      lines.push({ label: qty > 1 ? `${option.label} × ${qty}` : option.label, amount })
      subtotal += amount
    }
  }

  const total = roundMoney(subtotal)
  const { dueNow, balance } = computeDueNow(total)

  return {
    mode: 'oneway',
    basis,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    vehicleCount,
    flatRate,
    lines,
    surcharges: { night, sundayHoliday },
    total,
    dueNow,
    balance,
    paymentMode: pricingConfig.paymentMode,
    depositPercent: pricingConfig.depositPercent,
    distanceKm: roundMoney(input.distanceKm),
    durationMin: Math.round(input.durationMin),
  }
}

/* ------------------------- Aller-retour ------------------------- */

export type ReturnQuoteInput = QuoteInput & { returnDate: string; returnTime: string }

/**
 * Aller-retour réservé en une fois : chaque trajet est calculé avec ses
 * propres majorations (nuit, dimanche), les options ne sont comptées qu'une
 * fois, puis la remise aller-retour s'applique sur le total.
 */
export function computeReturnQuote(input: ReturnQuoteInput): Quote {
  const outbound = computeQuote(input)
  const inbound = computeQuote({
    ...input,
    from: input.to,
    to: input.from,
    date: input.returnDate,
    time: input.returnTime,
    options: {},
  })
  const legs: QuoteLeg[] = [
    { label: 'Aller', date: input.date, time: input.time, total: outbound.total, surcharges: outbound.surcharges },
    { label: 'Retour', date: input.returnDate, time: input.returnTime, total: inbound.total, surcharges: inbound.surcharges },
  ]
  const lines: QuoteLine[] = [
    { label: `Aller (${outbound.basis === 'flat' ? 'forfait' : 'compteur'})`, amount: outbound.total },
    { label: `Retour (${inbound.basis === 'flat' ? 'forfait' : 'compteur'})`, amount: inbound.total },
  ]
  let subtotal = outbound.total + inbound.total
  const pct = pricingConfig.returnTripDiscountPercent
  if (pct > 0) {
    const discount = roundMoney((subtotal * pct) / 100)
    lines.push({ label: `Remise aller-retour (−${pct} %)`, amount: -discount })
    subtotal -= discount
  }
  const total = roundMoney(subtotal)
  const { dueNow, balance } = computeDueNow(total)
  return {
    ...outbound,
    mode: 'return',
    legs,
    lines,
    surcharges: {
      night: outbound.surcharges.night || inbound.surcharges.night,
      sundayHoliday: outbound.surcharges.sundayHoliday || inbound.surcharges.sundayHoliday,
    },
    total,
    dueNow,
    balance,
  }
}

/* --------------------- Mise à disposition --------------------- */

export type HourlyQuoteInput = {
  from: PlacePoint
  hours: number
  date: string
  time: string
  passengers: number
  luggage: number
  vehicleId: VehicleId
  options?: Partial<Record<OptionId, number>>
}

/** Mise à disposition : tarif horaire × durée (minimum applicable), majorations et options. */
export function computeHourlyQuote(input: HourlyQuoteInput): Quote {
  const vehicle = getVehicle(input.vehicleId)
  const vehicleCount = vehiclesNeeded(vehicle, input.passengers, input.luggage)
  const { pricePerHour, minimumHours, maximumHours } = pricingConfig.hourly
  const hours = Math.min(maximumHours, Math.max(minimumHours, Math.ceil(input.hours)))
  const lines: QuoteLine[] = []

  let perVehicle = pricePerHour * hours
  lines.push({ label: `${hours} h × ${pricePerHour.toFixed(2)} €`, amount: roundMoney(perVehicle) })
  if (hours > Math.ceil(input.hours)) {
    lines[0].label += ` (minimum ${minimumHours} h)`
  }
  if (vehicle.coefficient !== 1) {
    const delta = perVehicle * (vehicle.coefficient - 1)
    lines.push({ label: `${vehicle.name} (×${vehicle.coefficient})`, amount: roundMoney(delta) })
    perVehicle *= vehicle.coefficient
  }
  let subtotal = perVehicle * vehicleCount
  if (vehicleCount > 1) {
    lines.push({ label: `× ${vehicleCount} véhicules`, amount: roundMoney(perVehicle * (vehicleCount - 1)) })
  }

  const hour = Number(input.time.slice(0, 2))
  const night = Number.isInteger(hour) && isNightHour(hour)
  const sundayHoliday = isSundayOrHoliday(input.date)
  const base = subtotal
  if (night) {
    const amount = roundMoney((base * pricingConfig.night.surchargePercent) / 100)
    lines.push({ label: `Majoration de nuit (+${pricingConfig.night.surchargePercent} %)`, amount })
    subtotal += amount
  }
  if (sundayHoliday) {
    const amount = roundMoney((base * pricingConfig.sundayHoliday.surchargePercent) / 100)
    lines.push({ label: `Dimanche / jour férié (+${pricingConfig.sundayHoliday.surchargePercent} %)`, amount })
    subtotal += amount
  }
  for (const [id, option] of Object.entries(pricingConfig.options) as [OptionId, { label: string; price: number }][]) {
    const qty = Math.max(0, Math.floor(input.options?.[id] ?? 0))
    if (qty > 0) {
      const amount = roundMoney(option.price * qty)
      lines.push({ label: qty > 1 ? `${option.label} × ${qty}` : option.label, amount })
      subtotal += amount
    }
  }

  const total = roundMoney(subtotal)
  const { dueNow, balance } = computeDueNow(total)
  return {
    mode: 'hourly',
    basis: 'hourly',
    hours,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    vehicleCount,
    lines,
    surcharges: { night, sundayHoliday },
    total,
    dueNow,
    balance,
    paymentMode: pricingConfig.paymentMode,
    depositPercent: pricingConfig.depositPercent,
    distanceKm: pricingConfig.hourly.includedKmPerHour * hours,
    durationMin: hours * 60,
  }
}
