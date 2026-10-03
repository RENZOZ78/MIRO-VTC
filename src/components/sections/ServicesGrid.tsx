import Link from 'next/link'
import { services } from '@/config/services'
import type { Locale } from '@/i18n/dictionaries'

const copy = {
  fr: { eyebrow: 'Services', title: 'Un chauffeur pour chaque moment.', lead: 'Du transfert aéroport à la journée de mise à disposition, le même soin et le même véhicule.', more: 'En savoir plus', base: '/services' },
  en: { eyebrow: 'Services', title: 'A chauffeur for every moment.', lead: 'From the airport transfer to a full day by the hour, the same care and the same vehicle.', more: 'Learn more', base: '/en/services' },
}

export function ServicesGrid({ withIntro = true, locale = 'fr' }: { withIntro?: boolean; locale?: Locale }) {
  const c = copy[locale]
  return (
    <section className="container-x mt-24" id="services">
      {withIntro && (
        <div className="max-w-2xl">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">{c.title}</h2>
          <p className="lead mt-5">{c.lead}</p>
        </div>
      )}
      <div className={`grid gap-5 md:grid-cols-2 lg:grid-cols-3 ${withIntro ? 'mt-12' : ''}`}>
        {services.map((s) => {
          const text = locale === 'en' ? s.en : s
          return (
            <Link key={s.slug} href={`${c.base}#${s.slug}`} className="card card-hover group flex flex-col p-7">
              <span className="divider-gold" />
              <h3 className="mt-5 text-2xl">{text.title}</h3>
              <p className="text-mist mt-3 flex-1 text-sm leading-relaxed">{text.short}</p>
              <span className="btn-link mt-6">
                {c.more} <span className="transition group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
