import { describe, expect, it } from 'vitest'
import type { BookingSummary } from '@/lib/booking'
import { buildBookingIcs, escapeIcsText, toIcsDate } from '@/lib/ics'

const summary: BookingSummary = {
  reference: 'MV-261002-ABCD',
  createdAt: '2026-10-02T12:00:00.000Z',
  mode: 'return',
  date: '2026-11-12',
  time: '09:30',
  returnDate: '2026-11-15',
  returnTime: '18:00',
  from: '10 Rue de la Paix 75002 Paris',
  to: 'Aéroport Charles de Gaulle',
  passengers: 2,
  luggage: 2,
  vehicleName: 'Audi Q8 TFSI e',
  vehicleCount: 1,
  options: [],
  distanceKm: 31.4,
  durationMin: 39,
  routeSource: 'ign',
  basis: 'flat',
  total: 180.5,
  dueNow: 55,
  balance: 125.5,
  paymentMode: 'deposit',
  customer: { firstName: 'Anna', lastName: 'Martin', email: 'anna@example.com', phone: '+33612345678' },
  payment: { status: 'onboard' },
}

describe('ics', () => {
  it('formate les dates en UTC et échappe le texte', () => {
    expect(toIcsDate(new Date('2026-11-12T08:30:00Z'))).toBe('20261112T083000Z')
    expect(escapeIcsText('a, b; c\nd')).toBe('a\\, b\\; c\\nd')
  })

  it('produit un événement par trajet, à l’heure de Paris convertie en UTC', () => {
    const ics = buildBookingIcs(summary, new Date('2026-10-02T12:00:00Z'))
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true)
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2)
    expect(ics).toContain('DTSTART:20261112T083000Z') // 09:30 Paris en novembre = 08:30 UTC
    expect(ics).toContain('DTSTART:20261115T170000Z')
    expect(ics).toContain('UID:MV-261002-ABCD-aller@')
    for (const line of ics.split('\r\n')) expect(Buffer.byteLength(line)).toBeLessThanOrEqual(75)
  })

  it('couvre la durée d’une mise à disposition', () => {
    const ics = buildBookingIcs({ ...summary, mode: 'hourly', hours: 4, to: '' })
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1)
    expect(ics).toContain('DTEND:20261112T123000Z')
  })
})
