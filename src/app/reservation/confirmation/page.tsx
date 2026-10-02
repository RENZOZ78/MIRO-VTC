import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { siteConfig } from '@/config/site'
import { summaryFromMetadata, type BookingSummary } from '@/lib/booking'
import { formatDateTimeFr, formatPrice } from '@/lib/format'
import { getStripe, isStripeConfigured } from '@/lib/stripe'

export const metadata: Metadata = {
  title: 'Confirmation',
  robots: { index: false, follow: false },
}

type Search = { session_id?: string; ref?: string; mode?: string }

async function loadStripeSummary(sessionId: string): Promise<{ summary: BookingSummary | null; paid: boolean }> {
  if (!isStripeConfigured() || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return { summary: null, paid: false }
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)
    const summary = summaryFromMetadata(session.metadata)
    const paid = session.payment_status === 'paid'
    if (summary) {
      summary.payment = { status: paid ? 'paid' : 'pending', amountPaid: (session.amount_total ?? 0) / 100, stripeSessionId: session.id }
    }
    return { summary, paid }
  } catch (error) {
    console.error('[confirmation] session Stripe illisible :', (error as Error).message)
    return { summary: null, paid: false }
  }
}

export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { session_id, ref, mode } = await searchParams

  let summary: BookingSummary | null = null
  let paid = false
  if (session_id) ({ summary, paid } = await loadStripeSummary(session_id))

  const reference = summary?.reference ?? ref ?? null
  const isRequest = mode === 'request' || (!session_id && !!ref)

  const title = paid ? 'Réservation confirmée.' : isRequest ? 'Demande bien reçue.' : 'Merci.'
  const lead = paid
    ? 'Votre paiement est validé. Un e-mail récapitulatif vient de vous être envoyé ; votre chauffeur vous attendra à l’adresse et à l’heure indiquées.'
    : isRequest
      ? 'Nous vous confirmons la disponibilité du chauffeur dans les plus brefs délais, par e-mail ou par téléphone. Un récapitulatif vous a été envoyé.'
      : 'Si votre paiement a été accepté, vous recevrez un e-mail de confirmation dans quelques instants.'

  return (
    <>
      <PageHeader eyebrow="Réservation" title={title} lead={lead} />
      <section className="container-x">
        <div className="card max-w-2xl p-8">
          {reference && (
            <>
              <p className="eyebrow">Référence</p>
              <p className="font-display text-gold-2 mt-2 text-4xl">{reference}</p>
            </>
          )}
          {summary && (
            <dl className="border-line mt-6 space-y-3 border-t pt-6 text-sm">
              <Row label="Prise en charge" value={formatDateTimeFr(summary.date, summary.time)} />
              <Row label="Départ" value={summary.from} />
              <Row label="Arrivée" value={summary.to} />
              <Row label="Prix total" value={`${formatPrice(summary.total)} TTC`} />
              {paid && (
                <Row
                  label="Réglé en ligne"
                  value={`${formatPrice(summary.payment.amountPaid ?? summary.dueNow)}${
                    summary.balance > 0 ? ` — solde de ${formatPrice(summary.balance)} au chauffeur` : ''
                  }`}
                />
              )}
            </dl>
          )}
          <p className="text-mist mt-6 text-sm leading-relaxed">
            Un empêchement ? Appelez le{' '}
            <a href={`tel:${siteConfig.phone.e164}`} className="text-gold-2">
              {siteConfig.phone.display}
            </a>{' '}
            en rappelant votre référence. Annulation gratuite jusqu’à 24 h avant la prise en charge.
          </p>
          <div className="mt-8">
            <Link href="/" className="btn-ghost">
              Retour à l’accueil
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
      <dt className="text-mist">{label}</dt>
      <dd className="text-cream sm:text-right">{value}</dd>
    </div>
  )
}
