import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/CtaBand'
import { PageHeader } from '@/components/PageHeader'
import { services } from '@/config/services'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Transferts aéroports et gares, mise à disposition, longue distance, soirées et prestations entreprises : les services de chauffeur privé MIRO VTC en Île-de-France.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Un chauffeur pour chaque moment."
        lead="Transferts, mises à disposition, longue distance ou soirées : le même véhicule, la même attention, un prix connu à l’avance."
      />
      <div className="container-x space-y-6">
        {services.map((s, i) => (
          <article
            key={s.slug}
            id={s.slug}
            className="card grid scroll-mt-28 gap-8 p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <div>
              <span className="font-display text-gold/60 text-sm">0{i + 1}</span>
              <h2 className="mt-2 text-3xl sm:text-4xl">{s.title}</h2>
              <ul className="mt-6 space-y-2">
                {s.points.map((p) => (
                  <li key={p} className="text-cream/85 flex items-start gap-3 text-sm">
                    <span className="text-gold mt-0.5">◆</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-mist space-y-4 leading-relaxed">
              {s.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <div className="pt-2">
                {s.slug === 'mise-a-disposition' || s.slug === 'entreprises' ? (
                  <Link href="/contact" className="btn-ghost">
                    Demander un devis
                  </Link>
                ) : (
                  <Link href="/reservation" className="btn-gold">
                    Réserver
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      <CtaBand />
    </>
  )
}
