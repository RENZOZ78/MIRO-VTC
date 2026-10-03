/** Prestations présentées sur l'accueil et la page Services (français et anglais). */

export type ServiceCopy = {
  title: string
  short: string
  description: string[]
  points: string[]
}

export type Service = ServiceCopy & {
  slug: string
  en: ServiceCopy
}

export const services: Service[] = [
  {
    slug: 'transferts-aeroports-gares',
    title: 'Transferts aéroports et gares',
    short: 'Roissy-CDG, Orly, Beauvais et les grandes gares, au forfait, avec suivi du vol.',
    description: [
      'Le transfert aéroport est le trajet où tout doit être juste : l’heure, le terminal, la place pour les bagages. Nous suivons votre vol, adaptons la prise en charge au retard éventuel et vous attendons à la sortie des bagages si vous le souhaitez.',
      'Depuis Paris, La Défense ou Versailles, les forfaits sont fixes et affichés avant la réservation : aucune surprise au compteur.',
    ],
    points: ['Suivi du vol en temps réel', 'Accueil pancarte en aérogare', 'Attente comprise en cas de retard', 'Aide aux bagages'],
    en: {
      title: 'Airport and station transfers',
      short: 'Roissy-CDG, Orly, Beauvais and the main stations at a fixed fare, with flight tracking.',
      description: [
        'An airport transfer is the ride where everything has to be right: the time, the terminal, room for the luggage. We track your flight, adjust the pick-up to any delay and, if you wish, wait for you at the baggage exit.',
        'From Paris, La Défense or Versailles the fares are fixed and shown before booking: no surprises on the meter.',
      ],
      points: ['Live flight tracking', 'Meet & greet with a name board', 'Waiting included in case of delay', 'Help with luggage'],
    },
  },
  {
    slug: 'mise-a-disposition',
    title: 'Mise à disposition',
    short: 'Un chauffeur et un véhicule à votre service, à l’heure ou à la journée.',
    description: [
      'Rendez-vous enchaînés, tournée de visites, journée de shopping ou événement familial : le véhicule reste à votre disposition et vous emmène d’une adresse à l’autre, sans attendre un nouveau chauffeur à chaque étape.',
      'La mise à disposition se réserve en ligne à l’heure (trois heures minimum) ; pour une journée complète ou un programme particulier, demandez un devis.',
    ],
    points: ['Tarif horaire, 3 h minimum', 'Itinéraire libre, modifiable en route', 'Idéal pour les délégations et tournages', 'Chauffeur discret, tenue sobre'],
    en: {
      title: 'Chauffeur by the hour',
      short: 'A chauffeur and a vehicle at your service, by the hour or for the day.',
      description: [
        'Back-to-back meetings, a round of visits, a shopping day or a family event: the vehicle stays with you and takes you from one address to the next, without waiting for a new driver at every stop.',
        'Hourly hire can be booked online (three hours minimum); for a full day or a specific programme, ask for a quote.',
      ],
      points: ['Hourly rate, 3 h minimum', 'Free itinerary, changeable on the go', 'Ideal for delegations and film crews', 'Discreet chauffeur, sober attire'],
    },
  },
  {
    slug: 'longue-distance',
    title: 'Longue distance',
    short: 'Deauville, Reims, Lille, Bruxelles, Londres : partez de votre porte et arrivez reposé.',
    description: [
      'Pour un week-end en Normandie, une réunion à Lille ou une correspondance à Bruxelles, le trajet en Q8 remplace avantageusement le train bondé et la voiture de location : vous travaillez, vous dormez, vous arrivez.',
      'Le prix est établi à l’avance sur l’itinéraire ; les péages sont compris.',
    ],
    points: ['Prix fixe péages compris', 'Pauses à votre rythme', 'Jusqu’à 4 passagers et 4 bagages par véhicule', 'Hybride rechargeable, autonomie longue distance'],
    en: {
      title: 'Long distance',
      short: 'Deauville, Reims, Lille, Brussels, London: leave from your door and arrive rested.',
      description: [
        'For a weekend in Normandy, a meeting in Lille or a connection in Brussels, the Q8 beats the crowded train and the rental car: you work, you sleep, you arrive.',
        'The price is set in advance on the route; tolls are included.',
      ],
      points: ['Fixed price, tolls included', 'Breaks at your own pace', 'Up to 4 passengers and 4 bags per vehicle', 'Plug-in hybrid, long-range'],
    },
  },
  {
    slug: 'soirees-evenements',
    title: 'Soirées et événements',
    short: 'Dîners, spectacles, mariages : un retour serein, à l’heure que vous choisissez.',
    description: [
      'Une soirée réussie ne devrait pas se terminer par une recherche de taxi. Votre chauffeur vous dépose, patiente ou revient à l’heure dite, et vous ramène sans que vous ayez à penser à la route.',
      'Pour les mariages et réceptions, nous assurons les navettes des invités et le trajet des mariés dans un véhicule préparé pour l’occasion.',
    ],
    points: ['Retour à l’heure convenue', 'Navettes invités sur devis', 'Véhicule préparé, eau et confiseries', 'Service de nuit'],
    en: {
      title: 'Evenings and events',
      short: 'Dinners, shows, weddings: a serene ride home, at the time you choose.',
      description: [
        'A good evening should not end with a hunt for a taxi. Your chauffeur drops you off, waits or returns at the agreed time, and drives you home without you having to think about the road.',
        'For weddings and receptions we run guest shuttles and drive the couple in a vehicle prepared for the occasion.',
      ],
      points: ['Return at the agreed time', 'Guest shuttles on quotation', 'Prepared vehicle, water and sweets', 'Night service'],
    },
  },
  {
    slug: 'entreprises',
    title: 'Entreprises et conciergeries',
    short: 'Transport de vos clients, invités et collaborateurs, facturé mensuellement.',
    description: [
      'Hôtels, cabinets, agences événementielles, conciergeries : confiez-nous les déplacements de vos clients et collaborateurs. Chaque course donne lieu à un reçu détaillé, et un relevé mensuel simplifie votre comptabilité.',
      'Les réservations peuvent être faites par un assistant pour un tiers : le passager reçoit la confirmation, l’entreprise reçoit la facture.',
    ],
    points: ['Facturation mensuelle', 'Réservation pour un tiers', 'Reçus détaillés pour notes de frais', 'Interlocuteur unique'],
    en: {
      title: 'Business and concierge services',
      short: 'Transport for your clients, guests and staff, invoiced monthly.',
      description: [
        'Hotels, firms, event agencies, concierge services: entrust us with the journeys of your clients and staff. Every ride comes with a detailed receipt, and a monthly statement simplifies your accounting.',
        'Bookings can be made by an assistant on behalf of someone else: the passenger receives the confirmation, the company receives the invoice.',
      ],
      points: ['Monthly invoicing', 'Booking on behalf of a third party', 'Detailed receipts for expense reports', 'Single point of contact'],
    },
  },
]
