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
  alternates: { canonical: '/', languages: { fr: '/', en: '/en' } },
}

const faq = [
  {
    question: 'Comment le prix est-il calculé ?',
    answer:
      'Entre deux zones à forfait (Paris, aéroports, La Défense, Versailles, Disneyland), le prix est fixe. Sinon, il combine une prise en charge, la distance et la durée estimées sur l’itinéraire réel, avec un minimum de course. Il est affiché avant la réservation et ne change plus.',
  },
  {
    question: 'Puis-je payer à bord ?',
    answer:
      'Oui, par carte ou en espèces. Lorsque le paiement en ligne est proposé, un acompte sécurise la réservation et le solde se règle au chauffeur.',
  },
  {
    question: 'Que se passe-t-il si mon vol est en retard ?',
    answer:
      'Nous suivons votre vol et adaptons l’heure de prise en charge. L’attente liée à un retard d’atterrissage est comprise.',
  },
  {
    question: 'Combien de passagers pouvez-vous transporter ?',
    answer: `Quatre passagers et quatre bagages par véhicule. Jusqu’à ${siteConfig.booking.maxPassengers} passagers, nous affectons nos ${pricingConfig.vehicles[0].fleetCount} véhicules.`,
  },
  {
    question: 'Comment annuler ou modifier une réservation ?',
    answer:
      'Par téléphone ou par e-mail, en rappelant votre référence. L’annulation est gratuite jusqu’à 24 heures avant la prise en charge.',
  },
]

export default function HomePage() {
  return (
    <>
      <Hero />
      <Pillars />
      <section className="container-x mt-24" id="reserver">
        <div className="max-w-2xl">
          <p className="eyebrow">Réserver</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Votre prix en quelques secondes.</h2>
        </div>
        <div className="mt-10">
          <BookingForm />
        </div>
      </section>
      <ServicesGrid />
      <Fleet />
      <Steps />
      <DestinationsGrid />
      <Faq items={faq} />
      <CtaBand />
    </>
  )
}
