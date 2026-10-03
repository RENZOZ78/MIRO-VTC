import type Stripe from 'stripe'
import { summaryFromMetadata } from '@/lib/booking'
import { sendBookingEmails } from '@/lib/mail'
import { constructWebhookEvent, isStripeConfigured } from '@/lib/stripe'

/**
 * Webhook Stripe : à la confirmation du paiement, reconstruit la réservation
 * depuis les métadonnées de la session et envoie les e-mails.
 *
 * Événements à activer côté Stripe :
 *   checkout.session.completed, checkout.session.async_payment_succeeded,
 *   checkout.session.async_payment_failed
 */
export async function POST(request: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: 'Stripe non configuré' }, { status: 503 })
  }
  const signature = request.headers.get('stripe-signature')
  if (!signature) return Response.json({ error: 'Signature manquante' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = constructWebhookEvent(await request.text(), signature)
  } catch (error) {
    console.warn('[stripe/webhook] signature invalide :', (error as Error).message)
    return Response.json({ error: 'Signature invalide' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object
      if (session.payment_status !== 'paid') {
        // Paiement différé (virement, etc.) : on attend async_payment_succeeded.
        return Response.json({ received: true, deferred: true })
      }
      const summary = summaryFromMetadata(session.metadata)
      if (!summary) {
        console.error('[stripe/webhook] métadonnées de réservation absentes pour', session.id)
        return Response.json({ received: true, ignored: true })
      }
      summary.payment = {
        status: 'paid',
        amountPaid: (session.amount_total ?? 0) / 100,
        stripeSessionId: session.id,
      }
      try {
        await sendBookingEmails(summary)
      } catch (error) {
        // 500 → Stripe réessaiera la livraison du webhook.
        console.error('[stripe/webhook] e-mail', (error as Error).message)
        return Response.json({ error: 'E-mail non envoyé' }, { status: 500 })
      }
      return Response.json({ received: true })
    }
    case 'checkout.session.async_payment_failed': {
      const session = event.data.object
      console.warn('[stripe/webhook] paiement différé échoué pour', session.client_reference_id ?? session.id)
      return Response.json({ received: true })
    }
    default:
      return Response.json({ received: true, ignored: event.type })
  }
}
