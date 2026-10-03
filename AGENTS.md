<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MIRO VTC — consignes projet

Site vitrine + réservation en ligne d'un chauffeur privé (VTC) en Île-de-France.
Next.js 16 (App Router, Turbopack), TypeScript strict, Tailwind CSS 4. Pas de base de données.

## Règles non négociables

- **Ne jamais supprimer de fichier.** Signaler un fichier inutile, ne pas le retirer.
- **Le montant débité est toujours recalculé côté serveur** (`src/lib/booking.ts` → `src/lib/pricing.ts`). Le navigateur n'envoie que le trajet, jamais un prix.
- **Aucun secret dans le code ni dans Git.** Tout passe par `.env.local` (voir `.env.example`).
- Les textes juridiques (`/mentions-legales`, `/cgv`, `/confidentialite`) sont des **modèles** à faire valider, pas des textes validés.
- `siteConfig.provisoire` (dans `src/config/site.ts`) à `true` = site fermé aux moteurs de recherche (robots + meta noindex). Ne le passer à `false` que sur demande explicite.
- Garder le site sans base de données, sauf demande explicite (planning, administration).

## Points d'entrée

| Rôle | Fichier |
| --- | --- |
| Identité, contact, mentions légales | `src/config/site.ts` |
| Grille tarifaire, zones, forfaits, véhicules | `src/config/pricing.ts` |
| Pages locales `/vtc/[slug]` | `src/config/destinations.ts` |
| Calcul du prix (pur, testé) | `src/lib/pricing.ts` |
| Orchestration devis / réservation côté serveur | `src/lib/booking.ts` |
| Géocodage et itinéraire (IGN Géoplateforme) + estimation de secours | `src/lib/geo.ts` |
| E-mails (nodemailer, simulation si SMTP absent) | `src/lib/mail.ts` |
| Stripe Checkout + webhook | `src/lib/stripe.ts`, `src/app/api/stripe/webhook/route.ts` |
| Formulaire de réservation en 3 étapes | `src/components/BookingForm.tsx` |

## Commandes

```bash
npm run dev        # développement
npm test           # tests unitaires (vitest)
npm run lint       # eslint . (next lint n'existe plus en Next 16)
npm run typecheck  # tsc --noEmit
npm run build      # build de production
npm start          # serveur de production (PORT respecté)
```

Après chaque étape de travail : `npm test && npm run lint && npm run build`, puis commit.
