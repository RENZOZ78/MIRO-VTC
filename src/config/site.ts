/**
 * Identité du site, coordonnées et mentions légales.
 *
 * Les valeurs « À COMPLÉTER » sont affichées telles quelles sur le site :
 * remplacer chaque placeholder par la vraie information dès qu'elle est connue.
 */

export const A_COMPLETER = 'À COMPLÉTER'

/** Vrai si la valeur a été renseignée (ni vide, ni placeholder). */
export function isSet(value: string | null | undefined): value is string {
  return !!value && value.trim() !== '' && value.trim() !== A_COMPLETER
}

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '')

export const siteConfig = {
  /** Nom commercial affiché partout. */
  name: 'MIRO VTC',
  tagline: 'Chauffeur privé en Île-de-France',
  description:
    'MIRO VTC, chauffeur privé en Île-de-France : transferts aéroports et gares, mises à disposition et trajets longue distance à bord d’Audi Q8 hybrides. Réservation en ligne, prix fixé à l’avance.',
  url: siteUrl,
  locale: 'fr-FR',

  /**
   * Tant que `provisoire` est à true, le site est fermé aux moteurs de
   * recherche (robots.txt « Disallow: / » + balise meta noindex).
   * Ne passer à false que sur demande explicite.
   */
  provisoire: true,

  phone: {
    display: '06 52 47 37 99',
    e164: '+33652473799',
  },
  /** Numéro WhatsApp au format international sans « + » ; null pour masquer le bouton. */
  whatsapp: null as string | null,
  /** Adresse de contact affichée sur le site (les e-mails partent de MAIL_FROM, voir .env). */
  email: A_COMPLETER,

  serviceArea: {
    label: 'Île-de-France',
    /** Ville ou secteur de départ habituel du chauffeur. */
    base: A_COMPLETER,
    departments: ['75', '77', '78', '91', '92', '93', '94', '95'],
    highlights: [
      'Paris et petite couronne',
      'Aéroports Roissy-CDG, Orly et Beauvais',
      'Gares parisiennes',
      'Versailles, La Défense, Disneyland Paris',
    ],
  },

  hours: '7j/7, 24h/24 sur réservation',

  /** Réglages de la réservation en ligne. */
  booking: {
    /** Délai minimal entre la réservation et la prise en charge, en heures. */
    minLeadHours: 2,
    /** Horizon maximal de réservation, en jours. */
    maxDaysAhead: 365,
    /** Nombre maximal de passagers (au-delà de 4, un second véhicule est ajouté). */
    maxPassengers: 8,
  },

  legal: {
    companyName: A_COMPLETER,
    legalForm: A_COMPLETER,
    siret: A_COMPLETER,
    vatNumber: A_COMPLETER,
    headOffice: A_COMPLETER,
    publicationDirector: A_COMPLETER,
    /** Numéro d'inscription au registre des exploitants VTC (format EVTC…). */
    vtcRegistration: A_COMPLETER,
    /** Carte professionnelle VTC du chauffeur. */
    driverCard: A_COMPLETER,
    insurance: {
      insurer: A_COMPLETER,
      policyNumber: A_COMPLETER,
      coverage: 'Responsabilité civile professionnelle et transport de personnes à titre onéreux',
    },
    mediator: {
      name: A_COMPLETER,
      url: A_COMPLETER,
      address: A_COMPLETER,
    },
    host: {
      name: 'Hostinger International Ltd.',
      address: '61 Lordou Vironos Street, 6023 Larnaca, Chypre',
      url: 'https://www.hostinger.fr',
    },
  },
} as const

export type SiteConfig = typeof siteConfig

export const navigation = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Services' },
  { href: '/tarifs', label: 'Tarifs' },
  { href: '/vtc/paris', label: 'Destinations' },
  { href: '/contact', label: 'Contact' },
] as const
