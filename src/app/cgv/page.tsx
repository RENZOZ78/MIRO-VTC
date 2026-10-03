import type { Metadata } from 'next'
import { LegalLayout, Value } from '@/components/Legal'
import { pricingConfig } from '@/config/pricing'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Conditions générales de vente',
  alternates: { canonical: '/cgv' },
}

export default function CgvPage() {
  const { legal, booking } = siteConfig
  return (
    <LegalLayout eyebrow="Conditions générales de vente" title="Conditions générales de vente" updated="octobre 2026">
      <h2>1. Objet et champ d’application</h2>
      <p>
        Les présentes conditions générales de vente (CGV) régissent les prestations de transport de personnes avec
        chauffeur (VTC) proposées par{' '}
        <strong>
          <Value v={legal.companyName} />
        </strong>{' '}
        sous le nom commercial {siteConfig.name} (« le Prestataire ») à toute personne physique ou morale (« le
        Client »), via le site, par téléphone ou par e-mail. Toute réservation implique l’acceptation sans réserve des
        présentes CGV.
      </p>

      <h2>2. Réservation</h2>
      <p>
        La réservation s’effectue en ligne en trois étapes (trajet, véhicule, coordonnées), par téléphone ou par
        e-mail. Elle doit être effectuée au moins {booking.minLeadHours} heures avant la prise en charge ; en deçà,
        le Prestataire se réserve le droit de refuser la course selon ses disponibilités. Une réservation n’est
        définitive qu’après confirmation par le Prestataire (e-mail de confirmation ou, le cas échéant, validation du
        paiement en ligne).
      </p>

      <h2>3. Prix</h2>
      <p>
        Les prix sont exprimés en euros toutes taxes comprises. Ils sont fixés avant la prise en charge, sur la base
        d’un forfait entre zones ou d’un calcul combinant prise en charge, distance et durée estimées, avec un minimum
        de course. Des majorations de nuit ({pricingConfig.night.startHour} h – {pricingConfig.night.endHour} h, +
        {pricingConfig.night.surchargePercent} %) et de dimanche et jours fériés (+
        {pricingConfig.sundayHoliday.surchargePercent} %) s’appliquent. Les options sont facturées en sus. Le prix
        affiché à la réservation est ferme, sauf modification du trajet, des horaires ou du nombre de passagers à
        l’initiative du Client, ou attente supplémentaire non imputable au Prestataire.
      </p>

      <h2>4. Paiement</h2>
      <p>
        Le règlement s’effectue au chauffeur par carte bancaire ou en espèces, ou en ligne par carte via la
        plateforme sécurisée Stripe lorsque cette option est proposée. Dans ce cas,{' '}
        {pricingConfig.paymentMode === 'deposit'
          ? `un acompte de ${pricingConfig.depositPercent} % du prix est encaissé à la réservation et le solde est réglé au chauffeur à l’issue de la course.`
          : 'la totalité du prix est encaissée à la réservation.'}{' '}
        Les montants encaissés sont toujours recalculés par le Prestataire à partir du trajet réservé. Une facture ou
        un reçu est remis sur demande.
      </p>

      <h2>5. Annulation et modification</h2>
      <ul>
        <li>Annulation plus de 24 heures avant la prise en charge : sans frais ; l’acompte éventuel est remboursé.</li>
        <li>
          Annulation entre 24 heures et 2 heures avant la prise en charge : 50 % du prix de la course sont dus ;
          l’acompte éventuel est conservé à due concurrence.
        </li>
        <li>Annulation à moins de 2 heures, ou absence du Client (no-show) : la totalité du prix est due.</li>
        <li>
          Toute modification (horaire, adresse, passagers) est soumise à disponibilité et peut entraîner un nouveau
          calcul du prix.
        </li>
      </ul>
      <p>
        Pour les transferts depuis un aéroport, l’attente liée à un retard d’atterrissage est comprise dès lors que le
        numéro de vol a été communiqué. Au-delà de 60 minutes après l’atterrissage, ou de 15 minutes à une autre
        adresse, l’attente peut être facturée au tarif en vigueur.
      </p>

      <h2>6. Exécution de la prestation</h2>
      <p>
        Le Prestataire s’engage à se présenter à l’heure et à l’adresse convenues avec un véhicule propre et en bon
        état. Le Client s’engage à respecter les règles de sécurité (port de la ceinture, sièges enfant obligatoires),
        à ne pas fumer ni consommer d’alcool dans le véhicule et à ne pas transporter de matières dangereuses. Le
        Prestataire peut refuser une prise en charge en cas de comportement dangereux ou d’état manifestement
        incompatible avec le transport. Les dégradations causées au véhicule sont facturées au Client.
      </p>

      <h2>7. Responsabilité</h2>
      <p>
        Le Prestataire est assuré pour le transport de personnes à titre onéreux (
        <Value v={legal.insurance.insurer} />, contrat n° <Value v={legal.insurance.policyNumber} />
        ). Il ne saurait être tenu responsable des retards ou de l’impossibilité d’exécuter la prestation en cas de
        force majeure, de conditions de circulation exceptionnelles, de manifestations, d’intempéries ou de faits de
        tiers. Le Client est invité à prévoir une marge raisonnable pour ses correspondances ; le Prestataire ne
        rembourse pas les billets manqués.
      </p>

      <h2>8. Droit de rétractation</h2>
      <p>
        Conformément à l’article L.221-28 12° du Code de la consommation, le droit de rétractation ne s’applique pas aux
        prestations de transport de passagers fournies à une date ou selon une périodicité déterminée. Les conditions
        d’annulation de l’article 5 s’appliquent.
      </p>

      <h2>9. Données personnelles</h2>
      <p>
        Les données collectées sont nécessaires à l’exécution de la prestation. Leur traitement est décrit dans la{' '}
        <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>10. Réclamations et médiation</h2>
      <p>
        Toute réclamation doit être adressée par écrit à <Value v={siteConfig.email} /> ou à{' '}
        <Value v={legal.headOffice} />. En l’absence de solution amiable dans un délai de deux mois, le Client peut
        saisir gratuitement le médiateur de la consommation : <Value v={legal.mediator.name} /> (
        <Value v={legal.mediator.url} />
        ).
      </p>

      <h2>11. Droit applicable</h2>
      <p>
        Les présentes CGV sont soumises au droit français. À défaut de résolution amiable, les tribunaux français sont
        seuls compétents.
      </p>
    </LegalLayout>
  )
}
