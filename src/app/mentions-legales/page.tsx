import type { Metadata } from 'next'
import { LegalLayout, Value } from '@/components/Legal'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Mentions légales',
  alternates: { canonical: '/mentions-legales' },
}

export default function MentionsLegalesPage() {
  const { legal } = siteConfig
  return (
    <LegalLayout eyebrow="Mentions légales" title="Mentions légales" updated="octobre 2026">
      <h2>Éditeur du site</h2>
      <p>
        Le site <strong>{siteConfig.url.replace(/^https?:\/\//, '')}</strong> est édité par{' '}
        <strong>
          <Value v={legal.companyName} />
        </strong>
        , <Value v={legal.legalForm} />, exploitant sous le nom commercial <strong>{siteConfig.name}</strong>.
      </p>
      <ul>
        <li>
          Siège social : <Value v={legal.headOffice} />
        </li>
        <li>
          SIRET : <Value v={legal.siret} />
        </li>
        <li>
          Numéro de TVA intracommunautaire : <Value v={legal.vatNumber} />
        </li>
        <li>
          Téléphone : <a href={`tel:${siteConfig.phone.e164}`}>{siteConfig.phone.display}</a>
        </li>
        <li>
          E-mail : <Value v={siteConfig.email} />
        </li>
        <li>
          Directeur de la publication : <Value v={legal.publicationDirector} />
        </li>
      </ul>

      <h2>Activité réglementée</h2>
      <p>
        Exploitant de voiture de transport avec chauffeur (VTC) inscrit au registre des exploitants de VTC sous le
        numéro <Value v={legal.vtcRegistration} />. Carte professionnelle VTC n° <Value v={legal.driverCard} />.
      </p>
      <p>
        Assurance responsabilité civile professionnelle et transport de personnes à titre onéreux souscrite auprès de{' '}
        <Value v={legal.insurance.insurer} />, contrat n° <Value v={legal.insurance.policyNumber} /> —{' '}
        {legal.insurance.coverage}.
      </p>

      <h2>Hébergement</h2>
      <p>
        {legal.host.name}, {legal.host.address} —{' '}
        <a href={legal.host.url} rel="noopener noreferrer" target="_blank">
          {legal.host.url}
        </a>
        .
      </p>

      <h2>Médiation de la consommation</h2>
      <p>
        Conformément aux articles L.611-1 et suivants du Code de la consommation, le client peut recourir gratuitement
        au médiateur de la consommation dont relève l’exploitant : <Value v={legal.mediator.name} />,{' '}
        <Value v={legal.mediator.address} /> — <Value v={legal.mediator.url} />. Le recours au médiateur suppose
        d’avoir préalablement tenté de résoudre le litige directement auprès de {siteConfig.name} par une réclamation
        écrite.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L’ensemble des contenus de ce site (textes, graphismes, logo, structure) est protégé par le droit d’auteur.
        Toute reproduction, même partielle, sans autorisation écrite préalable est interdite.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Les traitements de données réalisés via ce site sont décrits dans la{' '}
        <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Crédits</h2>
      <p>
        Données d’adresses et d’itinéraires : Géoplateforme IGN (data.geopf.fr), Base Adresse Nationale, licence
        ouverte. Paiement en ligne : Stripe Payments Europe Ltd.
      </p>
    </LegalLayout>
  )
}
