'use client'

import Link from 'next/link'
import { destinations } from '@/config/destinations'
import { isSet, siteConfig } from '@/config/site'
import { Logo } from '@/components/Logo'
import { getDictionary } from '@/i18n/dictionaries'
import { useLocale } from '@/i18n/locale-context'

const descriptionEn =
  'MIRO VTC, private chauffeur in the Paris region: airport and station transfers, hourly hire and long-distance journeys aboard hybrid Audi Q8s. Online booking, price fixed in advance.'

export function Footer() {
  const locale = useLocale()
  const t = getDictionary(locale)
  return (
    <footer className="border-line bg-ink-2/60 mt-24 border-t">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo tagline={t.footer.tagline} />
          <p className="text-mist mt-6 max-w-sm text-sm leading-relaxed">
            {locale === 'en' ? descriptionEn : siteConfig.description}
          </p>
          <p className="text-mist mt-4 text-sm">{locale === 'en' ? '7 days a week, 24 h by reservation' : siteConfig.hours}</p>
        </div>

        <div>
          <h2 className="eyebrow font-sans text-[11px]">{t.footer.navigation}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {t.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-cream/85 hover:text-gold-2">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={t.booking.bookingHref} className="text-cream/85 hover:text-gold-2">
                {t.footer.booking}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow font-sans text-[11px]">{t.footer.destinations}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {destinations.map((d) => (
              <li key={d.slug}>
                <Link href={`/vtc/${d.slug}`} className="text-cream/85 hover:text-gold-2">
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow font-sans text-[11px]">{t.footer.contact}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a href={`tel:${siteConfig.phone.e164}`} className="text-cream/85 hover:text-gold-2">
                {siteConfig.phone.display}
              </a>
            </li>
            <li>
              {isSet(siteConfig.email) ? (
                <a href={`mailto:${siteConfig.email}`} className="text-cream/85 hover:text-gold-2">
                  {siteConfig.email}
                </a>
              ) : (
                <span className="placeholder">{siteConfig.email}</span>
              )}
            </li>
            <li className="text-mist">{siteConfig.serviceArea.label}</li>
          </ul>
          <ul className="text-mist mt-8 space-y-2 text-xs">
            <li>
              <Link href="/mentions-legales" className="hover:text-gold-2">
                {t.footer.legal}
              </Link>
            </li>
            <li>
              <Link href="/cgv" className="hover:text-gold-2">
                {t.footer.terms}
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="hover:text-gold-2">
                {t.footer.privacy}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-line border-t">
        <div className="container-x text-mist-2 flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. {t.footer.rights}
          </span>
          <span>{t.footer.regulated}</span>
        </div>
      </div>
    </footer>
  )
}
