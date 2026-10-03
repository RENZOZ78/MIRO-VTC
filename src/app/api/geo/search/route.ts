import type { NextRequest } from 'next/server'
import { jsonError } from '@/lib/api'
import { searchAddresses } from '@/lib/geo'
import { clientIp, rateLimit, tooManyRequests } from '@/lib/rate-limit'

/** Autocomplétion d'adresses (proxy vers la Géoplateforme IGN). */
export async function GET(request: NextRequest) {
  const limiter = rateLimit(`geo:${clientIp(request)}`, { limit: 90, windowMs: 60_000 })
  if (!limiter.ok) return tooManyRequests(limiter.retryAfterSeconds)

  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 3) return Response.json({ places: [] })
  if (q.length > 200) return jsonError(400, 'Recherche trop longue')

  try {
    const places = await searchAddresses(q, 6)
    return Response.json({ places }, { headers: { 'Cache-Control': 'private, max-age=60' } })
  } catch (error) {
    console.error('[api/geo/search]', (error as Error).message)
    return jsonError(503, 'Le service d’adresses est momentanément indisponible.')
  }
}
