import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Paiement annulé',
  robots: { index: false, follow: false },
}

export default async function AnnulationPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams
  return (
    <>
      <PageHeader
        eyebrow="Réservation"
        title="Paiement annulé."
        lead="Aucun montant n’a été débité et aucune réservation n’a été enregistrée. Vous pouvez reprendre la réservation quand vous le souhaitez."
      />
      <section className="container-x">
        <div className="card max-w-2xl p-8">
          {ref && (
            <p className="text-mist text-sm">
              Référence abandonnée : <span className="text-cream">{ref}</span>
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/reservation" className="btn-gold">
              Reprendre la réservation
            </Link>
            <a href={`tel:${siteConfig.phone.e164}`} className="btn-ghost">
              Réserver par téléphone
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
