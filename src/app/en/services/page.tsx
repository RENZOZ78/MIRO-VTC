import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/CtaBand'
import { PageHeader } from '@/components/PageHeader'
import { services } from '@/config/services'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Airport and station transfers, chauffeur by the hour, long distance, evenings and business services: MIRO VTC private chauffeur services in the Paris region.',
  alternates: { canonical: '/en/services', languages: { fr: '/services', en: '/en/services' } },
}

export default function ServicesPageEn() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="A chauffeur for every moment."
        lead="Transfers, hourly hire, long distance or evenings: the same vehicle, the same attention, a price known in advance."
      />
      <div className="container-x space-y-6">
        {services.map((s, i) => (
          <article key={s.slug} id={s.slug} className="card grid scroll-mt-28 gap-8 p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="font-display text-gold/60 text-sm">0{i + 1}</span>
              <h2 className="mt-2 text-3xl sm:text-4xl">{s.en.title}</h2>
              <ul className="mt-6 space-y-2">
                {s.en.points.map((p) => (
                  <li key={p} className="text-cream/85 flex items-start gap-3 text-sm">
                    <span className="text-gold mt-0.5">◆</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-mist space-y-4 leading-relaxed">
              {s.en.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <div className="pt-2">
                {s.slug === 'entreprises' ? (
                  <Link href="/en/business" className="btn-ghost">
                    Business offer
                  </Link>
                ) : s.slug === 'mise-a-disposition' ? (
                  <Link href="/en/booking" className="btn-gold">
                    Book by the hour
                  </Link>
                ) : (
                  <Link href="/en/booking" className="btn-gold">
                    Book
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      <CtaBand locale="en" />
    </>
  )
}
