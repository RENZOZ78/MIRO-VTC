import type { Metadata } from 'next'
import { LegalLayout, Value } from '@/components/Legal'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  alternates: { canonical: '/confidentialite' },
}

export default function ConfidentialitePage() {
  const { legal } = siteConfig
  return (
    <LegalLayout eyebrow="Politique de confidentialité" title="Politique de confidentialité" updated="octobre 2026">
      <h2>Responsable du traitement</h2>
      <p>
        <strong>
          <Value v={legal.companyName} />
        </strong>{' '}
        ({siteConfig.name}), <Value v={legal.headOffice} /> — <Value v={siteConfig.email} />.
      </p>

      <h2>Données collectées et finalités</h2>
      <ul>
        <li>
          <strong>Réservation</strong> : nom, prénom, e-mail, téléphone, adresses de départ et d’arrivée, date et heure,
          numéro de vol ou de train, remarques. Finalité : exécution du contrat de transport (base légale : contrat).
        </li>
        <li>
          <strong>Paiement en ligne</strong> : les données de carte sont saisies et traitées exclusivement par Stripe
          Payments Europe Ltd ; le Prestataire n’y a jamais accès. Il reçoit uniquement la confirmation du paiement et
          le récapitulatif de la réservation.
        </li>
        <li>
          <strong>Contact</strong> : nom, e-mail, téléphone, message. Finalité : répondre à votre demande (base légale :
          intérêt légitime).
        </li>
        <li>
          <strong>Journaux techniques</strong> : adresse IP et horodatage des requêtes, utilisés pour la sécurité du site
          et la limitation des abus (intérêt légitime), conservés au plus 12 mois par l’hébergeur.
        </li>
      </ul>

      <h2>Destinataires et sous-traitants</h2>
      <ul>
        <li>{legal.host.name} (hébergement du site et du serveur d’e-mails).</li>
        <li>Stripe Payments Europe Ltd (paiement en ligne), le cas échéant.</li>
        <li>
          IGN — Géoplateforme (data.geopf.fr) : les adresses saisies sont transmises pour l’autocomplétion et le calcul
          d’itinéraire, sans donnée nominative.
        </li>
      </ul>
      <p>Aucune donnée n’est vendue ni transmise à des fins publicitaires.</p>

      <h2>Durée de conservation</h2>
      <p>
        Les e-mails de réservation et de contact sont conservés le temps nécessaire à la gestion de la relation
        commerciale, puis au titre des obligations comptables (10 ans pour les pièces de facturation). Ce site ne
        dispose pas de base de données : aucune réservation n’est stockée sur le serveur web en dehors des e-mails
        envoyés.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site n’utilise aucun cookie de suivi ni outil de mesure d’audience tiers. Seuls des cookies techniques
        strictement nécessaires peuvent être déposés par Stripe lors d’un paiement en ligne.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité
        de vos données. Pour l’exercer, écrivez à <Value v={siteConfig.email} /> en justifiant de votre identité. Vous
        pouvez également introduire une réclamation auprès de la CNIL (
        <a href="https://www.cnil.fr" rel="noopener noreferrer" target="_blank">
          www.cnil.fr
        </a>
        ).
      </p>
    </LegalLayout>
  )
}
