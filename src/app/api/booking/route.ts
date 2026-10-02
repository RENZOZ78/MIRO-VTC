import { siteConfig } from '@/config/site'
import { firstIssue, jsonError, readJson } from '@/lib/api'
import {
  bookingRequestSchema,
  buildQuote,
  createReference,
  summarizeBooking,
  validateRequestMoments,
} from '@/lib/booking'
import { sendBookingEmails } from '@/lib/mail'
import { clientIp, rateLimit, tooManyRequests } from '@/lib/rate-limit'
import { createCheckoutSession, isStripeConfigured } from '@/lib/stripe'

/**
 * Réservation.
 * - Stripe configuré : le devis est recalculé ici, puis une session Checkout
 *   est créée pour le montant dû (acompte ou totalité). Les e-mails partent
 *   depuis le webhook, une fois le paiement confirmé.
 * - Sinon : demande de réservation confirmée par e-mail, paiement à bord.
 */
export async function POST(request: Request) {
  const limiter = rateLimit(`booking:${clientIp(request)}`, { limit: 12, windowMs: 10 * 60_000 })
  if (!limiter.ok) return tooManyRequests(limiter.retryAfterSeconds)

  const body = await readJson(request)
  const parsed = bookingRequestSchema.safeParse(body)
  if (!parsed.success) return jsonError(400, firstIssue(parsed.error))
  const data = parsed.data

  // Pot de miel rempli : un robot. On répond comme si tout allait bien.
  if (data.website) return Response.json({ mode: 'request', reference: createReference() })

  const momentError = validateRequestMoments(data)
  if (momentError) return jsonError(422, momentError)

  let result
  try {
    result = await buildQuote(data)
  } catch (error) {
    console.error('[api/booking] devis', (error as Error).message)
    return jsonError(500, 'Impossible de calculer le prix pour le moment.')
  }

  const reference = createReference()

  if (isStripeConfigured()) {
    const summary = summarizeBooking(data, result, reference, 'pending')
    try {
      const session = await createCheckoutSession(summary, {
        successUrl: `${siteConfig.url}/reservation/confirmation`,
        cancelUrl: `${siteConfig.url}/reservation/annulation`,
      })
      if (!session.url) throw new Error('Session Stripe sans URL')
      return Response.json({ mode: 'stripe', reference, url: session.url, quote: result.quote })
    } catch (error) {
      console.error('[api/booking] stripe', (error as Error).message)
      return jsonError(502, `Le paiement en ligne est momentanément indisponible. Appelez-nous au ${siteConfig.phone.display}.`)
    }
  }

  const summary = summarizeBooking(data, result, reference, 'onboard')
  try {
    const mail = await sendBookingEmails(summary)
    return Response.json({
      mode: 'request',
      reference,
      quote: result.quote,
      simulated: mail.customer.simulated,
    })
  } catch (error) {
    console.error('[api/booking] mail', (error as Error).message)
    return jsonError(502, `Votre demande n’a pas pu être transmise. Appelez-nous au ${siteConfig.phone.display}.`)
  }
}
