import Image from 'next/image'
import Link from 'next/link'
import { CarSilhouette } from '@/components/CarSilhouette'
import { pricingConfig } from '@/config/pricing'
import { siteConfig } from '@/config/site'
import { getDictionary, type Locale } from '@/i18n/dictionaries'
import { formatPrice } from '@/lib/format'
import { publicImage } from '@/lib/images'

const featured = [
  ['paris', 'cdg'],
  ['paris', 'orly'],
  ['paris', 'disney'],
] as const

const copy = {
  fr: {
    eyebrow: siteConfig.tagline,
    title: (
      <>
        Le trajet devient <span className="text-gradient-gold italic">un moment</span>.
      </>
    ),
    lead: 'Chauffeur privé à bord d’Audi Q8 hybrides, pour vos transferts aéroports, vos rendez-vous et vos soirées en Île-de-France. Prix fixé avant le départ, réservation en trois étapes.',
    points: [siteConfig.hours, 'Prix garanti, sans supplément trafic', 'Annulation gratuite jusqu’à 24 h'],
    fleet: 'Flotte',
    tagline: pricingConfig.vehicles[0].tagline as string,
    vehicles: 'véhicules',
    capacity: (p: number, l: number) => `${p} passagers · ${l} bagages`,
    note: 'Forfaits par véhicule, hors majorations de nuit et dimanche.',
  },
  en: {
    eyebrow: 'Private chauffeur in the Paris region',
    title: (
      <>
        The journey becomes <span className="text-gradient-gold italic">a moment</span>.
      </>
    ),
    lead: 'Private chauffeur aboard hybrid Audi Q8s for your airport transfers, meetings and evenings across Paris and Île-de-France. Price fixed before departure, booking in three steps.',
    points: ['7 days a week, 24 h by reservation', 'Guaranteed price, no traffic surcharge', 'Free cancellation up to 24 h'],
    fleet: 'Fleet',
    tagline: 'Premium plug-in hybrid SUV · 2026 model year',
    vehicles: 'vehicles',
    capacity: (p: number, l: number) => `${p} passengers · ${l} bags`,
    note: 'Fixed fares per vehicle, excluding night and Sunday surcharges.',
  },
}

export function Hero({ locale = 'fr' }: { locale?: Locale }) {
  const c = copy[locale]
  const t = getDictionary(locale)
  const zoneLabel = (id: string) => pricingConfig.zones.find((z) => z.id === id)?.label ?? id
  const price = (a: string, b: string) =>
    pricingConfig.flatRates.find(({ zones }) => zones.includes(a) && zones.includes(b))?.price
  const photo = publicImage('hero')
  const vehicle = pricingConfig.vehicles[0]

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {photo && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image src={photo.src} alt="" fill priority sizes="100vw" className="object-cover object-center opacity-60" />
          <div className="from-ink via-ink/85 absolute inset-0 bg-gradient-to-r to-transparent" />
          <div className="from-ink absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t to-transparent" />
        </div>
      )}
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
          <p className="eyebrow animate-rise">{c.eyebrow}</p>
          <h1 className="animate-rise-delay mt-5 text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">{c.title}</h1>
          <p className="lead animate-rise-delay-2 mt-7 max-w-xl">{c.lead}</p>
          <div className="animate-rise-delay-2 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={t.booking.bookingHref} className="btn-gold">
              {t.header.bookLong}
            </Link>
            <a href={`tel:${siteConfig.phone.e164}`} className="btn-ghost">
              {siteConfig.phone.display}
            </a>
          </div>
          <ul className="text-mist mt-10 flex flex-wrap gap-x-8 gap-y-2 text-xs tracking-wide">
            {c.points.map((p) => (
              <li key={p} className="before:text-gold before:mr-2 before:content-['◆']">
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="card animate-rise-delay-2 relative overflow-hidden p-7 sm:p-9">
            <CarSilhouette className="text-gold/70 mx-auto w-full max-w-sm" />
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="eyebrow">{c.fleet}</p>
                <p className="font-display mt-2 text-3xl">{vehicle.name}</p>
                <p className="text-mist text-sm">{c.tagline}</p>
              </div>
              <p className="text-mist text-right text-xs">
                {vehicle.fleetCount} {c.vehicles}
                <br />
                {c.capacity(vehicle.passengers, vehicle.luggage)}
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
            <p className="text-mist-2 mt-4 text-[11px]">{c.note}</p>
          </div>
          <div aria-hidden className="bg-gold/20 absolute -right-10 -bottom-10 -z-10 h-48 w-48 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  )
}
