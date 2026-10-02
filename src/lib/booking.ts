/**
 * Validation des demandes de devis et de réservation, et orchestration du
 * calcul côté serveur : itinéraire (IGN ou estimation) puis prix.
 *
 * Le navigateur n'envoie jamais de montant : tout est recalculé ici.
 */
import { randomBytes } from 'node:crypto'
import { z } from 'zod'
import { pricingConfig, type OptionId, type VehicleId } from '@/config/pricing'
import { siteConfig } from '@/config/site'
import { parisToUtc } from '@/lib/format'
import { getRoute, type RouteResult } from '@/lib/geo'
import { computeQuote, type Quote } from '@/lib/pricing'

// Messages de validation en français.
z.config(z.locales.fr())

const vehicleIds = pricingConfig.vehicles.map((v) => v.id) as [VehicleId, ...VehicleId[]]
const optionIds = Object.keys(pricingConfig.options) as OptionId[]

const PHONE_RE = /^\+?[0-9][0-9 .()-]{7,19}$/

export const placeSchema = z.object({
  label: z.string().trim().min(3).max(200),
  lon: z.number().min(-5.5).max(10),
  lat: z.number().min(41).max(51.5),
  city: z.string().trim().max(100).optional(),
  postcode: z.string().trim().max(10).optional(),
})

const optionsSchema = z.object(
  Object.fromEntries(optionIds.map((id) => [id, z.number().int().min(0).max(4).default(0)])) as Record<
    OptionId,
    z.ZodDefault<z.ZodNumber>
  >,
)

export const quoteRequestSchema = z.object({
  from: placeSchema,
  to: placeSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Heure invalide'),
  passengers: z.number().int().min(1).max(siteConfig.booking.maxPassengers),
  luggage: z.number().int().min(0).max(16),
  vehicleId: z.enum(vehicleIds),
  options: optionsSchema.default(
    Object.fromEntries(optionIds.map((id) => [id, 0])) as Record<OptionId, number>,
  ),
})

export const customerSchema = z.object({
  firstName: z.string().trim().min(2, 'Prénom requis').max(60),
  lastName: z.string().trim().min(2, 'Nom requis').max(60),
  email: z.email('E-mail invalide').max(120),
  phone: z.string().trim().regex(PHONE_RE, 'Téléphone invalide'),
  flightNumber: z.string().trim().max(20).optional(),
  notes: z.string().trim().max(1000).optional(),
})

export const bookingRequestSchema = quoteRequestSchema.extend({
  customer: customerSchema,
  acceptTerms: z.literal(true, 'Merci d’accepter les conditions générales'),
  /** Champ pot de miel, invisible pour un humain : rempli = robot (traité dans la route). */
  website: z.string().max(200).optional(),
})

export const contactRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(120),
  phone: z.string().trim().regex(PHONE_RE).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(200).optional(),
})

export type QuoteRequest = z.infer<typeof quoteRequestSchema>
export type BookingRequest = z.infer<typeof bookingRequestSchema>
export type ContactRequest = z.infer<typeof contactRequestSchema>

/** Vérifie que la prise en charge respecte le délai minimal et l'horizon maximal. */
export function validatePickupMoment(date: string, time: string, now = new Date()): string | null {
  const pickup = parisToUtc(date, time)
  if (Number.isNaN(pickup.getTime())) return 'Date ou heure invalide.'
  const { minLeadHours, maxDaysAhead } = siteConfig.booking
  const earliest = now.getTime() + minLeadHours * 3600_000
  if (pickup.getTime() < earliest) {
    return `Merci de réserver au moins ${minLeadHours} heures à l’avance. Pour un départ immédiat, appelez le ${siteConfig.phone.display}.`
  }
  const latest = now.getTime() + maxDaysAhead * 86_400_000
  if (pickup.getTime() > latest) return `Les réservations sont ouvertes jusqu’à ${maxDaysAhead} jours à l’avance.`
  return null
}

export type QuoteResult = { quote: Quote; route: RouteResult }

/** Itinéraire puis prix, à partir d'une demande validée. */
export async function buildQuote(request: QuoteRequest): Promise<QuoteResult> {
  const route = await getRoute(request.from, request.to)
  const quote = computeQuote({
    from: request.from,
    to: request.to,
    distanceKm: route.distanceKm,
    durationMin: route.durationMin,
    date: request.date,
    time: request.time,
    passengers: request.passengers,
    luggage: request.luggage,
    vehicleId: request.vehicleId,
    options: request.options,
  })
  return { quote, route }
}

/** Référence lisible : MV-AAMMJJ-XXXX. */
export function createReference(now = new Date()): string {
  const ymd = now.toISOString().slice(2, 10).replace(/-/g, '')
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = randomBytes(4)
  let suffix = ''
  for (const b of bytes) suffix += alphabet[b % alphabet.length]
  return `MV-${ymd}-${suffix}`
}

export type PaymentStatus = 'onboard' | 'pending' | 'paid' | 'failed'

/** Résumé plat d'une réservation : sert aux e-mails et aux métadonnées Stripe. */
export type BookingSummary = {
  reference: string
  createdAt: string
  date: string
  time: string
  from: string
  to: string
  passengers: number
  luggage: number
  vehicleName: string
  vehicleCount: number
  options: string[]
  distanceKm: number
  durationMin: number
  routeSource: RouteResult['source']
  basis: Quote['basis']
  total: number
  dueNow: number
  balance: number
  paymentMode: Quote['paymentMode']
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    flightNumber?: string
    notes?: string
  }
  payment: { status: PaymentStatus; amountPaid?: number; stripeSessionId?: string }
}

export function optionLabels(options: QuoteRequest['options']): string[] {
  const labels: string[] = []
  for (const id of optionIds) {
    const qty = options?.[id] ?? 0
    if (qty > 0) labels.push(qty > 1 ? `${pricingConfig.options[id].label} × ${qty}` : pricingConfig.options[id].label)
  }
  return labels
}

export function summarizeBooking(
  request: BookingRequest,
  { quote, route }: QuoteResult,
  reference: string,
  paymentStatus: PaymentStatus,
  createdAt = new Date(),
): BookingSummary {
  return {
    reference,
    createdAt: createdAt.toISOString(),
    date: request.date,
    time: request.time,
    from: request.from.label,
    to: request.to.label,
    passengers: request.passengers,
    luggage: request.luggage,
    vehicleName: quote.vehicleName,
    vehicleCount: quote.vehicleCount,
    options: optionLabels(request.options),
    distanceKm: quote.distanceKm,
    durationMin: quote.durationMin,
    routeSource: route.source,
    basis: quote.basis,
    total: quote.total,
    dueNow: quote.dueNow,
    balance: quote.balance,
    paymentMode: quote.paymentMode,
    customer: {
      firstName: request.customer.firstName,
      lastName: request.customer.lastName,
      email: request.customer.email,
      phone: request.customer.phone,
      flightNumber: request.customer.flightNumber || undefined,
      notes: request.customer.notes || undefined,
    },
    payment: { status: paymentStatus },
  }
}

const clip = (s: string, max = 480) => (s.length > max ? `${s.slice(0, max - 1)}…` : s)

/** Métadonnées Stripe (≤ 50 clés, valeurs ≤ 500 caractères). */
export function summaryToMetadata(s: BookingSummary): Record<string, string> {
  return {
    reference: s.reference,
    createdAt: s.createdAt,
    date: s.date,
    time: s.time,
    from: clip(s.from),
    to: clip(s.to),
    passengers: String(s.passengers),
    luggage: String(s.luggage),
    vehicleName: s.vehicleName,
    vehicleCount: String(s.vehicleCount),
    options: clip(s.options.join(' | ')),
    distanceKm: String(s.distanceKm),
    durationMin: String(s.durationMin),
    routeSource: s.routeSource,
    basis: s.basis,
    total: String(s.total),
    dueNow: String(s.dueNow),
    balance: String(s.balance),
    paymentMode: s.paymentMode,
    firstName: clip(s.customer.firstName),
    lastName: clip(s.customer.lastName),
    email: clip(s.customer.email),
    phone: clip(s.customer.phone),
    flightNumber: s.customer.flightNumber ?? '',
    notes: clip(s.customer.notes ?? ''),
  }
}

export function summaryFromMetadata(md: Record<string, string> | null | undefined): BookingSummary | null {
  if (!md || !md.reference || !md.date || !md.time) return null
  const num = (v: string | undefined, fallback = 0) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
  }
  return {
    reference: md.reference,
    createdAt: md.createdAt ?? new Date().toISOString(),
    date: md.date,
    time: md.time,
    from: md.from ?? '',
    to: md.to ?? '',
    passengers: num(md.passengers, 1),
    luggage: num(md.luggage),
    vehicleName: md.vehicleName ?? '',
    vehicleCount: num(md.vehicleCount, 1),
    options: md.options ? md.options.split(' | ').filter(Boolean) : [],
    distanceKm: num(md.distanceKm),
    durationMin: num(md.durationMin),
    routeSource: md.routeSource === 'ign' ? 'ign' : 'estimation',
    basis: md.basis === 'flat' ? 'flat' : 'metered',
    total: num(md.total),
    dueNow: num(md.dueNow),
    balance: num(md.balance),
    paymentMode: md.paymentMode === 'full' ? 'full' : 'deposit',
    customer: {
      firstName: md.firstName ?? '',
      lastName: md.lastName ?? '',
      email: md.email ?? '',
      phone: md.phone ?? '',
      flightNumber: md.flightNumber || undefined,
      notes: md.notes || undefined,
    },
    payment: { status: 'pending' },
  }
}
