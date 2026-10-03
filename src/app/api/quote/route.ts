import { firstIssue, jsonError, readJson } from '@/lib/api'
import { buildQuote, quoteRequestSchema, validateRequestMoments } from '@/lib/booking'
import { clientIp, rateLimit, tooManyRequests } from '@/lib/rate-limit'
import { isStripeConfigured } from '@/lib/stripe'

/** Devis : itinéraire + prix calculés côté serveur. */
export async function POST(request: Request) {
  const limiter = rateLimit(`quote:${clientIp(request)}`, { limit: 40, windowMs: 60_000 })
  if (!limiter.ok) return tooManyRequests(limiter.retryAfterSeconds)

  const parsed = quoteRequestSchema.safeParse(await readJson(request))
  if (!parsed.success) return jsonError(400, firstIssue(parsed.error))

  const momentError = validateRequestMoments(parsed.data)
  if (momentError) return jsonError(422, momentError)

  try {
    const { quote, route } = await buildQuote(parsed.data)
    // `online` indique au formulaire si le paiement par carte est proposé.
    return Response.json({ quote, route, online: isStripeConfigured() })
  } catch (error) {
    console.error('[api/quote]', (error as Error).message)
    return jsonError(500, 'Impossible de calculer le devis pour le moment.')
  }
}
