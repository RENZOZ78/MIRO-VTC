import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  buildGeocodeUrl,
  buildRouteUrl,
  estimateRoute,
  getRoute,
  isInMetropolitanFrance,
  parseGeocodeResponse,
  parseRouteResponse,
} from '@/lib/geo'

/** Extrait d'une réponse du géocodeur Géoplateforme (format GeoJSON / BAN). */
const GEOCODE_FIXTURE = {
  type: 'FeatureCollection',
  version: 'draft',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [2.331, 48.8695] },
      properties: {
        label: '10 Rue de la Paix 75002 Paris',
        score: 0.9714,
        housenumber: '10',
        id: '75102_7070_00010',
        name: '10 Rue de la Paix',
        postcode: '75002',
        citycode: '75102',
        x: 650900.5,
        y: 6863300.1,
        city: 'Paris',
        district: 'Paris 2e Arrondissement',
        context: '75, Paris, Île-de-France',
        type: 'housenumber',
        importance: 0.7,
        street: 'Rue de la Paix',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [2.5479, 49.0097] },
      properties: { label: 'Aéroport Charles de Gaulle', name: 'Aéroport Charles de Gaulle', type: 'poi', city: 'Roissy-en-France', postcode: '95700', score: 0.8 },
    },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.3, 48.8] }, properties: { score: 0.5 } },
  ],
  attribution: 'BAN',
  licence: 'ETALAB-2.0',
  query: '10 rue de la paix',
  limit: 5,
}

/** Extrait d'une réponse du service d'itinéraire (resource bdtopo-osrm). */
const ROUTE_FIXTURE = {
  resource: 'bdtopo-osrm',
  resourceVersion: '2024-01-01',
  start: '2.331,48.8695',
  end: '2.5479,49.0097',
  profile: 'car',
  optimization: 'fastest',
  geometry: { type: 'LineString', coordinates: [[2.331, 48.8695], [2.5479, 49.0097]] },
  crs: 'EPSG:4326',
  distanceUnit: 'kilometer',
  timeUnit: 'minute',
  bbox: [2.331, 48.8695, 2.5479, 49.0097],
  distance: 31.42,
  duration: 38.7,
  constraints: [],
  portions: [],
}

describe('géocodage', () => {
  it('construit l’URL de recherche sur data.geopf.fr', () => {
    const url = new URL(buildGeocodeUrl('10 rue de la paix', 5))
    expect(url.origin + url.pathname).toBe('https://data.geopf.fr/geocodage/search')
    expect(url.searchParams.get('q')).toBe('10 rue de la paix')
    expect(url.searchParams.get('limit')).toBe('5')
  })

  it('lit les lieux d’une réponse GeoJSON et ignore les entrées sans libellé', () => {
    const places = parseGeocodeResponse(GEOCODE_FIXTURE)
    expect(places).toHaveLength(2)
    expect(places[0]).toMatchObject({
      label: '10 Rue de la Paix 75002 Paris',
      city: 'Paris',
      postcode: '75002',
      lon: 2.331,
      lat: 48.8695,
      type: 'housenumber',
    })
    expect(places[1].type).toBe('poi')
  })

  it('renvoie une liste vide sur une réponse inattendue', () => {
    expect(parseGeocodeResponse(null)).toEqual([])
    expect(parseGeocodeResponse({ error: 'oops' })).toEqual([])
  })
})

describe('itinéraire', () => {
  it('construit l’URL d’itinéraire avec les bons paramètres', () => {
    const url = new URL(buildRouteUrl({ lon: 2.331, lat: 48.8695 }, { lon: 2.5479, lat: 49.0097 }))
    expect(url.origin + url.pathname).toBe('https://data.geopf.fr/navigation/itineraire')
    expect(url.searchParams.get('resource')).toBe('bdtopo-osrm')
    expect(url.searchParams.get('start')).toBe('2.331,48.8695')
    expect(url.searchParams.get('end')).toBe('2.5479,49.0097')
    expect(url.searchParams.get('distanceUnit')).toBe('kilometer')
    expect(url.searchParams.get('timeUnit')).toBe('minute')
  })

  it('lit distance et durée en kilomètres et minutes', () => {
    expect(parseRouteResponse(ROUTE_FIXTURE)).toEqual({ distanceKm: 31.42, durationMin: 38.7 })
  })

  it('convertit mètres et secondes si le service répond dans ces unités', () => {
    const r = parseRouteResponse({ ...ROUTE_FIXTURE, distanceUnit: 'meter', timeUnit: 'second', distance: 31420, duration: 2322 })
    expect(r.distanceKm).toBeCloseTo(31.42, 2)
    expect(r.durationMin).toBeCloseTo(38.7, 2)
  })

  it('rejette une réponse sans distance', () => {
    expect(() => parseRouteResponse({ duration: 10 })).toThrow()
  })
})

describe('estimation de secours', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('produit une distance routière supérieure au vol d’oiseau', () => {
    const r = estimateRoute({ lon: 2.331, lat: 48.8695 }, { lon: 2.5479, lat: 49.0097 })
    expect(r.source).toBe('estimation')
    expect(r.distanceKm).toBeGreaterThan(25)
    expect(r.distanceKm).toBeLessThan(40)
    expect(r.durationMin).toBeGreaterThan(20)
  })

  it('bascule sur l’estimation quand le service IGN échoue', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('Service Unavailable', { status: 503 })))
    const r = await getRoute({ lon: 2.331, lat: 48.8695 }, { lon: 2.5479, lat: 49.0097 })
    expect(r.source).toBe('estimation')
  })

  it('utilise la réponse IGN quand elle est valide', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json(ROUTE_FIXTURE)))
    const r = await getRoute({ lon: 2.331, lat: 48.8695 }, { lon: 2.5479, lat: 49.0097 })
    expect(r).toEqual({ distanceKm: 31.4, durationMin: 39, source: 'ign' })
  })
})

describe('emprise', () => {
  it('accepte Paris et refuse New York', () => {
    expect(isInMetropolitanFrance({ lon: 2.35, lat: 48.85 })).toBe(true)
    expect(isInMetropolitanFrance({ lon: -74, lat: 40.7 })).toBe(false)
  })
})
