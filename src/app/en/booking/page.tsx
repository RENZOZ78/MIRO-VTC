import type { Metadata } from 'next'
import { BookingForm } from '@/components/BookingForm'
import { PageHeader } from '@/components/PageHeader'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Booking',
  description: `Book your ${siteConfig.name} private chauffeur in three steps: journey, vehicle, details. Price computed on the actual route and guaranteed.`,
  alternates: { canonical: '/en/booking', languages: { fr: '/reservation', en: '/en/booking' } },
}

export default function BookingPageEn() {
  return (
    <>
      <PageHeader
        eyebrow="Booking"
        title="Your chauffeur in three steps."
        lead="Enter your journey, choose your vehicle, leave your details. The price is computed on the actual route and guaranteed."
      />
      <section className="container-x">
        <BookingForm />
        <p className="text-mist mt-6 text-sm">
          Need a departure in less than {siteConfig.booking.minLeadHours} hours, a full-day hire or a journey outside the
          Paris region? Call{' '}
          <a href={`tel:${siteConfig.phone.e164}`} className="text-gold-2">
            {siteConfig.phone.display}
          </a>
          .
        </p>
      </section>
    </>
  )
}
