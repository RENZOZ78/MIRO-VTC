/** Prestations présentées sur l'accueil et la page Services. */

export type Service = {
  slug: string
  title: string
  short: string
  description: string[]
  points: string[]
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
  },
  {
    slug: 'mise-a-disposition',
    title: 'Mise à disposition',
    short: 'Un chauffeur et un véhicule à votre service, à l’heure ou à la journée.',
    description: [
      'Rendez-vous enchaînés, tournée de visites, journée de shopping ou événement familial : le véhicule reste à votre disposition et vous emmène d’une adresse à l’autre, sans attendre un nouveau chauffeur à chaque étape.',
      'La mise à disposition se réserve par téléphone ou via le formulaire de contact, sur devis à l’heure ou à la journée.',
    ],
    points: ['Tarif horaire sur devis', 'Itinéraire libre, modifiable en route', 'Idéal pour les délégations et tournages', 'Chauffeur discret, tenue sobre'],
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
  },
]
