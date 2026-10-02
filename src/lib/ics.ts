/**
 * Fichier calendrier (.ics) joint aux e-mails de réservation : le client et
 * le chauffeur ajoutent la course à leur agenda en un clic.
 */
import { siteConfig } from '@/config/site'
import type { BookingSummary } from '@/lib/booking'
import { formatPrice, parisToUtc } from '@/lib/format'

const pad = (n: number) => String(n).padStart(2, '0')

/** Instant UTC au format iCalendar : 20261112T083000Z */
export function toIcsDate(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
}

/** Échappe les caractères réservés d'une valeur texte iCalendar. */
export function escapeIcsText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
}

/** Replie les lignes à 75 octets comme l'exige la RFC 5545. */
function fold(line: string): string {
  const bytes = Buffer.from(line, 'utf8')
  if (bytes.length <= 75) return line
  const parts: string[] = []
  let start = 0
  let first = true
  while (start < bytes.length) {
    const max = first ? 75 : 74
    let end = Math.min(start + max, bytes.length)
    // Ne pas couper au milieu d'un caractère multi-octets.
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--
    parts.push((first ? '' : ' ') + bytes.subarray(start, end).toString('utf8'))
    start = end
    first = false
  }
  return parts.join('\r\n')
}

type IcsEvent = {
  uid: string
  start: Date
  end: Date
  summary: string
  location: string
  description: string
}

function renderEvent(e: IcsEvent, stamp: Date): string[] {
  return [
    'BEGIN:VEVENT',
    `UID:${e.uid}`,
    `DTSTAMP:${toIcsDate(stamp)}`,
    `DTSTART:${toIcsDate(e.start)}`,
    `DTEND:${toIcsDate(e.end)}`,
    `SUMMARY:${escapeIcsText(e.summary)}`,
    `LOCATION:${escapeIcsText(e.location)}`,
    `DESCRIPTION:${escapeIcsText(e.description)}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcsText(`Chauffeur ${siteConfig.name} dans 1 h`)}`,
    'END:VALARM',
    'END:VEVENT',
  ]
}

/** Construit le calendrier d'une réservation (un événement par trajet). */
export function buildBookingIcs(s: BookingSummary, now = new Date()): string {
  const host = new URL(siteConfig.url).hostname
  const description = [
    `Référence ${s.reference}`,
    s.vehicleCount > 1 ? `${s.vehicleCount} × ${s.vehicleName}` : s.vehicleName,
    `${s.passengers} passager(s), ${s.luggage} bagage(s)`,
    `Prix total ${formatPrice(s.total)} TTC`,
    `${siteConfig.name} · ${siteConfig.phone.display}`,
  ].join('\n')

  const events: IcsEvent[] = []
  if (s.mode === 'hourly') {
    const start = parisToUtc(s.date, s.time)
    const hours = s.hours ?? 1
    events.push({
      uid: `${s.reference}@${host}`,
      start,
      end: new Date(start.getTime() + hours * 3600_000),
      summary: `${siteConfig.name} — mise à disposition ${hours} h`,
      location: s.from,
      description,
    })
  } else {
    const durationMs = Math.max(30, s.durationMin + 15) * 60_000
    const start = parisToUtc(s.date, s.time)
    events.push({
      uid: `${s.reference}-aller@${host}`,
      start,
      end: new Date(start.getTime() + durationMs),
      summary: `${siteConfig.name} — ${s.from} → ${s.to}`,
      location: s.from,
      description,
    })
    if (s.mode === 'return' && s.returnDate && s.returnTime) {
      const rStart = parisToUtc(s.returnDate, s.returnTime)
      events.push({
        uid: `${s.reference}-retour@${host}`,
        start: rStart,
        end: new Date(rStart.getTime() + durationMs),
        summary: `${siteConfig.name} — ${s.to} → ${s.from}`,
        location: s.to,
        description,
      })
    }
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${siteConfig.name}//Réservation//FR`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events.flatMap((e) => renderEvent(e, now)),
    'END:VCALENDAR',
  ]
  return lines.map(fold).join('\r\n') + '\r\n'
}
