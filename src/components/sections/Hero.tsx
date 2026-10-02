import Link from 'next/link'
import { CarSilhouette } from '@/components/CarSilhouette'
import { pricingConfig } from '@/config/pricing'
import { siteConfig } from '@/config/site'
import { formatPrice } from '@/lib/format'

const featured = [
  ['paris', 'cdg'],
  ['paris', 'orly'],
  ['paris', 'disney'],
] as const

export function Hero() {
  const zoneLabel = (id: string) => pricingConfig.zones.find((z) => z.id === id)?.label ?? id
  const price = (a: string, b: string) =>
    pricingConfig.flatRates.find(({ zones }) => zones.includes(a) && zones.includes(b))?.price

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 420px at 15% 10%, rgba(201,163,90,0.16), transparent 65%), radial-gradient(700px 360px at 85% 60%, rgba(231,211,161,0.08), transparent 60%)',
        }}
      />
      <div aria-hidden className="hairline absolute inset-x-0 top-20 h-px" />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="eyebrow animate-rise">{siteConfig.tagline}</p>
          <h1 className="animate-rise-delay mt-5 text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            Le trajet devient <span className="text-gradient-gold italic">un moment</span>.
          </h1>
          <p className="lead animate-rise-delay-2 mt-7 max-w-xl">
            Chauffeur privé à bord d’Audi Q8 hybrides, pour vos transferts aéroports, vos rendez-vous et vos
            soirées en Île-de-France. Prix fixé avant le départ, réservation en trois étapes.
          </p>
          <div className="animate-rise-delay-2 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/reservation" className="btn-gold">
              Réserver un trajet
            </Link>
            <a href={`tel:${siteConfig.phone.e164}`} className="btn-ghost">
              {siteConfig.phone.display}
            </a>
          </div>
          <ul className="text-mist mt-10 flex flex-wrap gap-x-8 gap-y-2 text-xs tracking-wide">
            <li className="before:text-gold before:mr-2 before:content-['◆']">{siteConfig.hours}</li>
            <li className="before:text-gold before:mr-2 before:content-['◆']">Prix garanti, sans supplément trafic</li>
            <li className="before:text-gold before:mr-2 before:content-['◆']">Annulation gratuite jusqu’à 24 h</li>
          </ul>
        </div>

        <div className="relative">
          <div className="card animate-rise-delay-2 relative overflow-hidden p-7 sm:p-9">
            <CarSilhouette className="text-gold/70 mx-auto w-full max-w-sm" />
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="eyebrow">Flotte</p>
                <p className="font-display mt-2 text-3xl">{pricingConfig.vehicles[0].name}</p>
                <p className="text-mist text-sm">{pricingConfig.vehicles[0].tagline}</p>
              </div>
              <p className="text-mist text-right text-xs">
                {pricingConfig.vehicles[0].fleetCount} véhicules
                <br />
                {pricingConfig.vehicles[0].passengers} passagers · {pricingConfig.vehicles[0].luggage} bagages
              </p>
            </div>
            <ul className="border-line mt-6 divide-y border-t text-sm">
              {featured.map(([a, b]) => (
                <li key={`${a}-${b}`} className="divide-line flex items-center justify-between py-3">
                  <span className="text-cream/85">
                    {zoneLabel(a)} <span className="text-gold">→</span> {zoneLabel(b)}
                  </span>
                  <span className="font-display text-gold-2 text-2xl">{formatPrice(price(a, b) ?? 0)}</span>
                </li>
              ))}
            </ul>
            <p className="text-mist-2 mt-4 text-[11px]">Forfaits par véhicule, hors majorations de nuit et dimanche.</p>
          </div>
          <div
            aria-hidden
            className="bg-gold/20 absolute -right-10 -bottom-10 -z-10 h-48 w-48 rounded-full blur-3xl"
          />
        </div>
      </div>
    </section>
  )
}
