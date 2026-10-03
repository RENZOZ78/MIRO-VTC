import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/CtaBand'
import { PageHeader } from '@/components/PageHeader'
import { pricingConfig } from '@/config/pricing'
import { siteConfig } from '@/config/site'
import { formatPrice } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Tarifs',
  description:
    'Tarifs chauffeur privé MIRO VTC : forfaits fixes Paris, Roissy-CDG, Orly, Beauvais, Disneyland, La Défense et Versailles ; tarif au compteur transparent ailleurs.',
  alternates: { canonical: '/tarifs', languages: { fr: '/tarifs', en: '/en/pricing' } },
}

export default function TarifsPage() {
  const zoneLabel = (id: string) => pricingConfig.zones.find((z) => z.id === id)?.label ?? id
  const { baseFare, perKm, perMinute, minimumFare } = pricingConfig.metered
  const vehicle = pricingConfig.vehicles[0]

  return (
    <>
      <PageHeader
        eyebrow="Tarifs"
        title="Des prix clairs, fixés avant de partir."
        lead={
          <>
            Forfaits entre les grandes zones, tarif au compteur transparent ailleurs. Le prix affiché à la réservation
            est garanti : ni supplément trafic, ni surprise à l’arrivée.
          </>
        }
      >
        <Link href="/reservation" className="btn-gold">
          Calculer mon prix
        </Link>
      </PageHeader>

      <section className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow">Forfaits</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Aéroports, gares et grands sites</h2>
          <p className="text-mist mt-4">
            Prix TTC par véhicule ({vehicle.passengers} passagers, {vehicle.luggage} bagages), dans les deux sens.
            Majorations de nuit et de dimanche en sus.
          </p>
        </div>
        <div className="card mt-8 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink-3/70 text-mist text-left text-xs tracking-[0.2em] uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Trajet</th>
                <th className="px-6 py-4 text-right font-semibold">Prix</th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {pricingConfig.flatRates.map(({ zones, price }) => (
                <tr key={zones.join('-')} className="hover:bg-ink-3/40">
                  <td className="px-6 py-4">
                    {zoneLabel(zones[0])} <span className="text-gold">↔</span> {zoneLabel(zones[1])}
                  </td>
                  <td className="font-display text-gold-2 px-6 py-4 text-right text-2xl">{formatPrice(price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="container-x mt-20 grid gap-6 lg:grid-cols-3">
        <div className="card p-7">
          <p className="eyebrow">Au compteur</p>
          <h2 className="mt-3 text-2xl">Hors forfait</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <Row label="Prise en charge" value={formatPrice(baseFare)} />
            <Row label="Par kilomètre" value={formatPrice(perKm)} />
            <Row label="Par minute" value={formatPrice(perMinute)} />
            <Row label="Minimum de course" value={formatPrice(minimumFare)} />
            <Row label="Aller-retour réservé ensemble" value={`−${pricingConfig.returnTripDiscountPercent} %`} />
          </dl>
          <p className="text-mist mt-5 text-xs leading-relaxed">
            Distance et durée estimées sur l’itinéraire réel au moment de la réservation ; le prix est ensuite figé.
          </p>
        </div>
        <div className="card p-7">
          <p className="eyebrow">Majorations</p>
          <h2 className="mt-3 text-2xl">Nuit, dimanche et fériés</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <Row
              label={`Nuit (${pricingConfig.night.startHour} h – ${pricingConfig.night.endHour} h)`}
              value={`+${pricingConfig.night.surchargePercent} %`}
            />
            <Row label="Dimanche et jours fériés" value={`+${pricingConfig.sundayHoliday.surchargePercent} %`} />
          </dl>
          <p className="text-mist mt-5 text-xs leading-relaxed">
            Les majorations s’appliquent sur le prix du trajet (forfait ou compteur) et se cumulent sans se composer.
          </p>
        </div>
        <div className="card p-7">
          <p className="eyebrow">Options et paiement</p>
          <h2 className="mt-3 text-2xl">À la carte</h2>
          <dl className="mt-5 space-y-3 text-sm">
            {Object.values(pricingConfig.options).map((o) => (
              <Row key={o.label} label={o.label} value={formatPrice(o.price)} />
            ))}
            <Row
              label="Au-delà de 4 passagers"
              value={`2 véhicules (×2)`}
            />
          </dl>
          <p className="text-mist mt-5 text-xs leading-relaxed">
            Règlement au chauffeur par carte ou espèces. Lorsque le paiement en ligne est activé :{' '}
            {pricingConfig.paymentMode === 'deposit'
              ? `acompte de ${pricingConfig.depositPercent} % par carte, solde à bord.`
              : 'totalité du trajet par carte à la réservation.'}
          </p>
        </div>
      </section>

      <section className="container-x mt-20 grid gap-6 lg:grid-cols-2">
        <div className="card p-8 sm:p-10">
          <p className="eyebrow">Mise à disposition</p>
          <h2 className="mt-3 text-3xl">
            {formatPrice(pricingConfig.hourly.pricePerHour)} <span className="text-mist text-lg">/ heure</span>
          </h2>
          <p className="text-mist mt-4">
            Minimum {pricingConfig.hourly.minimumHours} h, jusqu’à {pricingConfig.hourly.maximumHours} h en ligne.{' '}
            {pricingConfig.hourly.includedKmPerHour} km compris par heure ; le chauffeur et le véhicule restent à votre
            disposition, itinéraire libre. Majorations nuit et dimanche applicables.
          </p>
          <Link href="/reservation" className="btn-gold mt-6">
            Réserver à l’heure
          </Link>
        </div>
        <div className="card p-8 sm:p-10">
          <p className="eyebrow">Longue distance et événements</p>
          <h2 className="mt-3 text-3xl">Sur devis, en quelques minutes</h2>
          <p className="text-mist mt-4">
            Trajet vers une autre région, mariage, navettes d’invités : appelez le{' '}
            <a href={`tel:${siteConfig.phone.e164}`} className="text-gold-2">
              {siteConfig.phone.display}
            </a>{' '}
            ou décrivez votre besoin via le formulaire de contact. Vous recevez un prix ferme, péages compris.
          </p>
          <Link href="/contact" className="btn-ghost mt-6">
            Demander un devis
          </Link>
        </div>
      </section>

      <CtaBand title="Calculez votre prix exact." text="Entrez votre trajet : le tarif s’affiche immédiatement, garanti à la réservation." />
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-line flex items-center justify-between border-b pb-3">
      <dt className="text-mist">{label}</dt>
      <dd className="text-cream font-semibold">{value}</dd>
    </div>
  )
}
