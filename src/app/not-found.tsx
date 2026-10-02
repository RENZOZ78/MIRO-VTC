import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'

export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="Erreur 404"
        title="Cette adresse n’existe pas."
        lead="La page demandée est introuvable. Votre chauffeur, lui, connaît toujours le chemin."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-gold">
            Retour à l’accueil
          </Link>
          <Link href="/reservation" className="btn-ghost">
            Réserver un trajet
          </Link>
        </div>
      </PageHeader>
    </>
  )
}
