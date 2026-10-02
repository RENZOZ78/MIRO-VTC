/**
 * Pages locales /vtc/[slug]. Chaque entrée produit une page avec un texte
 * propre : garder des contenus distincts d'une page à l'autre (SEO local).
 *
 * `flatRateZone` relie la page à une zone de src/config/pricing.ts pour
 * afficher les forfaits correspondants ; sans zone, la page renvoie au devis.
 */

export type Destination = {
  slug: string
  name: string
  /** Titre de page (balise <title>) */
  title: string
  metaDescription: string
  /** Accroche courte sous le titre. */
  kicker: string
  /** Paragraphes d'introduction. */
  intro: string[]
  /** Identifiant de zone tarifaire (voir pricing.ts), facultatif. */
  flatRateZone?: string
  highlights: { title: string; text: string }[]
  faq: { question: string; answer: string }[]
}

export const destinations: Destination[] = [
  {
    slug: 'paris',
    name: 'Paris',
    title: 'VTC à Paris — chauffeur privé 24h/24',
    metaDescription:
      'Chauffeur privé à Paris en Audi Q8 hybride : transferts aéroports, gares, soirées et rendez-vous d’affaires. Prix fixé à la réservation, 7j/7.',
    kicker: 'Dans les vingt arrondissements, à toute heure',
    intro: [
      'Paris se traverse mieux depuis la banquette arrière d’un Q8. Rue de Rivoli à l’heure de pointe, quais de Seine un dimanche matin, retour de l’Opéra après minuit : votre chauffeur connaît les axes qui roulent et les raccourcis qui épargnent dix minutes.',
      'Nous assurons les trajets intra-muros, les liaisons vers les trois aéroports et les six grandes gares, ainsi que les mises à disposition à l’heure pour vos rendez-vous enchaînés dans la capitale.',
    ],
    flatRateZone: 'paris',
    highlights: [
      { title: 'Transferts aéroports', text: 'Roissy-CDG, Orly et Beauvais au forfait, suivi du vol et attente incluse en cas de retard.' },
      { title: 'Gares parisiennes', text: 'Gare du Nord, Gare de Lyon, Montparnasse, Saint-Lazare, Austerlitz et Gare de l’Est : dépose au plus près du quai.' },
      { title: 'Soirées et événements', text: 'Dîners, spectacles, galas : retour à l’heure que vous choisissez, sans chercher un taxi sous la pluie.' },
    ],
    faq: [
      { question: 'Prenez-vous en charge dans tout Paris ?', answer: 'Oui, dans les vingt arrondissements, y compris les zones à circulation restreinte où les VTC conservent l’accès.' },
      { question: 'Le prix dépend-il du trafic ?', answer: 'Non. Le prix est fixé à la réservation à partir de l’itinéraire estimé ; un embouteillage ne le modifie pas.' },
    ],
  },
  {
    slug: 'aeroport-roissy-cdg',
    name: 'Aéroport Roissy-Charles-de-Gaulle',
    title: 'VTC Aéroport Roissy-CDG — transfert privé au forfait',
    metaDescription:
      'Transfert VTC vers ou depuis l’aéroport Roissy-Charles-de-Gaulle : forfait fixe, suivi du vol, accueil en aérogare. Audi Q8 hybride, chauffeur privé.',
    kicker: 'Terminaux 1, 2 et 3 — accueil en aérogare possible',
    intro: [
      'À Roissy, tout se joue sur le timing. Nous suivons votre numéro de vol en temps réel : si l’atterrissage glisse d’une heure, votre chauffeur glisse avec lui, sans supplément d’attente dans les limites prévues.',
      'À l’arrivée, choisissez la dépose en zone minute ou l’accueil avec pancarte à la sortie des bagages. Au départ, nous calculons l’heure de prise en charge pour vous présenter au comptoir avec la marge que vous souhaitez.',
    ],
    flatRateZone: 'cdg',
    highlights: [
      { title: 'Suivi du vol', text: 'Nous ajustons l’heure de prise en charge à l’horaire réel d’atterrissage.' },
      { title: 'Accueil pancarte', text: 'Votre chauffeur vous attend à la sortie des bagages, aide pour les valises comprise.' },
      { title: 'Forfaits fixes', text: 'Paris, La Défense, Versailles, Orly, Disneyland : prix connu avant de partir.' },
    ],
    faq: [
      { question: 'Que se passe-t-il si mon vol a du retard ?', answer: 'Nous suivons le vol et décalons la prise en charge. Prévenez-nous seulement en cas d’annulation ou de changement de vol.' },
      { question: 'Le parking est-il compris ?', answer: 'Oui pour une dépose ou une attente en zone minute ; l’accueil en aérogare est une option à 15 €.' },
    ],
  },
  {
    slug: 'aeroport-orly',
    name: 'Aéroport d’Orly',
    title: 'VTC Aéroport d’Orly — chauffeur privé, prix fixe',
    metaDescription:
      'Chauffeur privé pour l’aéroport d’Orly (terminaux 1 à 4) : forfait fixe depuis Paris, Versailles ou La Défense, suivi des vols, véhicule hybride premium.',
    kicker: 'Orly 1, 2, 3 et 4 — à vingt minutes du sud de Paris',
    intro: [
      'Orly est l’aéroport des départs matinaux et des retours tardifs. Un Q8 silencieux à 5 h 30 devant chez vous, un café chaud à bord et l’A106 encore fluide : c’est la version apaisée du vol de 7 h.',
      'Nous connaissons les quatre terminaux et leurs dépose-minute respectifs ; indiquez votre numéro de vol et nous nous chargeons du reste.',
    ],
    flatRateZone: 'orly',
    highlights: [
      { title: 'Départs tôt, retours tard', text: 'Service de nuit assuré avec une majoration transparente, affichée avant de réserver.' },
      { title: 'Terminaux maîtrisés', text: 'Dépose au bon terminal selon la compagnie, sans détour.' },
      { title: 'Correspondances', text: 'Liaison Orly ↔ Roissy-CDG au forfait pour vos correspondances entre aéroports.' },
    ],
    faq: [
      { question: 'Combien de temps avant le vol dois-je partir de Paris ?', answer: 'Comptez 30 à 45 minutes de route selon l’heure ; nous vous proposons une heure de prise en charge adaptée à votre vol.' },
      { question: 'Pouvez-vous me récupérer avec beaucoup de bagages ?', answer: 'Le Q8 accueille quatre valises ; au-delà, nous affectons un second véhicule.' },
    ],
  },
  {
    slug: 'la-defense',
    name: 'La Défense',
    title: 'VTC La Défense — chauffeur d’affaires, mise à disposition',
    metaDescription:
      'Chauffeur privé à La Défense : trajets vers Paris et les aéroports, mises à disposition à l’heure pour vos rendez-vous, facturation entreprise.',
    kicker: 'Le quartier d’affaires, sans la file de taxis',
    intro: [
      'Entre deux réunions tour First et un déjeuner rive gauche, chaque minute compte. Votre chauffeur vous attend au pied de la tour, vous dépose à l’adresse exacte et revient vous chercher à l’heure convenue.',
      'Pour les journées chargées, la mise à disposition à l’heure vous libère de toute logistique : le véhicule reste à votre service, où que vous alliez dans Paris et sa proche banlieue.',
    ],
    flatRateZone: 'la-defense',
    highlights: [
      { title: 'Rendez-vous enchaînés', text: 'Mise à disposition par tranches horaires, chauffeur discret et ponctuel.' },
      { title: 'Facture entreprise', text: 'Reçu détaillé à chaque course pour vos notes de frais.' },
      { title: 'Confidentialité', text: 'Vitres surteintées, silence à bord : travaillez ou téléphonez sereinement.' },
    ],
    faq: [
      { question: 'Proposez-vous des comptes entreprise ?', answer: 'Oui, contactez-nous pour une facturation mensuelle et des réservations récurrentes.' },
      { question: 'Peut-on réserver pour un collaborateur ?', answer: 'Oui, indiquez ses coordonnées dans le formulaire : il reçoit la confirmation et vous la facture.' },
    ],
  },
  {
    slug: 'versailles',
    name: 'Versailles',
    title: 'VTC Versailles — chauffeur privé, château et Yvelines',
    metaDescription:
      'Chauffeur privé à Versailles et dans les Yvelines : forfaits vers Paris, Roissy-CDG et Orly, excursions au château, déplacements familiaux en Audi Q8 hybride.',
    kicker: 'Versailles, Le Chesnay, Saint-Cyr, Vélizy et les Yvelines',
    intro: [
      'Depuis Versailles, Paris est à trente minutes et les aéroports à moins d’une heure, à condition de connaître l’A13 et ses humeurs. Votre chauffeur part du secteur et adapte l’itinéraire à l’heure de la journée.',
      'Nous accompagnons aussi les visiteurs du château : prise en charge à l’hôtel, dépose à la grille d’honneur et retour en fin d’après-midi, ou journée complète vers Giverny et la vallée de Chevreuse.',
    ],
    flatRateZone: 'versailles',
    highlights: [
      { title: 'Aéroports au forfait', text: 'Versailles ↔ Roissy-CDG et Versailles ↔ Orly à prix fixe, de jour comme de nuit.' },
      { title: 'Excursions', text: 'Château de Versailles, Giverny, Chartres : mise à disposition à la demi-journée ou à la journée.' },
      { title: 'Familles', text: 'Sièges enfant sur demande, coffre spacieux pour les poussettes.' },
    ],
    faq: [
      { question: 'Desservez-vous les communes autour de Versailles ?', answer: 'Oui : Le Chesnay-Rocquencourt, Viroflay, Saint-Cyr-l’École, Vélizy, Bougival et l’ensemble des Yvelines.' },
      { question: 'Peut-on réserver un aller-retour ?', answer: 'Réservez l’aller puis le retour, ou demandez un devis de mise à disposition pour la journée.' },
    ],
  },
  {
    slug: 'disneyland-paris',
    name: 'Disneyland Paris',
    title: 'VTC Disneyland Paris — transfert privé depuis Paris et les aéroports',
    metaDescription:
      'Transfert en chauffeur privé vers Disneyland Paris (Marne-la-Vallée) depuis Paris, Roissy-CDG ou Orly : forfait fixe, sièges enfant, véhicule spacieux.',
    kicker: 'Marne-la-Vallée, hôtels Disney et Val d’Europe',
    intro: [
      'Avec des enfants, le trajet fait partie de la journée. Sièges adaptés installés avant votre arrivée, dépose devant votre hôtel Disney ou à l’entrée des parcs, et un retour calme quand tout le monde dort à l’arrière.',
      'Depuis les aéroports, nous vous évitons la correspondance RER avec les valises : votre chauffeur vous attend à la sortie des bagages et vous conduit directement à Chessy.',
    ],
    flatRateZone: 'disney',
    highlights: [
      { title: 'Sièges enfant', text: 'Rehausseurs et sièges bébé sur demande lors de la réservation.' },
      { title: 'Depuis les aéroports', text: 'Roissy-CDG ↔ Disneyland et Orly ↔ Disneyland au forfait.' },
      { title: 'Hôtels partenaires et Val d’Europe', text: 'Dépose aux hôtels Disney, hôtels partenaires et centre commercial Val d’Europe.' },
    ],
    faq: [
      { question: 'Le véhicule accueille-t-il une famille avec poussette ?', answer: 'Oui, quatre passagers et quatre bagages par véhicule ; une poussette pliée tient dans le coffre.' },
      { question: 'Pouvez-vous nous attendre pour le retour ?', answer: 'Réservez un retour à l’heure souhaitée ou optez pour une mise à disposition sur place.' },
    ],
  },
  {
    slug: 'saint-germain-en-laye',
    name: 'Saint-Germain-en-Laye',
    title: 'VTC Saint-Germain-en-Laye — chauffeur privé dans l’ouest parisien',
    metaDescription:
      'Chauffeur privé à Saint-Germain-en-Laye, Le Vésinet, Chatou et Maisons-Laffitte : transferts aéroports, Paris, soirées et trajets réguliers en Audi Q8.',
    kicker: 'Saint-Germain, Le Vésinet, Chatou, Le Pecq, Maisons-Laffitte',
    intro: [
      'L’ouest parisien a ses habitudes : le marché du dimanche, les sorties au Théâtre Alexandre-Dumas, les trajets réguliers vers les lycées internationaux et les gares. Nous construisons avec vous des rendez-vous récurrents que vous n’avez plus à reprogrammer.',
      'Pour les départs en voyage, la N13 et l’A14 nous mènent à Roissy ou Orly en moins d’une heure ; nous vous proposons l’heure de départ en fonction de votre vol.',
    ],
    highlights: [
      { title: 'Trajets réguliers', text: 'Abonnez-vous à des courses récurrentes : même chauffeur, même heure, même véhicule.' },
      { title: 'Soirées à Paris', text: 'Aller-retour pour un dîner ou un spectacle, sans la contrainte du dernier RER A.' },
      { title: 'Aéroports', text: 'Roissy-CDG, Orly et Beauvais sur devis fixé à la réservation.' },
    ],
    faq: [
      { question: 'Les forfaits aéroport s’appliquent-ils depuis Saint-Germain ?', answer: 'Le prix est calculé sur l’itinéraire réel et affiché avant validation ; il est ensuite garanti.' },
      { question: 'Pouvez-vous accompagner un enfant seul ?', answer: 'Contactez-nous : nous étudions chaque demande avec les parents et formalisons les conditions par écrit.' },
    ],
  },
  {
    slug: 'boulogne-billancourt',
    name: 'Boulogne-Billancourt',
    title: 'VTC Boulogne-Billancourt — chauffeur privé Hauts-de-Seine',
    metaDescription:
      'Chauffeur privé à Boulogne-Billancourt, Issy-les-Moulineaux, Neuilly et Saint-Cloud : trajets vers Paris, les aéroports et les gares, à prix fixe.',
    kicker: 'Boulogne, Issy, Neuilly, Saint-Cloud, Sèvres',
    intro: [
      'Aux portes de Paris, Boulogne-Billancourt concentre sièges sociaux, studios et quartiers résidentiels. Nous y assurons aussi bien le transfert matinal vers Orly que la navette entre un plateau de tournage et un hôtel du 16ᵉ.',
      'Le Q8 hybride circule en mode électrique dans les rues du Trapèze et de l’île Seguin : un trajet silencieux, sans odeur ni vibration, pour arriver reposé.',
    ],
    highlights: [
      { title: 'Entreprises et médias', text: 'Courses pour vos invités, talents et collaborateurs, avec confirmation envoyée au passager.' },
      { title: 'Orly en vingt-cinq minutes', text: 'Accès direct par le périphérique sud et l’A6 ; prix fixé avant le départ.' },
      { title: 'Roland-Garros et Parc des Princes', text: 'Dépose et reprise aux abords des stades les soirs d’événement.' },
    ],
    faq: [
      { question: 'Prenez-vous en charge à Issy ou Neuilly ?', answer: 'Oui, dans toute la boucle de Seine et les Hauts-de-Seine.' },
      { question: 'Acceptez-vous les réservations de dernière minute ?', answer: 'Nous demandons deux heures de délai en ligne ; en deçà, appelez-nous pour vérifier la disponibilité.' },
    ],
  },
]

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug)
}
