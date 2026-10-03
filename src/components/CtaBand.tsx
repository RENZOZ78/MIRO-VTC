import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { getDictionary, type Locale } from '@/i18n/dictionaries'

export function CtaBand({
  title,
  text,
  locale = 'fr',
}: {
  title?: string
  text?: string
  locale?: Locale
}) {
  const t = getDictionary(locale)
  return (
    <section className="container-x mt-24">
      <div className="card relative overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(600px 240px at 50% 0%, rgba(201,163,90,0.18), transparent 70%)',
          }}
        />
        <div className="relative">
          <p className="eyebrow">{t.cta.eyebrow}</p>
          <h2 className="mt-4 text-3xl sm:text-5xl">{title ?? t.cta.title}</h2>
          <p className="text-mist mx-auto mt-5 max-w-xl text-base sm:text-lg">{text ?? t.cta.text}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={t.booking.bookingHref} className="btn-gold">
              {t.cta.button}
            </Link>
            <a href={`tel:${siteConfig.phone.e164}`} className="btn-ghost">
              {siteConfig.phone.display}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
