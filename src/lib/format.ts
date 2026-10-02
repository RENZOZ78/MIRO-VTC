const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

export function formatPrice(amount: number): string {
  return euro.format(amount)
}

export function formatKm(km: number): string {
  return `${km.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km`
}

export function formatDuration(minutes: number): string {
  const m = Math.round(minutes)
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const rest = m % 60
  return rest ? `${h} h ${String(rest).padStart(2, '0')}` : `${h} h`
}

/** « jeudi 2 octobre 2026 à 14:30 » à partir de YYYY-MM-DD et HH:mm. */
export function formatDateTimeFr(date: string, time: string): string {
  const d = new Date(`${date}T12:00:00Z`)
  if (Number.isNaN(d.getTime())) return `${date} ${time}`
  const day = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d)
  return `${day} à ${time.replace(':', ' h ')}`
}

/** Date du jour (Europe/Paris) au format YYYY-MM-DD. */
export function todayParis(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(now)
}

/**
 * Convertit une date et une heure locales Europe/Paris en instant UTC.
 * (Les cas limites du changement d'heure sont ignorés : une heure d'écart au plus.)
 */
export function parisToUtc(date: string, time: string): Date {
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const naive = Date.UTC(y, m - 1, d, hh, mm)
  const offset = parisOffsetMs(new Date(naive))
  return new Date(naive - offset)
}

function parisOffsetMs(instant: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Paris',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  return asUtc - instant.getTime()
}
