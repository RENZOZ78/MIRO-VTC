import type { Metadata } from 'next'
import { BookingForm } from '@/components/BookingForm'
import { CtaBand } from '@/components/CtaBand'
import { DestinationsGrid } from '@/components/sections/DestinationsGrid'
import { Faq } from '@/components/sections/Faq'
import { Fleet } from '@/components/sections/Fleet'
import { Hero } from '@/components/sections/Hero'
import { Pillars } from '@/components/sections/Pillars'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { Steps } from '@/components/sections/Steps'
import { pricingConfig } from '@/config/pricing'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — Private chauffeur in Paris & Île-de-France` },
  description:
    'MIRO VTC, private chauffeur in the Paris region: airport and station transfers, hourly hire and long-distance journeys aboard hybrid Audi Q8s. Online booking, price fixed in advance.',
  alternates: { canonical: '/en', languages: { fr: '/', en: '/en' } },
}

const faq = [
  {
    question: 'How is the price calculated?',
    answer:
      'Between two fixed-fare zones (Paris, airports, La Défense, Versailles, Disneyland) the price is fixed. Otherwise it combines a pick-up fee, the distance and the duration estimated on the actual route, with a minimum fare. It is shown before you book and does not change.',
  },
  {
    question: 'Can I pay on board?',
    answer: 'Yes, by card or cash. When online payment is offered, a deposit secures the booking and the balance is paid to the chauffeur.',
  },
  {
    question: 'What happens if my flight is delayed?',
    answer: 'We track your flight and adjust the pick-up time. Waiting caused by a late landing is included.',
  },
  {
    question: 'How many passengers can you carry?',
    answer: `Four passengers and four bags per vehicle. Up to ${siteConfig.booking.maxPassengers} passengers, we assign our ${pricingConfig.vehicles[0].fleetCount} vehicles.`,
  },
  {
    question: 'How do I cancel or change a booking?',
    answer: 'By phone or email, quoting your reference. Cancellation is free up to 24 hours before the pick-up.',
  },
]

export default function HomePageEn() {
  return (
    <>
      <Hero locale="en" />
      <Pillars locale="en" />
      <section className="container-x mt-24" id="book">
        <div className="max-w-2xl">
          <p className="eyebrow">Book</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Your price in a few seconds.</h2>
        </div>
        <div className="mt-10">
          <BookingForm />
        </div>
      </section>
      <ServicesGrid locale="en" />
      <Fleet locale="en" />
      <Steps locale="en" />
      <DestinationsGrid locale="en" />
      <Faq items={faq} locale="en" />
      <CtaBand locale="en" />
    </>
  )
}
