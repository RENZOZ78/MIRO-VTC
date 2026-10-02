/**
 * Stripe Checkout. Le montant transmis à Stripe vient exclusivement du devis
 * recalculé côté serveur (BookingSummary.dueNow), jamais du navigateur.
 */
import Stripe from 'stripe'
import { siteConfig } from '@/config/site'
import { summaryToMetadata, type BookingSummary } from '@/lib/booking'
import { formatDateTimeFr, formatPrice } from '@/lib/format'

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY
}

let client: Stripe | null = null

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY manquante')
  if (!client) client = new Stripe(key, { appInfo: { name: siteConfig.name } })
  return client
}

export async function createCheckoutSession(
  summary: BookingSummary,
  { successUrl, cancelUrl }: { successUrl: string; cancelUrl: string },
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe()
  const amountCents = Math.round(summary.dueNow * 100)
  if (!Number.isInteger(amountCents) || amountCents < 50) {
    throw new Error('Montant invalide pour Stripe')
  }
  const isDeposit = summary.paymentMode === 'deposit' && summary.balance > 0
  const name = isDeposit
    ? `Acompte réservation ${summary.reference}`
    : `Réservation ${summary.reference}`
  const description = `${summary.from} → ${summary.to}, ${formatDateTimeFr(summary.date, summary.time)}. Prix total ${formatPrice(summary.total)}${
    isDeposit ? `, solde de ${formatPrice(summary.balance)} à régler au chauffeur` : ''
  }.`

  return stripe.checkout.sessions.create({
    mode: 'payment',
    locale: 'fr',
    customer_email: summary.customer.email,
    client_reference_id: summary.reference,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: amountCents,
          product_data: { name, description },
        },
      },
    ],
    metadata: summaryToMetadata(summary),
    payment_intent_data: {
      description: `${siteConfig.name} ${summary.reference}`,
      metadata: { reference: summary.reference },
    },
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${cancelUrl}?ref=${encodeURIComponent(summary.reference)}`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  })
}

/** Vérifie la signature d'un webhook et renvoie l'événement. */
export function constructWebhookEvent(rawBody: string, signature: string): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET manquante')
  return getStripe().webhooks.constructEvent(rawBody, signature, secret)
}
