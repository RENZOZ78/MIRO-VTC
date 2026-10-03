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
  title: 'Entreprises, hôtels et conciergeries',
  description:
    'Chauffeur privé pour les entreprises en Île-de-France : transport de clients, invités et collaborateurs, mise à disposition, facturation mensuelle, réservation pour un tiers. Hôtels, conciergeries, cabinets, agences.',
  alternates: { canonical: '/entreprises', languages: { fr: '/entreprises', en: '/en/business' } },
}

const audiences = [
  {
    title: 'Hôtels et conciergeries',
    text: 'Transferts de vos clients vers les aéroports et les gares, mises à disposition pour une journée de visites. Vous réservez pour eux, ils reçoivent la confirmation, vous recevez la facture.',
  },
  {
    title: 'Cabinets, sièges et directions',
    text: 'Déplacements de dirigeants et de clients entre La Défense, Paris et les aéroports. Discrétion, ponctualité et un véhicule silencieux où l’on peut travailler.',
  },
  {
    title: 'Agences événementielles',
    text: 'Navettes d’invités, transferts de talents et d’intervenants, retours de soirée. Jusqu’à deux véhicules coordonnés, un seul interlocuteur.',
  },
  {
    title: 'Production et médias',
    text: 'Trajets plateau ↔ hôtel, horaires décalés, attente comprise entre deux prises. Nous nous adaptons au planning du tournage.',
  },
]

const commitments = [
  { title: 'Facturation mensuelle', text: 'Un relevé unique par mois avec le détail de chaque course, reçu individuel sur demande.' },
  { title: 'Réservation pour un tiers', text: 'Votre assistant réserve ; le passager reçoit la confirmation et le fichier calendrier.' },
  { title: 'Tarifs annoncés', text: 'Forfaits aéroports et compteur transparent ; grille négociée au-delà d’un volume régulier.' },
  { title: 'Interlocuteur unique', text: 'Un numéro direct, une réponse rapide, le même chauffeur autant que possible.' },
  { title: 'Confidentialité', text: 'Vitres surteintées, aucune conversation rapportée, données traitées sans sous-traitant inutile.' },
  { title: 'Disponibilité', text: 'Sept jours sur sept, de jour comme de nuit, départs immédiats selon disponibilité.' },
]

const faq = [
  {
    question: 'Comment ouvrir un compte entreprise ?',
    answer:
      'Contactez-nous via le formulaire ci-dessous ou par téléphone. Nous convenons des modalités (adresses habituelles, personnes autorisées à réserver, facturation) en quelques minutes.',
  },
  {
    question: 'Peut-on réserver plusieurs véhicules ?',
    answer: `Oui, nos ${pricingConfig.vehicles[0].fleetCount} Audi Q8 peuvent être affectés ensemble (jusqu’à ${siteConfig.booking.maxPassengers} passagers). Au-delà, nous organisons le complément avec des partenaires de confiance.`,
  },
  {
    question: 'Proposez-vous un tarif pour les trajets réguliers ?',
    answer: 'Oui. Au-delà d’un volume mensuel régulier, nous établissons une grille dédiée, valable sur l’ensemble de vos trajets.',
  },
  {
    question: 'Le paiement en ligne est-il obligatoire ?',
    answer: 'Non. Les comptes entreprise sont facturés mensuellement ; le paiement en ligne reste possible pour une course isolée.',
  },
]

export default function EntreprisesPage() {
  const photo = publicImage('business')
  return (
    <>
      <PageHeader
        eyebrow="Entreprises"
        title="Le chauffeur de vos clients, invités et équipes."
        lead="Hôtels, conciergeries, cabinets, agences : un service de chauffeur privé fiable, facturé mensuellement, avec un interlocuteur unique."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/contact?objet=entreprise" className="btn-gold">
            Ouvrir un compte entreprise
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
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover" priority />
            <div aria-hidden className="from-ink/70 absolute inset-0 bg-gradient-to-t to-transparent" />
          </div>
        </section>
      )}

      <section className="container-x mt-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Pour qui</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Quatre métiers, une même exigence.</h2>
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
          <p className="eyebrow">Engagements</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Ce que comprend un compte entreprise.</h2>
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
            <p className="eyebrow">Tarifs entreprise</p>
            <h2 className="mt-3 text-3xl">Les mêmes prix clairs, un relevé par mois.</h2>
            <p className="text-mist mt-4 leading-relaxed">
              Forfaits aéroports (Paris ↔ Roissy-CDG {formatPrice(95)}, Paris ↔ Orly {formatPrice(75)}, La Défense ↔
              Roissy-CDG {formatPrice(95)}), compteur transparent ailleurs, mise à disposition à{' '}
              {formatPrice(pricingConfig.hourly.pricePerHour)} de l’heure. Grille dédiée à partir d’un volume mensuel
              régulier.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <Link href="/tarifs" className="btn-ghost">
              Voir la grille
            </Link>
            <Link href="/contact?objet=entreprise" className="btn-gold">
              Demander une proposition
            </Link>
          </div>
        </div>
      </section>

      <Faq items={faq} title="Questions des entreprises" />
      <CtaBand title="Parlons de vos déplacements." text="Un échange de dix minutes suffit pour ouvrir votre compte et planifier vos premières courses." />
    </>
  )
}
