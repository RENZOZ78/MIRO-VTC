import { CarSilhouette } from '@/components/CarSilhouette'
import { pricingConfig } from '@/config/pricing'

export function Fleet() {
  return (
    <section className="container-x mt-24" id="flotte">
      {pricingConfig.vehicles.map((v) => (
        <div key={v.id} className="card grid gap-10 overflow-hidden p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Flotte</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">{v.name}</h2>
            <p className="text-gold-2 mt-2 text-sm tracking-wide">{v.tagline}</p>
            <p className="lead mt-6">{v.description}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {v.features.map((f) => (
                <li key={f} className="text-cream/85 flex items-start gap-3 text-sm">
                  <span className="text-gold mt-0.5">◆</span>
                  {f}
                </li>
              ))}
            </ul>
            <dl className="border-line mt-8 grid grid-cols-3 gap-4 border-t pt-6 text-center">
              <div>
                <dt className="text-mist text-xs tracking-[0.2em] uppercase">Véhicules</dt>
                <dd className="font-display mt-1 text-3xl">{v.fleetCount}</dd>
              </div>
              <div>
                <dt className="text-mist text-xs tracking-[0.2em] uppercase">Passagers</dt>
                <dd className="font-display mt-1 text-3xl">{v.passengers}</dd>
              </div>
              <div>
                <dt className="text-mist text-xs tracking-[0.2em] uppercase">Bagages</dt>
                <dd className="font-display mt-1 text-3xl">{v.luggage}</dd>
              </div>
            </dl>
          </div>
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(closest-side, rgba(201,163,90,0.22), transparent)' }}
            />
            <CarSilhouette className="text-gold-2 relative w-full" />
            <p className="text-mist-2 mt-4 text-center text-xs">
              Illustration. Les photos des véhicules peuvent être ajoutées dans <code>public/images/</code>.
            </p>
          </div>
        </div>
      ))}
    </section>
  )
}
