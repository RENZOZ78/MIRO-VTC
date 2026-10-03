import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CtaBand } from '@/components/CtaBand'
import { JsonLd } from '@/components/JsonLd'
import { PageHeader } from '@/components/PageHeader'
import { DestinationsGrid } from '@/components/sections/DestinationsGrid'
import { Faq } from '@/components/sections/Faq'
import { destinations, getDestination } from '@/config/destinations'
import { pricingConfig } from '@/config/pricing'
import { siteConfig } from '@/config/site'
import { formatPrice } from '@/lib/format'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return destinations.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const d = getDestination(slug)
  if (!d) return {}
  return {
    title: d.title,
    description: d.metaDescription,
    alternates: { canonical: `/vtc/${d.slug}` },
    openGraph: { title: d.title, description: d.metaDescription, url: `${siteConfig.url}/vtc/${d.slug}` },
  }
}

export default async function DestinationPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const d = getDestination(slug)
  if (!d) notFound()

  const zoneLabel = (id: string) => pricingConfig.zones.find((z) => z.id === id)?.label ?? id
  const flatRates = d.flatRateZone
    ? pricingConfig.flatRates
        .filter(({ zones }) => zones.includes(d.flatRateZone!))
        .map(({ zones, price }) => ({ other: zones[0] === d.flatRateZone ? zones[1] : zones[0], price }))
    : []

  return (
    <>
      <PageHeader eyebrow={`VTC ${d.name}`} title={d.title.split(' — ')[0]} lead={d.kicker}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/reservation" className="btn-gold">
            Réserver un trajet
          </Link>
          <a href={`tel:${siteConfig.phone.e164}`} className="btn-ghost">
            {siteConfig.phone.display}
          </a>
        </div>
      </PageHeader>

      <section className="container-x grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-mist space-y-5 text-lg leading-relaxed">
          {d.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <aside className="card h-fit p-7">
          {flatRates.length > 0 ? (
            <>
              <p className="eyebrow">Forfaits depuis {zoneLabel(d.flatRateZone!)}</p>
              <ul className="divide-line mt-4 divide-y text-sm">
                {flatRates.map((r) => (
                  <li key={r.other} className="flex items-center justify-between py-3">
                    <span className="text-cream/85">{zoneLabel(r.other)}</span>
                    <span className="font-display text-gold-2 text-2xl">{formatPrice(r.price)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-mist-2 mt-4 text-xs">Par véhicule, hors majorations de nuit et dimanche.</p>
            </>
          ) : (
            <>
              <p className="eyebrow">Prix sur itinéraire réel</p>
              <p className="text-mist mt-4 text-sm leading-relaxed">
                Depuis {d.name}, le prix est calculé sur la distance et la durée estimées, avec un minimum de{' '}
                {formatPrice(pricingConfig.metered.minimumFare)}. Il s’affiche avant validation et reste garanti.
              </p>
            </>
          )}
          <Link href="/tarifs" className="btn-link mt-5">
            Voir tous les tarifs →
          </Link>
        </aside>
      </section>

      <section className="container-x mt-20">
        <div className="grid gap-5 md:grid-cols-3">
          {d.highlights.map((h) => (
            <article key={h.title} className="card p-7">
              <span className="divider-gold" />
              <h2 className="mt-5 text-2xl">{h.title}</h2>
              <p className="text-mist mt-3 text-sm leading-relaxed">{h.text}</p>
            </article>
          ))}
        </div>
      </section>

      <Faq items={d.faq} title={`Questions sur ${d.name}`} />
      <DestinationsGrid exclude={d.slug} />
      <CtaBand title={`Votre chauffeur à ${d.name}.`} />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: 'Chauffeur privé VTC',
          name: d.title,
          description: d.metaDescription,
          areaServed: { '@type': 'Place', name: d.name },
          provider: { '@id': `${siteConfig.url}/#business` },
          url: `${siteConfig.url}/vtc/${d.slug}`,
        }}
      />
    </>
  )
}
