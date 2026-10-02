import { describe, expect, it } from 'vitest'
import { pricingConfig } from '@/config/pricing'
import {
  computeDueNow,
  computeQuote,
  findZone,
  haversineKm,
  isNightHour,
  vehiclesNeeded,
  type QuoteInput,
} from '@/lib/pricing'

const PARIS_OPERA = { lon: 2.3318, lat: 48.8711, postcode: '75009', city: 'Paris' }
const CDG_T2 = { lon: 2.5704, lat: 49.0039, postcode: '95700', city: 'Roissy-en-France' }
const BOULOGNE = { lon: 2.2399, lat: 48.8352, postcode: '92100', city: 'Boulogne-Billancourt' }
const NEUILLY = { lon: 2.2686, lat: 48.8846, postcode: '92200', city: 'Neuilly-sur-Seine' }

const base: QuoteInput = {
  from: PARIS_OPERA,
  to: CDG_T2,
  distanceKm: 30,
  durationMin: 40,
  date: '2026-10-06', // mardi
  time: '14:00',
  passengers: 2,
  luggage: 2,
  vehicleId: 'audi-q8-hybride',
}

describe('zones', () => {
  it('reconnaît Paris par code postal et CDG par rayon', () => {
    expect(findZone(PARIS_OPERA)?.id).toBe('paris')
    expect(findZone(CDG_T2)?.id).toBe('cdg')
    expect(findZone(BOULOGNE)).toBeUndefined()
  })

  it('calcule une distance à vol d’oiseau plausible Paris → CDG', () => {
    const km = haversineKm(PARIS_OPERA, CDG_T2)
    expect(km).toBeGreaterThan(20)
    expect(km).toBeLessThan(28)
  })
})

describe('computeQuote — forfaits', () => {
  it('applique le forfait Paris ↔ CDG quel que soit le sens', () => {
    const aller = computeQuote(base)
    const retour = computeQuote({ ...base, from: CDG_T2, to: PARIS_OPERA })
    expect(aller.basis).toBe('flat')
    expect(aller.total).toBe(95)
    expect(retour.total).toBe(95)
    expect(aller.flatRate?.price).toBe(95)
  })

  it('ne dépend pas de la distance quand un forfait existe', () => {
    const q = computeQuote({ ...base, distanceKm: 80, durationMin: 120 })
    expect(q.total).toBe(95)
  })
})

describe('computeQuote — compteur', () => {
  it('additionne prise en charge, km et minutes', () => {
    const q = computeQuote({ ...base, from: BOULOGNE, to: NEUILLY, distanceKm: 20, durationMin: 30 })
    const { baseFare, perKm, perMinute } = pricingConfig.metered
    expect(q.basis).toBe('metered')
    expect(q.total).toBeCloseTo(baseFare + 20 * perKm + 30 * perMinute, 2)
  })

  it('applique le minimum de course', () => {
    const q = computeQuote({ ...base, from: BOULOGNE, to: NEUILLY, distanceKm: 2, durationMin: 6 })
    expect(q.total).toBe(pricingConfig.metered.minimumFare)
    expect(q.lines.some((l) => l.label === 'Minimum de course')).toBe(true)
  })
})

describe('majorations', () => {
  it('détecte les heures de nuit', () => {
    expect(isNightHour(22)).toBe(true)
    expect(isNightHour(3)).toBe(true)
    expect(isNightHour(6)).toBe(false)
    expect(isNightHour(14)).toBe(false)
  })

  it('majore la nuit de 20 %', () => {
    const q = computeQuote({ ...base, time: '23:30' })
    expect(q.surcharges.night).toBe(true)
    expect(q.total).toBe(95 * 1.2)
  })

  it('majore le dimanche et les jours fériés de 10 %', () => {
    const dimanche = computeQuote({ ...base, date: '2026-10-04' })
    const noel = computeQuote({ ...base, date: '2026-12-25' })
    const lundiPaques2026 = computeQuote({ ...base, date: '2026-04-06' })
    expect(dimanche.surcharges.sundayHoliday).toBe(true)
    expect(dimanche.total).toBe(104.5)
    expect(noel.total).toBe(104.5)
    expect(lundiPaques2026.total).toBe(104.5)
  })

  it('cumule nuit et dimanche sans les composer', () => {
    const q = computeQuote({ ...base, date: '2026-10-04', time: '05:00' })
    expect(q.total).toBe(95 + 19 + 9.5)
  })
})

describe('véhicules et options', () => {
  it('affecte un second véhicule au-delà de 4 passagers ou 4 bagages', () => {
    const vehicle = pricingConfig.vehicles[0]
    expect(vehiclesNeeded(vehicle, 4, 4)).toBe(1)
    expect(vehiclesNeeded(vehicle, 5, 2)).toBe(2)
    expect(vehiclesNeeded(vehicle, 2, 6)).toBe(2)
    expect(vehiclesNeeded(vehicle, 8, 8)).toBe(2)
  })

  it('double le prix avec deux véhicules', () => {
    const q = computeQuote({ ...base, passengers: 6 })
    expect(q.vehicleCount).toBe(2)
    expect(q.total).toBe(190)
  })

  it('ajoute les options', () => {
    const q = computeQuote({ ...base, options: { childSeat: 2, meetAndGreet: 1 } })
    expect(q.total).toBe(95 + 2 * 10 + 15)
  })
})

describe('acompte', () => {
  it('calcule l’acompte arrondi à l’euro supérieur', () => {
    const { dueNow, balance } = computeDueNow(95)
    expect(dueNow).toBe(29)
    expect(balance).toBe(66)
    expect(dueNow + balance).toBe(95)
  })

  it('expose dueNow et balance dans le devis', () => {
    const q = computeQuote(base)
    expect(q.dueNow + q.balance).toBe(q.total)
    expect(q.paymentMode).toBe(pricingConfig.paymentMode)
  })
})
