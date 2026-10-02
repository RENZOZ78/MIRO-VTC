import type { Metadata } from 'next'
import { BookingForm } from '@/components/BookingForm'
import { PageHeader } from '@/components/PageHeader'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Réservation',
  description: `Réservez votre chauffeur privé ${siteConfig.name} en trois étapes : trajet, véhicule, coordonnées. Prix calculé sur l’itinéraire réel et garanti.`,
  alternates: { canonical: '/reservation' },
}

export default function ReservationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Réservation"
        title="Votre chauffeur en trois étapes."
        lead="Indiquez votre trajet, choisissez votre véhicule, laissez vos coordonnées. Le prix est calculé sur l’itinéraire réel et garanti."
      />
      <section className="container-x">
        <BookingForm />
        <p className="text-mist mt-6 text-sm">
          Besoin d’un départ dans moins de {siteConfig.booking.minLeadHours} heures, d’une mise à disposition ou d’un
          trajet hors Île-de-France ? Appelez le{' '}
          <a href={`tel:${siteConfig.phone.e164}`} className="text-gold-2">
            {siteConfig.phone.display}
          </a>
          .
        </p>
      </section>
    </>
  )
}
