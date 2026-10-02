import { describe, expect, it } from 'vitest'
import {
  bookingRequestSchema,
  createReference,
  quoteRequestSchema,
  summarizeBooking,
  summaryFromMetadata,
  summaryToMetadata,
  validatePickupMoment,
} from '@/lib/booking'
import { parisToUtc } from '@/lib/format'
import { computeQuote } from '@/lib/pricing'

const validQuote = {
  from: { label: '10 Rue de la Paix 75002 Paris', lon: 2.331, lat: 48.8695, postcode: '75002', city: 'Paris' },
  to: { label: 'Aéroport Charles de Gaulle', lon: 2.5479, lat: 49.0097, postcode: '95700' },
  date: '2026-11-12',
  time: '09:30',
  passengers: 2,
  luggage: 2,
  vehicleId: 'audi-q8-hybride',
}

describe('schémas', () => {
  it('accepte une demande de devis valide et complète les options', () => {
    const r = quoteRequestSchema.safeParse(validQuote)
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.options).toEqual({ childSeat: 0, meetAndGreet: 0 })
  })

  it('refuse des coordonnées hors de France et un véhicule inconnu', () => {
    expect(quoteRequestSchema.safeParse({ ...validQuote, from: { ...validQuote.from, lon: -74 } }).success).toBe(false)
    expect(quoteRequestSchema.safeParse({ ...validQuote, vehicleId: 'tesla' }).success).toBe(false)
  })

  it('exige les coordonnées client et l’acceptation des CGV', () => {
    const ok = bookingRequestSchema.safeParse({
      ...validQuote,
      customer: { firstName: 'Anna', lastName: 'Martin', email: 'anna@example.com', phone: '06 12 34 56 78' },
      acceptTerms: true,
    })
    expect(ok.success).toBe(true)
    const ko = bookingRequestSchema.safeParse({
      ...validQuote,
      customer: { firstName: 'Anna', lastName: 'Martin', email: 'pas-un-email', phone: '06 12 34 56 78' },
      acceptTerms: false,
    })
    expect(ko.success).toBe(false)
  })
})

describe('moment de prise en charge', () => {
  const now = new Date('2026-10-02T10:00:00Z') // 12:00 à Paris (heure d'été)

  it('refuse une réservation à moins de 2 h', () => {
    expect(validatePickupMoment('2026-10-02', '13:00', now)).toMatch(/2 heures/)
  })

  it('accepte une réservation à plus de 2 h', () => {
    expect(validatePickupMoment('2026-10-02', '14:30', now)).toBeNull()
  })

  it('refuse au-delà de l’horizon maximal', () => {
    expect(validatePickupMoment('2028-01-01', '10:00', now)).toMatch(/jours/)
  })

  it('convertit l’heure de Paris en UTC (été et hiver)', () => {
    expect(parisToUtc('2026-07-01', '12:00').toISOString()).toBe('2026-07-01T10:00:00.000Z')
    expect(parisToUtc('2026-01-15', '12:00').toISOString()).toBe('2026-01-15T11:00:00.000Z')
  })
})

describe('référence et métadonnées', () => {
  it('génère une référence MV-AAMMJJ-XXXX', () => {
    expect(createReference(new Date('2026-10-02T12:00:00Z'))).toMatch(/^MV-261002-[A-Z2-9]{4}$/)
  })

  it('fait l’aller-retour résumé → métadonnées Stripe → résumé', () => {
    const request = bookingRequestSchema.parse({
      ...validQuote,
      options: { childSeat: 1 },
      customer: {
        firstName: 'Anna',
        lastName: 'Martin',
        email: 'anna@example.com',
        phone: '+33612345678',
        flightNumber: 'AF1234',
        notes: 'Deux valises cabine',
      },
      acceptTerms: true,
    })
    const quote = computeQuote({ ...request, to: request.to!, distanceKm: 31.4, durationMin: 39 })
    const summary = summarizeBooking(request, { quote, route: { distanceKm: 31.4, durationMin: 39, source: 'ign' } }, 'MV-261002-ABCD', 'pending')
    const metadata = summaryToMetadata(summary)
    for (const value of Object.values(metadata)) expect(value.length).toBeLessThanOrEqual(500)
    expect(Object.keys(metadata).length).toBeLessThanOrEqual(50)
    const back = summaryFromMetadata(metadata)
    expect(back).toMatchObject({
      reference: 'MV-261002-ABCD',
      total: 105,
      dueNow: 32,
      balance: 73,
      options: ['Siège enfant / rehausseur'],
      customer: { email: 'anna@example.com', flightNumber: 'AF1234', notes: 'Deux valises cabine' },
    })
  })
})

describe('modes de trajet', () => {
  it('exige une arrivée hors mise à disposition, et une durée en mise à disposition', () => {
    const sansArrivee = { ...validQuote, to: undefined }
    expect(quoteRequestSchema.safeParse(sansArrivee).success).toBe(false)
    expect(quoteRequestSchema.safeParse({ ...sansArrivee, mode: 'hourly' }).success).toBe(false)
    expect(quoteRequestSchema.safeParse({ ...sansArrivee, mode: 'hourly', hours: 4 }).success).toBe(true)
  })

  it('exige le retour en aller-retour et vérifie qu’il suit l’aller', async () => {
    const { validateRequestMoments } = await import('@/lib/booking')
    expect(quoteRequestSchema.safeParse({ ...validQuote, mode: 'return' }).success).toBe(false)
    const r = quoteRequestSchema.parse({ ...validQuote, mode: 'return', returnDate: '2026-11-12', returnTime: '09:00' })
    expect(validateRequestMoments(r, new Date('2026-10-02T10:00:00Z'))).toMatch(/30 minutes/)
    const ok = quoteRequestSchema.parse({ ...validQuote, mode: 'return', returnDate: '2026-11-12', returnTime: '18:00' })
    expect(validateRequestMoments(ok, new Date('2026-10-02T10:00:00Z'))).toBeNull()
  })
})
