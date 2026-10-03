import Image from 'next/image'
import { CarSilhouette } from '@/components/CarSilhouette'
import { pricingConfig } from '@/config/pricing'
import type { Locale } from '@/i18n/dictionaries'
import { publicImage } from '@/lib/images'

const copy = {
  fr: {
    eyebrow: 'Flotte',
    vehicles: 'Véhicules',
    passengers: 'Passagers',
    luggage: 'Bagages',
    note: 'Illustration. Les photos des véhicules peuvent être ajoutées dans',
    tagline: pricingConfig.vehicles[0].tagline,
    description: pricingConfig.vehicles[0].description,
    features: pricingConfig.vehicles[0].features as readonly string[],
  },
  en: {
    eyebrow: 'Fleet',
    vehicles: 'Vehicles',
    passengers: 'Passengers',
    luggage: 'Bags',
    note: 'Illustration. Vehicle photos can be added to',
    tagline: 'Premium plug-in hybrid SUV · 2026 model year',
    description:
      'Leather cabin, air suspension and electric silence in town: the hybrid Q8 combines the comfort of an executive saloon with the presence of an SUV.',
    features: ['Plug-in hybrid, silent drive', 'Heated and ventilated leather seats', 'Chilled water, chargers and Wi-Fi on board', 'Four-zone climate control', 'Tinted rear windows'],
  },
}

export function Fleet({ locale = 'fr' }: { locale?: Locale }) {
  const photo = publicImage('interior')
  const c = copy[locale]
  return (
    <section className="container-x mt-24" id="flotte">
      {pricingConfig.vehicles.map((v) => (
        <div key={v.id} className="card grid gap-10 overflow-hidden p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">{v.name}</h2>
            <p className="text-gold-2 mt-2 text-sm tracking-wide">{c.tagline}</p>
            <p className="lead mt-6">{c.description}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {c.features.map((f) => (
                <li key={f} className="text-cream/85 flex items-start gap-3 text-sm">
                  <span className="text-gold mt-0.5">◆</span>
                  {f}
                </li>
              ))}
            </ul>
            <dl className="border-line mt-8 grid grid-cols-3 gap-4 border-t pt-6 text-center">
              <div>
                <dt className="text-mist text-xs tracking-[0.2em] uppercase">{c.vehicles}</dt>
                <dd className="font-display mt-1 text-3xl">{v.fleetCount}</dd>
              </div>
              <div>
                <dt className="text-mist text-xs tracking-[0.2em] uppercase">{c.passengers}</dt>
                <dd className="font-display mt-1 text-3xl">{v.passengers}</dd>
              </div>
              <div>
                <dt className="text-mist text-xs tracking-[0.2em] uppercase">{c.luggage}</dt>
                <dd className="font-display mt-1 text-3xl">{v.luggage}</dd>
              </div>
            </dl>
          </div>
          {photo ? (
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1024px) 100vw, 540px" className="object-cover" />
            </div>
          ) : (
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-0 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(closest-side, rgba(201,163,90,0.22), transparent)' }}
              />
              <CarSilhouette className="text-gold-2 relative w-full" />
              <p className="text-mist-2 mt-4 text-center text-xs">
                {c.note} <code>public/images/</code>.
              </p>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
