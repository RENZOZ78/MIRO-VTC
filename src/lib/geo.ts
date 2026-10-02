/**
 * Adresses et itinéraires via la Géoplateforme IGN (data.geopf.fr).
 *
 * - Géocodage : https://data.geopf.fr/geocodage/search (format GeoJSON, type BAN)
 * - Itinéraire : https://data.geopf.fr/navigation/itineraire (moteur OSRM sur BD TOPO)
 *
 * Si le service est indisponible, `getRoute` renvoie une estimation à vol
 * d'oiseau corrigée, signalée par `source: 'estimation'`.
 */
import type { Coordinates } from '@/config/pricing'
import { haversineKm } from '@/lib/pricing'

export const GEOCODE_ENDPOINT = 'https://data.geopf.fr/geocodage/search'
export const ROUTE_ENDPOINT = 'https://data.geopf.fr/navigation/itineraire'

const DEFAULT_TIMEOUT_MS = 6000

export type Place = Coordinates & {
  label: string
  name?: string
  city?: string
  postcode?: string
  type?: string
  score?: number
}

export type RouteResult = {
  distanceKm: number
  durationMin: number
  source: 'ign' | 'estimation'
}

/** Emprise de la France métropolitaine, pour écarter des coordonnées aberrantes. */
export function isInMetropolitanFrance(p: Coordinates): boolean {
  return p.lon >= -5.5 && p.lon <= 10 && p.lat >= 41 && p.lat <= 51.5
}

async function fetchJson(url: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<unknown> {
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} sur ${new URL(url).pathname}`)
  }
  return res.json()
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null

/**
 * Transforme une réponse GeoJSON du géocodeur en liste de lieux.
 * Format attendu : { type: 'FeatureCollection', features: [{ geometry: { coordinates: [lon, lat] }, properties: { label, name, city, postcode, type, score } }] }
 */
export function parseGeocodeResponse(json: unknown): Place[] {
  if (!isRecord(json) || !Array.isArray(json.features)) return []
  const places: Place[] = []
  for (const feature of json.features) {
    if (!isRecord(feature)) continue
    const geometry = isRecord(feature.geometry) ? feature.geometry : undefined
    const coords = Array.isArray(geometry?.coordinates) ? geometry.coordinates : undefined
    const props = isRecord(feature.properties) ? feature.properties : {}
    const lon = Number(coords?.[0] ?? props.x)
    const lat = Number(coords?.[1] ?? props.y)
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue
    const label = typeof props.label === 'string' ? props.label : undefined
    if (!label) continue
    places.push({
      label,
      name: typeof props.name === 'string' ? props.name : undefined,
      city: typeof props.city === 'string' ? props.city : undefined,
      postcode: typeof props.postcode === 'string' ? props.postcode : undefined,
      type: typeof props.type === 'string' ? props.type : undefined,
      score: typeof props.score === 'number' ? props.score : undefined,
      lon,
      lat,
    })
  }
  return places
}

export function buildGeocodeUrl(query: string, limit = 5): string {
  const url = new URL(GEOCODE_ENDPOINT)
  url.searchParams.set('q', query)
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('autocomplete', '1')
  url.searchParams.set('index', 'address,poi')
  return url.toString()
}

/** Recherche d'adresses (autocomplétion). Lève une erreur si le service échoue. */
export async function searchAddresses(query: string, limit = 5): Promise<Place[]> {
  const q = query.trim()
  if (q.length < 3) return []
  const json = await fetchJson(buildGeocodeUrl(q, limit))
  return parseGeocodeResponse(json)
}

export function buildRouteUrl(from: Coordinates, to: Coordinates): string {
  const url = new URL(ROUTE_ENDPOINT)
  url.searchParams.set('resource', 'bdtopo-osrm')
  url.searchParams.set('profile', 'car')
  url.searchParams.set('optimization', 'fastest')
  url.searchParams.set('start', `${from.lon},${from.lat}`)
  url.searchParams.set('end', `${to.lon},${to.lat}`)
  url.searchParams.set('distanceUnit', 'kilometer')
  url.searchParams.set('timeUnit', 'minute')
  url.searchParams.set('getSteps', 'false')
  url.searchParams.set('geometryFormat', 'geojson')
  return url.toString()
}

/**
 * Lit la distance et la durée d'une réponse du service d'itinéraire.
 * Format attendu : { distance: number, duration: number, distanceUnit: 'kilometer'|'meter', timeUnit: 'minute'|'second'|'hour', ... }
 */
export function parseRouteResponse(json: unknown): { distanceKm: number; durationMin: number } {
  if (!isRecord(json)) throw new Error('Réponse itinéraire invalide')
  const distance = Number(json.distance)
  const duration = Number(json.duration)
  if (!Number.isFinite(distance) || !Number.isFinite(duration)) {
    throw new Error('Réponse itinéraire sans distance ou durée')
  }
  const distanceUnit = typeof json.distanceUnit === 'string' ? json.distanceUnit : 'kilometer'
  const timeUnit = typeof json.timeUnit === 'string' ? json.timeUnit : 'minute'
  const distanceKm = distanceUnit === 'meter' ? distance / 1000 : distance
  const durationMin = timeUnit === 'second' ? duration / 60 : timeUnit === 'hour' ? duration * 60 : duration
  return { distanceKm, durationMin }
}

/**
 * Estimation de secours : distance à vol d'oiseau × facteur de sinuosité,
 * vitesse moyenne décroissante en zone dense, plus un temps d'approche.
 */
export function estimateRoute(from: Coordinates, to: Coordinates): RouteResult {
  const straight = haversineKm(from, to)
  const distanceKm = straight * 1.35
  const avgSpeedKmh = distanceKm < 8 ? 22 : distanceKm < 30 ? 38 : 60
  const durationMin = (distanceKm / avgSpeedKmh) * 60 + 5
  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    durationMin: Math.round(durationMin),
    source: 'estimation',
  }
}

/** Itinéraire routier IGN, avec repli sur l'estimation en cas d'échec. */
export async function getRoute(from: Coordinates, to: Coordinates): Promise<RouteResult> {
  try {
    const json = await fetchJson(buildRouteUrl(from, to))
    const { distanceKm, durationMin } = parseRouteResponse(json)
    return {
      distanceKm: Math.round(distanceKm * 10) / 10,
      durationMin: Math.round(durationMin),
      source: 'ign',
    }
  } catch (error) {
    console.warn('[geo] itinéraire IGN indisponible, estimation utilisée :', (error as Error).message)
    return estimateRoute(from, to)
  }
}
