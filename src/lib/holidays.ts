/** Jours fériés français (métropole, hors Alsace-Moselle). */

/** Dimanche de Pâques (algorithme de Meeus/Jones/Butcher). */
export function easterSunday(year: number): { month: number; day: number } {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return { month, day }
}

function addDaysUtc(year: number, month: number, day: number, days: number): string {
  const d = new Date(Date.UTC(year, month - 1, day + days))
  return d.toISOString().slice(0, 10)
}

/** Liste des jours fériés d'une année au format YYYY-MM-DD. */
export function frenchPublicHolidays(year: number): string[] {
  const easter = easterSunday(year)
  const fixed = ['01-01', '05-01', '05-08', '07-14', '08-15', '11-01', '11-11', '12-25'].map(
    (md) => `${year}-${md}`,
  )
  return [
    ...fixed,
    addDaysUtc(year, easter.month, easter.day, 1), // lundi de Pâques
    addDaysUtc(year, easter.month, easter.day, 39), // Ascension
    addDaysUtc(year, easter.month, easter.day, 50), // lundi de Pentecôte
  ].sort()
}

export function isFrenchPublicHoliday(isoDate: string): boolean {
  const year = Number(isoDate.slice(0, 4))
  if (!Number.isInteger(year)) return false
  return frenchPublicHolidays(year).includes(isoDate)
}

/** Vrai si la date (YYYY-MM-DD) tombe un dimanche. */
export function isSunday(isoDate: string): boolean {
  const d = new Date(`${isoDate}T12:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.getUTCDay() === 0
}
