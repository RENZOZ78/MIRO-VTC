import { siteConfig } from '@/config/site'
import { firstIssue, jsonError, readJson } from '@/lib/api'
import { contactRequestSchema } from '@/lib/booking'
import { sendContactEmail } from '@/lib/mail'
import { clientIp, rateLimit, tooManyRequests } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const limiter = rateLimit(`contact:${clientIp(request)}`, { limit: 6, windowMs: 10 * 60_000 })
  if (!limiter.ok) return tooManyRequests(limiter.retryAfterSeconds)

  const parsed = contactRequestSchema.safeParse(await readJson(request))
  if (!parsed.success) return jsonError(400, firstIssue(parsed.error))
  if (parsed.data.website) return Response.json({ ok: true })

  try {
    const result = await sendContactEmail(parsed.data)
    return Response.json({ ok: true, simulated: result?.simulated ?? true })
  } catch (error) {
    console.error('[api/contact]', (error as Error).message)
    return jsonError(502, `Votre message n’a pas pu être envoyé. Appelez-nous au ${siteConfig.phone.display}.`)
  }
}
