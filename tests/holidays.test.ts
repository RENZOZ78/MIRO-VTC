import { describe, expect, it } from 'vitest'
import { easterSunday, frenchPublicHolidays, isFrenchPublicHoliday, isSunday } from '@/lib/holidays'

describe('jours fériés', () => {
  it('calcule Pâques', () => {
    expect(easterSunday(2026)).toEqual({ month: 4, day: 5 })
    expect(easterSunday(2027)).toEqual({ month: 3, day: 28 })
  })

  it('liste les 11 jours fériés de 2026', () => {
    const days = frenchPublicHolidays(2026)
    expect(days).toHaveLength(11)
    expect(days).toContain('2026-04-06') // lundi de Pâques
    expect(days).toContain('2026-05-14') // Ascension
    expect(days).toContain('2026-05-25') // lundi de Pentecôte
    expect(days).toContain('2026-07-14')
  })

  it('reconnaît un jour férié et un dimanche', () => {
    expect(isFrenchPublicHoliday('2026-11-11')).toBe(true)
    expect(isFrenchPublicHoliday('2026-11-12')).toBe(false)
    expect(isSunday('2026-10-04')).toBe(true)
    expect(isSunday('2026-10-05')).toBe(false)
  })
})
