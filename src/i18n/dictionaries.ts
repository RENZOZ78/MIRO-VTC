/**
 * Textes de l'interface partagée en français et en anglais.
 * Les pages elles-mêmes portent leur contenu ; ce fichier couvre l'en-tête,
 * le pied de page, le formulaire de réservation et les sections réutilisées.
 */
import { pricingConfig } from '@/config/pricing'
import { siteConfig } from '@/config/site'

export type Locale = 'fr' | 'en'

/** Correspondance des URL entre les deux langues (pages clés). */
export const routeMap: Record<string, string> = {
  '/': '/en',
  '/reservation': '/en/booking',
  '/services': '/en/services',
  '/tarifs': '/en/pricing',
  '/entreprises': '/en/business',
  '/contact': '/en/contact',
}

export function toLocalePath(path: string, locale: Locale): string {
  if (locale === 'fr') {
    const fr = Object.entries(routeMap).find(([, en]) => en === path)?.[0]
    return fr ?? (path.startsWith('/en') ? '/' : path)
  }
  return routeMap[path] ?? '/en'
}

const fr = {
  nav: [
    { href: '/', label: 'Accueil' },
    { href: '/services', label: 'Services' },
    { href: '/tarifs', label: 'Tarifs' },
    { href: '/vtc/paris', label: 'Destinations' },
    { href: '/entreprises', label: 'Entreprises' },
    { href: '/contact', label: 'Contact' },
  ],
  header: {
    book: 'Réserver',
    bookLong: 'Réserver un trajet',
    call: 'Appeler le',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    home: 'accueil',
    switchLabel: 'English version',
    switchShort: 'EN',
  },
  footer: {
    navigation: 'Navigation',
    destinations: 'Destinations',
    contact: 'Contact',
    booking: 'Réservation',
    legal: 'Mentions légales',
    terms: 'Conditions générales de vente',
    privacy: 'Confidentialité',
    rights: 'Tous droits réservés.',
    regulated: 'Transport de personnes à titre onéreux — exploitant VTC.',
    tagline: 'Chauffeur privé',
  },
  booking: {
    bookingHref: '/reservation',
    confirmationHref: '/reservation/confirmation',
    steps: ['Trajet', 'Véhicule', 'Coordonnées'],
    modes: {
      oneway: { label: 'Aller simple', hint: 'Un trajet, prix fixé à l’avance' },
      return: { label: 'Aller-retour', hint: `−${pricingConfig.returnTripDiscountPercent} % sur l’ensemble` },
      hourly: {
        label: 'Mise à disposition',
        hint: `${pricingConfig.hourly.pricePerHour} €/h, ${pricingConfig.hourly.minimumHours} h minimum`,
      },
    },
    modeGroup: 'Type de prestation',
    pickup: 'Prise en charge',
    from: 'Départ',
    to: 'Arrivée',
    addressPlaceholder: 'Adresse, gare, aéroport…',
    duration: 'Durée',
    hours: 'heures',
    date: 'Date',
    time: 'Heure',
    dateOut: 'Date aller',
    timeOut: 'Heure aller',
    dateBack: 'Date retour',
    timeBack: 'Heure retour',
    passengers: 'Passagers',
    passenger: (n: number) => `${n} passager${n > 1 ? 's' : ''}`,
    luggage: 'Bagages',
    bag: (n: number) => `${n} bagage${n > 1 ? 's' : ''}`,
    options: 'Options',
    fixedPrice: `Prix fixé avant le départ · Réservation au moins ${siteConfig.booking.minLeadHours} h à l’avance`,
    seePrice: 'Voir le prix',
    computing: 'Calcul du prix…',
    errFrom: 'Sélectionnez une adresse de prise en charge dans la liste proposée.',
    errFromTo: 'Sélectionnez une adresse de départ et d’arrivée dans la liste proposée.',
    errDate: 'Indiquez la date et l’heure de prise en charge.',
    errReturn: 'Indiquez la date et l’heure du retour.',
    passengersLuggage: (p: number, l: number) => `${p} passagers · ${l} bagages`,
    twoVehicles: (p: number, l: number, n: number) =>
      `Pour ${p} passagers et ${l} bagages, ${n} véhicules sont affectés.`,
    editTrip: 'Modifier le trajet',
    continue: 'Continuer',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'E-mail',
    phone: 'Téléphone',
    flight: 'N° de vol ou de train (facultatif)',
    flightPlaceholder: 'AF1234, TGV 8512…',
    notes: 'Remarques (facultatif)',
    notesPlaceholder: 'Code d’immeuble, siège bébé, étape intermédiaire…',
    acceptPrefix: 'J’accepte les',
    terms: 'conditions générales de vente',
    and: 'et la',
    privacy: 'politique de confidentialité',
    back: 'Retour',
    sending: 'Envoi…',
    pay: (amount: string) => `Payer ${amount} et réserver`,
    confirm: 'Confirmer la demande',
    yourTrip: 'Votre trajet',
    outbound: 'Aller',
    inbound: 'Retour',
    included: 'compris',
    perLeg: 'par sens',
    estimate: '(estimation)',
    total: 'Total TTC',
    depositNote: (due: string, pct: number, balance: string) =>
      `Acompte de ${due} (${pct} %) réglé en ligne par carte, solde de ${balance} au chauffeur.`,
    onlineNote: 'Réglé en ligne par carte, paiement sécurisé Stripe.',
    onboardNote: 'Règlement au chauffeur, par carte ou en espèces. Prix garanti, sans supplément en cas de trafic.',
    emptyIntro: 'Renseignez votre trajet : le prix s’affiche immédiatement, calculé sur l’itinéraire réel.',
    emptyPoints: ['Forfaits fixes aéroports et gares', 'Suivi des vols, attente comprise', 'Annulation gratuite jusqu’à 24 h avant'],
  },
  cta: {
    eyebrow: 'Réservation',
    title: 'Votre chauffeur vous attend.',
    text: 'Réservez en trois étapes : trajet, véhicule, coordonnées. Le prix est fixé avant de partir.',
    button: 'Réserver un trajet',
  },
  faq: { eyebrow: 'FAQ', title: 'Questions fréquentes' },
  whatsapp: 'Écrire sur WhatsApp',
}

export type Dictionary = typeof fr

const en: Dictionary = {
  nav: [
    { href: '/en', label: 'Home' },
    { href: '/en/services', label: 'Services' },
    { href: '/en/pricing', label: 'Pricing' },
    { href: '/en/business', label: 'Business' },
    { href: '/en/contact', label: 'Contact' },
  ],
  header: {
    book: 'Book',
    bookLong: 'Book a ride',
    call: 'Call',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    home: 'home',
    switchLabel: 'Version française',
    switchShort: 'FR',
  },
  footer: {
    navigation: 'Navigation',
    destinations: 'Destinations (FR)',
    contact: 'Contact',
    booking: 'Booking',
    legal: 'Legal notice (FR)',
    terms: 'Terms of sale (FR)',
    privacy: 'Privacy (FR)',
    rights: 'All rights reserved.',
    regulated: 'Licensed private hire operator (VTC) — Paris region.',
    tagline: 'Private chauffeur',
  },
  booking: {
    bookingHref: '/en/booking',
    confirmationHref: '/reservation/confirmation',
    steps: ['Journey', 'Vehicle', 'Details'],
    modes: {
      oneway: { label: 'One way', hint: 'A single ride, price fixed in advance' },
      return: { label: 'Return trip', hint: `−${pricingConfig.returnTripDiscountPercent}% on the total` },
      hourly: {
        label: 'By the hour',
        hint: `€${pricingConfig.hourly.pricePerHour}/h, ${pricingConfig.hourly.minimumHours} h minimum`,
      },
    },
    modeGroup: 'Service type',
    pickup: 'Pick-up',
    from: 'From',
    to: 'To',
    addressPlaceholder: 'Address, station, airport…',
    duration: 'Duration',
    hours: 'hours',
    date: 'Date',
    time: 'Time',
    dateOut: 'Outbound date',
    timeOut: 'Outbound time',
    dateBack: 'Return date',
    timeBack: 'Return time',
    passengers: 'Passengers',
    passenger: (n: number) => `${n} passenger${n > 1 ? 's' : ''}`,
    luggage: 'Luggage',
    bag: (n: number) => `${n} bag${n > 1 ? 's' : ''}`,
    options: 'Options',
    fixedPrice: `Price fixed before departure · Book at least ${siteConfig.booking.minLeadHours} h ahead`,
    seePrice: 'See the price',
    computing: 'Calculating…',
    errFrom: 'Select a pick-up address from the suggestions.',
    errFromTo: 'Select a departure and an arrival address from the suggestions.',
    errDate: 'Enter the pick-up date and time.',
    errReturn: 'Enter the return date and time.',
    passengersLuggage: (p: number, l: number) => `${p} passengers · ${l} bags`,
    twoVehicles: (p: number, l: number, n: number) => `For ${p} passengers and ${l} bags, ${n} vehicles are assigned.`,
    editTrip: 'Edit the journey',
    continue: 'Continue',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone',
    flight: 'Flight or train number (optional)',
    flightPlaceholder: 'AF1234, Eurostar 9011…',
    notes: 'Notes (optional)',
    notesPlaceholder: 'Door code, child seat, intermediate stop…',
    acceptPrefix: 'I accept the',
    terms: 'terms of sale',
    and: 'and the',
    privacy: 'privacy policy',
    back: 'Back',
    sending: 'Sending…',
    pay: (amount: string) => `Pay ${amount} and book`,
    confirm: 'Confirm the request',
    yourTrip: 'Your journey',
    outbound: 'Outbound',
    inbound: 'Return',
    included: 'included',
    perLeg: 'each way',
    estimate: '(estimate)',
    total: 'Total incl. VAT',
    depositNote: (due: string, pct: number, balance: string) =>
      `Deposit of ${due} (${pct}%) paid online by card, balance of ${balance} paid to the chauffeur.`,
    onlineNote: 'Paid online by card, secured by Stripe.',
    onboardNote: 'Paid to the chauffeur by card or cash. Guaranteed price, no traffic surcharge.',
    emptyIntro: 'Enter your journey: the price appears immediately, computed on the actual route.',
    emptyPoints: ['Fixed fares for airports and stations', 'Flight tracking, waiting included', 'Free cancellation up to 24 h before'],
  },
  cta: {
    eyebrow: 'Booking',
    title: 'Your chauffeur is waiting.',
    text: 'Book in three steps: journey, vehicle, details. The price is fixed before you leave.',
    button: 'Book a ride',
  },
  faq: { eyebrow: 'FAQ', title: 'Frequently asked questions' },
  whatsapp: 'Message us on WhatsApp',
}

export const dictionaries: Record<Locale, Dictionary> = { fr, en }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
