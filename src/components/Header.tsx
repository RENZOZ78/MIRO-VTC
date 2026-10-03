'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useSyncExternalStore } from 'react'
import { siteConfig } from '@/config/site'
import { Logo } from '@/components/Logo'
import { getDictionary, toLocalePath } from '@/i18n/dictionaries'
import { useLocale } from '@/i18n/locale-context'

function subscribeScroll(callback: () => void) {
  window.addEventListener('scroll', callback, { passive: true })
  return () => window.removeEventListener('scroll', callback)
}

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const locale = useLocale()
  const t = getDictionary(locale)
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 24,
    () => false,
  )

  // Ferme le menu mobile à chaque changement de page.
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpen(false)
  }

  const homeHref = locale === 'en' ? '/en' : '/'
  const isActive = (href: string) =>
    href === homeHref ? pathname === homeHref : pathname.startsWith(href.replace(/\/[^/]+$/, '') || href)
  const otherLocale = locale === 'fr' ? 'en' : 'fr'
  const switchHref = toLocalePath(pathname, otherLocale)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? 'bg-ink/85 border-line border-b backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between">
        <Link href={homeHref} aria-label={`${siteConfig.name} — ${t.header.home}`}>
          <Logo tagline={t.footer.tagline} />
        </Link>

        <nav aria-label="Navigation" className="hidden items-center gap-7 lg:flex">
          {t.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium tracking-wide transition hover:text-gold-2 ${
                isActive(item.href) ? 'text-gold-2' : 'text-mist'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={switchHref}
            hrefLang={otherLocale}
            aria-label={t.header.switchLabel}
            className="text-mist hover:text-gold-2 text-xs font-semibold tracking-[0.2em]"
          >
            {t.header.switchShort}
          </Link>
          <a href={`tel:${siteConfig.phone.e164}`} className="btn-ghost">
            {siteConfig.phone.display}
          </a>
          <Link href={t.booking.bookingHref} className="btn-gold">
            {t.header.book}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="border-line text-cream grid h-11 w-11 place-items-center rounded-full border lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.header.closeMenu : t.header.openMenu}
        >
          <span className="relative block h-3 w-5">
            <span
              className={`bg-cream absolute left-0 h-px w-5 transition ${open ? 'top-1.5 rotate-45' : 'top-0'}`}
            />
            <span
              className={`bg-cream absolute left-0 h-px w-5 transition ${open ? 'top-1.5 -rotate-45' : 'top-3'}`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-line container-x border-t pb-8 lg:hidden">
          <nav aria-label="Navigation mobile" className="flex flex-col py-4">
            {t.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-line text-cream hover:text-gold-2 border-b py-4 text-lg"
              >
                {item.label}
              </Link>
            ))}
            <Link href={switchHref} hrefLang={otherLocale} className="text-mist hover:text-gold-2 py-4 text-sm">
              {t.header.switchLabel}
            </Link>
          </nav>
          <div className="flex flex-col gap-3">
            <Link href={t.booking.bookingHref} className="btn-gold">
              {t.header.bookLong}
            </Link>
            <a href={`tel:${siteConfig.phone.e164}`} className="btn-ghost">
              {t.header.call} {siteConfig.phone.display}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
