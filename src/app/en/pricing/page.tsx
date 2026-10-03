import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/CtaBand'
import { PageHeader } from '@/components/PageHeader'
import { pricingConfig } from '@/config/pricing'
import { siteConfig } from '@/config/site'
import { formatPrice } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'MIRO VTC private chauffeur fares: fixed prices between Paris, Roissy-CDG, Orly, Beauvais, Disneyland, La Défense and Versailles; transparent metered fare elsewhere.',
  alternates: { canonical: '/en/pricing', languages: { fr: '/tarifs', en: '/en/pricing' } },
}

const zoneLabelsEn: Record<string, string> = {
  paris: 'Paris',
  'la-defense': 'La Défense',
  versailles: 'Versailles',
  cdg: 'Roissy-Charles-de-Gaulle Airport',
  orly: 'Orly Airport',
  beauvais: 'Beauvais-Tillé Airport',
  disney: 'Disneyland Paris',
}

const optionLabelsEn: Record<string, string> = {
  childSeat: 'Child seat / booster',
  meetAndGreet: 'Meet & greet in the terminal',
}

export default function PricingPageEn() {
  const zoneLabel = (id: string) => zoneLabelsEn[id] ?? id
  const { baseFare, perKm, perMinute, minimumFare } = pricingConfig.metered
  const vehicle = pricingConfig.vehicles[0]

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Clear prices, fixed before you leave."
        lead="Fixed fares between the main zones, a transparent metered fare elsewhere. The price shown at booking is guaranteed: no traffic surcharge, no surprise on arrival."
      >
        <Link href="/en/booking" className="btn-gold">
          Get my price
        </Link>
      </PageHeader>

      <section className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow">Fixed fares</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Airports, stations and landmarks</h2>
          <p className="text-mist mt-4">
            Prices incl. VAT per vehicle ({vehicle.passengers} passengers, {vehicle.luggage} bags), both directions. Night
            and Sunday surcharges apply on top.
          </p>
        </div>
        <div className="card mt-8 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink-3/70 text-mist text-left text-xs tracking-[0.2em] uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Journey</th>
                <th className="px-6 py-4 text-right font-semibold">Price</th>
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
          <p className="eyebrow">Metered</p>
          <h2 className="mt-3 text-2xl">Outside fixed fares</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <Row label="Pick-up fee" value={formatPrice(baseFare)} />
            <Row label="Per kilometre" value={formatPrice(perKm)} />
            <Row label="Per minute" value={formatPrice(perMinute)} />
            <Row label="Minimum fare" value={formatPrice(minimumFare)} />
            <Row label="Return trip booked together" value={`−${pricingConfig.returnTripDiscountPercent}%`} />
          </dl>
          <p className="text-mist mt-5 text-xs leading-relaxed">
            Distance and duration are estimated on the actual route when you book; the price is then locked.
          </p>
        </div>
        <div className="card p-7">
          <p className="eyebrow">Surcharges</p>
          <h2 className="mt-3 text-2xl">Night, Sundays and holidays</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <Row
              label={`Night (${pricingConfig.night.startHour}:00 – ${pricingConfig.night.endHour}:00)`}
              value={`+${pricingConfig.night.surchargePercent}%`}
            />
            <Row label="Sundays and public holidays" value={`+${pricingConfig.sundayHoliday.surchargePercent}%`} />
          </dl>
          <p className="text-mist mt-5 text-xs leading-relaxed">
            Surcharges apply to the journey price (fixed or metered) and add up without compounding.
          </p>
        </div>
        <div className="card p-7">
          <p className="eyebrow">Options and payment</p>
          <h2 className="mt-3 text-2xl">À la carte</h2>
          <dl className="mt-5 space-y-3 text-sm">
            {Object.entries(pricingConfig.options).map(([id, o]) => (
              <Row key={id} label={optionLabelsEn[id] ?? o.label} value={formatPrice(o.price)} />
            ))}
            <Row label="More than 4 passengers" value="2 vehicles (×2)" />
          </dl>
          <p className="text-mist mt-5 text-xs leading-relaxed">
            Paid to the chauffeur by card or cash. When online payment is enabled:{' '}
            {pricingConfig.paymentMode === 'deposit'
              ? `${pricingConfig.depositPercent}% deposit by card, balance on board.`
              : 'the full journey is paid by card at booking.'}
          </p>
        </div>
      </section>

      <section className="container-x mt-20 grid gap-6 lg:grid-cols-2">
        <div className="card p-8 sm:p-10">
          <p className="eyebrow">By the hour</p>
          <h2 className="mt-3 text-3xl">
            {formatPrice(pricingConfig.hourly.pricePerHour)} <span className="text-mist text-lg">/ hour</span>
          </h2>
          <p className="text-mist mt-4">
            Minimum {pricingConfig.hourly.minimumHours} h, up to {pricingConfig.hourly.maximumHours} h online.{' '}
            {pricingConfig.hourly.includedKmPerHour} km included per hour; the chauffeur and the vehicle stay with you,
            free itinerary. Night and Sunday surcharges apply.
          </p>
          <Link href="/en/booking" className="btn-gold mt-6">
            Book by the hour
          </Link>
        </div>
        <div className="card p-8 sm:p-10">
          <p className="eyebrow">Long distance and events</p>
          <h2 className="mt-3 text-3xl">Quoted in minutes</h2>
          <p className="text-mist mt-4">
            A journey to another region, a wedding, guest shuttles: call{' '}
            <a href={`tel:${siteConfig.phone.e164}`} className="text-gold-2">
              {siteConfig.phone.display}
            </a>{' '}
            or describe your needs through the contact form. You receive a firm price, tolls included.
          </p>
          <Link href="/en/contact" className="btn-ghost mt-6">
            Request a quote
          </Link>
        </div>
      </section>

      <CtaBand locale="en" title="Get your exact price." text="Enter your journey: the fare appears immediately and is guaranteed at booking." />
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
