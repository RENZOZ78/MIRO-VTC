'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import type { Locale } from '@/i18n/dictionaries'

/** Langue déduite de l'URL : tout ce qui commence par /en est en anglais. */
export function localeFromPath(pathname: string | null): Locale {
  return pathname === '/en' || pathname?.startsWith('/en/') ? 'en' : 'fr'
}

/** Langue courante, utilisable dans l'en-tête et le pied de page (hors des layouts imbriqués). */
export function useLocale(): Locale {
  return localeFromPath(usePathname())
}

/**
 * Le layout racine fixe <html lang="fr"> ; le layout /en corrige l'attribut
 * côté client pour les lecteurs d'écran et les traducteurs automatiques.
 */
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    const previous = document.documentElement.lang
    document.documentElement.lang = locale
    return () => {
      document.documentElement.lang = previous
    }
  }, [locale])
  return null
}
