/**
 * Grille tarifaire, zones, forfaits et véhicules.
 *
 * Tous les montants sont en euros TTC. Cette grille est une proposition
 * cohérente avec un service premium en Île-de-France : à ajuster librement.
 * Le calcul lui-même est dans src/lib/pricing.ts (testé dans tests/pricing.test.ts).
 */

export type Coordinates = { lon: number; lat: number }

export type Zone = {
  id: string
  label: string
  /** Codes postaux (ou préfixes) qui appartiennent à la zone. */
  postcodes?: string[]
  /** Centre et rayon (km) : un point dans ce disque appartient à la zone. */
  center?: Coordinates
  radiusKm?: number
}

export type FlatRate = {
  /** Identifiants de zones, dans n'importe quel ordre (le forfait est symétrique). */
  zones: [string, string]
  /** Prix TTC pour un véhicule, hors majorations. */
  price: number
}

export type Vehicle = {
  id: string
  name: string
  tagline: string
  description: string
  /** Passagers maximum par véhicule. */
  passengers: number
  /** Bagages (format cabine ou valise) par véhicule. */
  luggage: number
  /** Multiplicateur appliqué au prix calculé. */
  coefficient: number
  /** Nombre de véhicules de ce type dans la flotte. */
  fleetCount: number
  features: string[]
}

export const pricingConfig = {
  currency: 'EUR',

  /**
   * Mode de paiement en ligne quand Stripe est configuré :
   * - 'deposit' : acompte de `depositPercent` %, solde réglé au chauffeur ;
   * - 'full'    : totalité du trajet réglée à la réservation.
   */
  paymentMode: 'deposit' as 'deposit' | 'full',
  depositPercent: 30,

  /** Tarif au compteur (quand aucun forfait ne s'applique). */
  metered: {
    /** Prise en charge. */
    baseFare: 10,
    perKm: 2.2,
    perMinute: 0.45,
    /** Minimum de course. */
    minimumFare: 35,
  },

  /** Mise à disposition à l'heure (chauffeur et véhicule restent avec le client). */
  hourly: {
    pricePerHour: 75,
    minimumHours: 3,
    maximumHours: 12,
    /** Kilométrage compris par heure ; au-delà, facturation au km (sur place). */
    includedKmPerHour: 25,
  },

  /** Remise appliquée sur le total d'un aller-retour réservé en une fois. */
  returnTripDiscountPercent: 5,

  /** Majoration de nuit, appliquée si l'heure de prise en charge est dans [start, end). */
  night: {
    startHour: 22,
    endHour: 6,
    surchargePercent: 20,
  },

  /** Majoration dimanche et jours fériés. */
  sundayHoliday: {
    surchargePercent: 10,
  },

  /** Options facturées en plus (par véhicule). */
  options: {
    childSeat: { label: 'Siège enfant / rehausseur', price: 10 },
    meetAndGreet: { label: 'Accueil pancarte en aérogare', price: 15 },
  },

  /**
   * Zones utilisées pour les forfaits. Paris et Versailles sont reconnus par
   * code postal ; les aéroports et grands sites par un disque autour du centre.
   */
  zones: [
    { id: 'paris', label: 'Paris', postcodes: ['75'] },
    { id: 'la-defense', label: 'La Défense', center: { lon: 2.2378, lat: 48.8918 }, radiusKm: 1.5 },
    { id: 'versailles', label: 'Versailles', postcodes: ['78000'] },
    { id: 'cdg', label: 'Aéroport Roissy-Charles-de-Gaulle', center: { lon: 2.5479, lat: 49.0097 }, radiusKm: 4 },
    { id: 'orly', label: 'Aéroport d’Orly', center: { lon: 2.3652, lat: 48.7262 }, radiusKm: 3 },
    { id: 'beauvais', label: 'Aéroport de Beauvais-Tillé', center: { lon: 2.1128, lat: 49.4544 }, radiusKm: 3 },
    { id: 'disney', label: 'Disneyland Paris', center: { lon: 2.7836, lat: 48.8722 }, radiusKm: 4 },
  ] satisfies Zone[],

  /** Forfaits entre zones (symétriques), par véhicule. */
  flatRates: [
    { zones: ['paris', 'cdg'], price: 95 },
    { zones: ['paris', 'orly'], price: 75 },
    { zones: ['paris', 'beauvais'], price: 170 },
    { zones: ['paris', 'disney'], price: 110 },
    { zones: ['paris', 'versailles'], price: 75 },
    { zones: ['paris', 'la-defense'], price: 55 },
    { zones: ['la-defense', 'cdg'], price: 95 },
    { zones: ['la-defense', 'orly'], price: 85 },
    { zones: ['versailles', 'cdg'], price: 130 },
    { zones: ['versailles', 'orly'], price: 95 },
    { zones: ['versailles', 'disney'], price: 140 },
    { zones: ['cdg', 'orly'], price: 115 },
    { zones: ['cdg', 'disney'], price: 110 },
    { zones: ['orly', 'disney'], price: 95 },
  ] satisfies FlatRate[],

  /** Flotte. Au-delà de la capacité d'un véhicule, plusieurs véhicules sont affectés. */
  vehicles: [
    {
      id: 'audi-q8-hybride',
      name: 'Audi Q8 TFSI e',
      tagline: 'SUV premium hybride rechargeable · millésime 2026',
      description:
        'Habitacle cuir, suspension pneumatique et silence électrique en ville : le Q8 hybride conjugue le confort d’une berline de direction et la présence d’un SUV.',
      passengers: 4,
      luggage: 4,
      coefficient: 1,
      fleetCount: 2,
      features: [
        'Hybride rechargeable, conduite silencieuse',
        'Sièges cuir chauffants et ventilés',
        'Eau fraîche, chargeurs et Wi-Fi à bord',
        'Climatisation quadri-zone',
        'Vitres arrière surteintées',
      ],
    },
  ] satisfies Vehicle[],
} as const

export type PricingConfig = typeof pricingConfig
export type VehicleId = (typeof pricingConfig.vehicles)[number]['id']
export type OptionId = keyof typeof pricingConfig.options

/** Capacité totale en passagers (toute la flotte). */
export const fleetCapacity = pricingConfig.vehicles.reduce(
  (sum, v) => sum + v.passengers * v.fleetCount,
  0,
)
