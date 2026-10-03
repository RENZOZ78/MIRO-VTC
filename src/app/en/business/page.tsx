import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CtaBand } from '@/components/CtaBand'
import { PageHeader } from '@/components/PageHeader'
import { Faq } from '@/components/sections/Faq'
import { WhatsAppLink } from '@/components/WhatsAppButton'
import { pricingConfig } from '@/config/pricing'
import { siteConfig } from '@/config/site'
import { formatPrice } from '@/lib/format'
import { publicImage } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Business, hotels and concierge services',
  description:
    'Private chauffeur for companies in the Paris region: transport for clients, guests and staff, hourly hire, monthly invoicing, booking on behalf of a third party. Hotels, concierge services, firms, agencies.',
  alternates: { canonical: '/en/business', languages: { fr: '/entreprises', en: '/en/business' } },
}

const audiences = [
  {
    title: 'Hotels and concierge services',
    text: 'Transfers for your guests to airports and stations, hourly hire for a day of visits. You book for them, they receive the confirmation, you receive the invoice.',
  },
  {
    title: 'Firms, head offices and executives',
    text: 'Journeys for executives and clients between La Défense, Paris and the airports. Discretion, punctuality and a quiet vehicle where one can work.',
  },
  {
    title: 'Event agencies',
    text: 'Guest shuttles, transfers for talent and speakers, late-night returns. Up to two coordinated vehicles, a single point of contact.',
  },
  {
    title: 'Production and media',
    text: 'Set ↔ hotel journeys, unusual hours, waiting included between takes. We adapt to the shooting schedule.',
  },
]

const commitments = [
  { title: 'Monthly invoicing', text: 'One statement per month with the detail of every ride, individual receipts on request.' },
  { title: 'Booking for a third party', text: 'Your assistant books; the passenger receives the confirmation and the calendar file.' },
  { title: 'Published fares', text: 'Fixed airport fares and a transparent meter; a dedicated grid beyond a regular volume.' },
  { title: 'Single point of contact', text: 'A direct number, a fast answer, the same chauffeur whenever possible.' },
  { title: 'Confidentiality', text: 'Tinted windows, no conversation repeated, data handled without unnecessary processors.' },
  { title: 'Availability', text: 'Seven days a week, day and night, immediate departures subject to availability.' },
]

const faq = [
  {
    question: 'How do I open a business account?',
    answer: 'Contact us through the form below or by phone. We agree on the details (usual addresses, people allowed to book, invoicing) in a few minutes.',
  },
  {
    question: 'Can we book several vehicles?',
    answer: `Yes, our ${pricingConfig.vehicles[0].fleetCount} Audi Q8s can be assigned together (up to ${siteConfig.booking.maxPassengers} passengers). Beyond that, we arrange the complement with trusted partners.`,
  },
  {
    question: 'Do you offer rates for regular journeys?',
    answer: 'Yes. Beyond a regular monthly volume we set a dedicated grid, valid on all your journeys.',
  },
  {
    question: 'Is online payment mandatory?',
    answer: 'No. Business accounts are invoiced monthly; online payment remains available for a one-off ride.',
  },
]

export default function BusinessPageEn() {
  const photo = publicImage('business')
  return (
    <>
      <PageHeader
        eyebrow="Business"
        title="The chauffeur of your clients, guests and teams."
        lead="Hotels, concierge services, firms, agencies: a reliable private chauffeur service, invoiced monthly, with a single point of contact."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/en/contact?topic=entreprise" className="btn-gold">
            Open a business account
          </Link>
          <a href={`tel:${siteConfig.phone.e164}`} className="btn-ghost">
            {siteConfig.phone.display}
          </a>
          <WhatsAppLink>WhatsApp</WhatsAppLink>
        </div>
      </PageHeader>

      {photo && (
        <section className="container-x">
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl">
            <Image src={photo.src} alt="Chauffeur opening the door for a passenger in front of an office tower" fill sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover" priority />
            <div aria-hidden className="from-ink/70 absolute inset-0 bg-gradient-to-t to-transparent" />
          </div>
        </section>
      )}

      <section className="container-x mt-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Who it is for</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Four trades, one standard.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {audiences.map((a) => (
            <article key={a.title} className="card p-7">
              <span className="divider-gold" />
              <h3 className="mt-5 text-2xl">{a.title}</h3>
              <p className="text-mist mt-3 text-sm leading-relaxed">{a.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-x mt-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Commitments</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">What a business account includes.</h2>
        </div>
        <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {commitments.map((c, i) => (
            <li key={c.title}>
              <span className="font-display text-gold/60 text-sm">0{i + 1}</span>
              <h3 className="mt-1 text-xl">{c.title}</h3>
              <p className="text-mist mt-2 text-sm leading-relaxed">{c.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x mt-20">
        <div className="card grid gap-8 p-8 sm:p-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="eyebrow">Business rates</p>
            <h2 className="mt-3 text-3xl">The same clear prices, one statement a month.</h2>
            <p className="text-mist mt-4 leading-relaxed">
              Fixed airport fares (Paris ↔ Roissy-CDG {formatPrice(95)}, Paris ↔ Orly {formatPrice(75)}, La Défense ↔
              Roissy-CDG {formatPrice(95)}), transparent meter elsewhere, hourly hire at{' '}
              {formatPrice(pricingConfig.hourly.pricePerHour)} per hour. Dedicated grid from a regular monthly volume.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <Link href="/en/pricing" className="btn-ghost">
              See the fares
            </Link>
            <Link href="/en/contact?topic=entreprise" className="btn-gold">
              Request a proposal
            </Link>
          </div>
        </div>
      </section>

      <Faq items={faq} title="Questions from companies" locale="en" />
      <CtaBand locale="en" title="Let’s talk about your journeys." text="A ten-minute call is enough to open your account and plan your first rides." />
    </>
  )
}
