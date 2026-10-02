# MIRO VTC

Site internet de VTC, permettant de commander un chauffeur à tout moment en Île-de-France.

Site vitrine et réservation en ligne de **MIRO VTC**, chauffeur privé en Île-de-France (2 Audi Q8 hybrides).
Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS 4 · sans base de données.

## Fonctionnalités

- Pages : accueil, services, tarifs, contact, réservation, 8 pages locales `/vtc/[slug]`, mentions légales, CGV,
  confidentialité, `sitemap.xml`, `robots.txt`, image Open Graph générée, favicon.
- **Réservation en 3 étapes** (`src/components/BookingForm.tsx`) : trajet → véhicule → coordonnées, en
  **aller simple**, **aller-retour** (remise sur l'ensemble) ou **mise à disposition à l'heure**.
- **Prix calculé côté serveur** (`src/lib/pricing.ts`, `src/lib/booking.ts`) : forfaits entre zones (Paris, aéroports,
  La Défense, Versailles, Disneyland), sinon prise en charge + km + minutes avec minimum de course ; majorations de
  nuit et de dimanche/jours fériés ; options ; second véhicule automatique au-delà de 4 passagers ou 4 bagages.
- **Adresses et itinéraires** via la Géoplateforme IGN (`src/lib/geo.ts`), avec estimation de secours si le service
  est indisponible.
- **Paiement Stripe Checkout** (acompte de 30 % par défaut, ou totalité) et webhook `/api/stripe/webhook` qui envoie
  les e-mails une fois le paiement confirmé. Sans clé Stripe, la réservation est confirmée par e-mail et réglée à bord.
- **E-mails SMTP** avec nodemailer (`src/lib/mail.ts`), avec **fichier calendrier `.ics`** joint (client et
  chauffeur). Sans SMTP, les e-mails sont simulés dans la console serveur.
- Anti-abus : validation zod, limitation de débit en mémoire, champ pot de miel.
- `siteConfig.provisoire = true` → site fermé aux moteurs de recherche (robots + meta noindex).

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs
npm run dev                  # http://localhost:3000
```

Vérifications :

```bash
npm test          # tests unitaires (vitest)
npm run lint      # eslint .
npm run typecheck # tsc --noEmit
npm run build     # build de production
npm start         # serveur de production
```

## Configuration

| Fichier | Contenu |
| --- | --- |
| `src/config/site.ts` | Nom, téléphone, e-mail, zone, horaires, mentions légales, `provisoire` |
| `src/config/pricing.ts` | Grille tarifaire, majorations, options, zones, forfaits, véhicules, mode de paiement |
| `src/config/destinations.ts` | Contenu des 8 pages locales `/vtc/[slug]` |
| `src/config/services.ts` | Prestations (accueil et page Services) |

Les valeurs `À COMPLÉTER` sont affichées telles quelles sur le site (surlignées) jusqu'à ce qu'elles soient remplacées.

### Variables d'environnement (`.env.local`, jamais dans Git)

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publique (redirections Stripe, sitemap, liens des e-mails). **Doit être définie avant `npm run build`.** |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (`sk_test_…` puis `sk_live_…`). Vide = paiement à bord. |
| `STRIPE_WEBHOOK_SECRET` | Secret de signature du webhook (`whsec_…`). |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | Serveur d'envoi. Vide = e-mails simulés. |
| `MAIL_FROM` | Expéditeur affiché, ex. `MIRO VTC <contact@domaine.fr>` |
| `MAIL_TO` | Adresse qui reçoit les réservations et les messages de contact |

### Webhook Stripe

Événements à envoyer vers `https://<site>/api/stripe/webhook` :
`checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`.

En local : `stripe listen --forward-to localhost:3000/api/stripe/webhook`, puis copier le `whsec_…` affiché dans
`STRIPE_WEBHOOK_SECRET`. Carte de test : `4242 4242 4242 4242`.

## Déploiement Hostinger (application Node.js)

1. hPanel → **Sites web** → ajouter un site → **Node.js** (dépôt Git ou envoi des fichiers).
2. Version Node : **22** (minimum 20.9). Commande de build : `npm run build`. Commande de démarrage : `npm start`
   (Next.js respecte la variable `PORT` fournie par Hostinger).
3. Renseigner **toutes** les variables du tableau ci-dessus dans le panneau (section variables d'environnement),
   puis **relancer un build** : `NEXT_PUBLIC_SITE_URL` est figée dans le build.
4. Dans Stripe, créer l'endpoint de webhook pointant vers `https://<domaine>/api/stripe/webhook` et reporter son
   secret dans `STRIPE_WEBHOOK_SECRET`.
5. Après vérification du site en production, passer `provisoire` à `false` dans `src/config/site.ts` pour ouvrir
   l'indexation (sur demande uniquement).

## Structure

```
src/
  app/                 pages, layout, API (route handlers), sitemap, robots, OG image
    api/geo/search     autocomplétion d'adresses (proxy IGN)
    api/quote          devis (itinéraire + prix serveur)
    api/booking        réservation (Stripe Checkout ou demande par e-mail)
    api/stripe/webhook confirmation de paiement → e-mails
    api/contact        formulaire de contact
  components/          Header, Footer, BookingForm, AddressInput, ContactForm, sections…
  config/              site, pricing, destinations, services
  lib/                 pricing, geo, booking, mail, stripe, holidays, format, rate-limit
tests/                 tests vitest (prix, géo, réservation, jours fériés)
```

## Avertissement

Les pages Mentions légales, CGV et Confidentialité sont des **modèles** générés : ils doivent être relus et validés
avant la mise en ligne. Voir `AGENTS.md` pour les règles de travail sur ce dépôt.
