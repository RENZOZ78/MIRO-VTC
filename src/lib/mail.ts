/**
 * Envoi d'e-mails par SMTP (nodemailer).
 *
 * Sans SMTP_HOST dans l'environnement, les messages ne partent pas : ils sont
 * sérialisés en JSON et affichés dans la console serveur (mode simulation),
 * ce qui permet de tester tout le parcours sans compte SMTP.
 */
import nodemailer, { type Transporter } from 'nodemailer'
import { siteConfig, isSet } from '@/config/site'
import type { BookingSummary, ContactRequest } from '@/lib/booking'
import { formatDateTimeFr, formatDuration, formatKm, formatPrice } from '@/lib/format'
import { buildBookingIcs } from '@/lib/ics'

export function isSmtpConfigured(): boolean {
  return !!process.env.SMTP_HOST
}

let transporter: Transporter | null = null

function getTransporter(): Transporter {
  if (transporter) return transporter
  if (isSmtpConfigured()) {
    const port = Number(process.env.SMTP_PORT ?? 587)
    const secure = (process.env.SMTP_SECURE ?? String(port === 465)) === 'true'
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? '' }
        : undefined,
      connectionTimeout: 10_000,
    })
  } else {
    transporter = nodemailer.createTransport({ jsonTransport: true })
  }
  return transporter
}

/** Adresse d'expédition : MAIL_FROM, sinon SMTP_USER, sinon une valeur neutre. */
function fromAddress(): string {
  return (
    process.env.MAIL_FROM ||
    (process.env.SMTP_USER ? `${siteConfig.name} <${process.env.SMTP_USER}>` : `${siteConfig.name} <no-reply@localhost>`)
  )
}

/** Adresse qui reçoit les réservations : MAIL_TO, sinon l'e-mail de contact du site. */
export function ownerAddress(): string | null {
  if (process.env.MAIL_TO) return process.env.MAIL_TO
  if (isSet(siteConfig.email)) return siteConfig.email
  return null
}

export type MailResult = { simulated: boolean; messageId?: string; accepted?: boolean }

export type MailAttachment = { filename: string; content: string; contentType: string }

export async function sendMail(message: {
  to: string
  subject: string
  text: string
  html: string
  replyTo?: string
  attachments?: MailAttachment[]
}): Promise<MailResult> {
  const transport = getTransporter()
  const info = await transport.sendMail({ from: fromAddress(), ...message })
  if (!isSmtpConfigured()) {
    console.info(`[mail] SIMULATION (SMTP non configuré) → ${message.to} : ${message.subject}`)
    console.info(`[mail] ${message.text.replace(/\n/g, '\n[mail] ')}`)
    return { simulated: true, messageId: info.messageId }
  }
  return { simulated: false, messageId: info.messageId, accepted: (info.accepted?.length ?? 0) > 0 }
}

/* ----------------------------- Gabarits ----------------------------- */

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c)

type Row = [label: string, value: string]

function renderHtml({ title, intro, rows, outro }: { title: string; intro: string; rows: Row[]; outro: string[] }) {
  const trs = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;color:#8d8777;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td><td style="padding:8px 12px;color:#1b1a17;font-size:14px">${escapeHtml(v).replace(/\n/g, '<br>')}</td></tr>`,
    )
    .join('')
  const paragraphs = outro.map((p) => `<p style="margin:0 0 12px;color:#4a4639;font-size:14px;line-height:1.6">${escapeHtml(p)}</p>`).join('')
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f4f1ea;font-family:Georgia,'Times New Roman',serif">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
  <div style="background:#0f0f11;color:#e7d3a1;padding:28px 32px;border-radius:12px 12px 0 0">
    <div style="font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:#c9a35a">${escapeHtml(siteConfig.name)}</div>
    <h1 style="margin:10px 0 0;font-weight:400;font-size:26px;color:#f4f1ea">${escapeHtml(title)}</h1>
  </div>
  <div style="background:#ffffff;padding:28px 32px;border:1px solid #e6e0d2;border-top:0">
    <p style="margin:0 0 20px;color:#1b1a17;font-size:15px;line-height:1.6">${escapeHtml(intro)}</p>
    <table style="width:100%;border-collapse:collapse;background:#faf8f3;border:1px solid #ece7da;border-radius:8px">${trs}</table>
    <div style="margin-top:20px">${paragraphs}</div>
  </div>
  <div style="padding:18px 32px;color:#8d8777;font-size:12px;line-height:1.6">
    ${escapeHtml(siteConfig.name)} · ${escapeHtml(siteConfig.phone.display)} · <a href="${escapeHtml(siteConfig.url)}" style="color:#8d8777">${escapeHtml(siteConfig.url.replace(/^https?:\/\//, ''))}</a>
  </div>
</div></body></html>`
}

function renderText(title: string, intro: string, rows: Row[], outro: string[]) {
  return [
    `${siteConfig.name} — ${title}`,
    '',
    intro,
    '',
    ...rows.map(([k, v]) => `${k} : ${v}`),
    '',
    ...outro,
    '',
    `${siteConfig.name} · ${siteConfig.phone.display} · ${siteConfig.url}`,
  ].join('\n')
}

function paymentLine(s: BookingSummary): string {
  switch (s.payment.status) {
    case 'paid':
      return s.paymentMode === 'full' || s.balance === 0
        ? `${formatPrice(s.payment.amountPaid ?? s.dueNow)} réglés en ligne — rien à régler à bord`
        : `Acompte de ${formatPrice(s.payment.amountPaid ?? s.dueNow)} réglé en ligne — solde de ${formatPrice(s.balance)} à régler au chauffeur`
    case 'pending':
      return `Paiement en ligne en attente (${formatPrice(s.dueNow)})`
    case 'failed':
      return 'Paiement en ligne échoué'
    default:
      return `${formatPrice(s.total)} à régler au chauffeur (carte ou espèces)`
  }
}

const modeLabel = (s: BookingSummary) =>
  s.mode === 'hourly' ? `Mise à disposition ${s.hours ?? ''} h` : s.mode === 'return' ? 'Aller-retour' : 'Aller simple'

function bookingRows(s: BookingSummary): Row[] {
  const rows: Row[] = [
    ['Référence', s.reference],
    ['Prestation', modeLabel(s)],
    ['Prise en charge', formatDateTimeFr(s.date, s.time)],
  ]
  if (s.mode === 'return' && s.returnDate && s.returnTime) {
    rows.push(['Retour', formatDateTimeFr(s.returnDate, s.returnTime)])
  }
  rows.push(['Départ', s.from])
  if (s.mode !== 'hourly') rows.push(['Arrivée', s.to])
  rows.push(
    ['Passagers', `${s.passengers} · ${s.luggage} bagage${s.luggage > 1 ? 's' : ''}`],
    ['Véhicule', s.vehicleCount > 1 ? `${s.vehicleCount} × ${s.vehicleName}` : s.vehicleName],
  )
  if (s.options.length) rows.push(['Options', s.options.join(', ')])
  if (s.mode === 'hourly') {
    rows.push(['Kilométrage compris', formatKm(s.distanceKm)])
  } else {
    rows.push([
      s.mode === 'return' ? 'Trajet estimé (par sens)' : 'Trajet estimé',
      `${formatKm(s.distanceKm)} · ${formatDuration(s.durationMin)}${s.routeSource === 'estimation' ? ' (estimation)' : ''}`,
    ])
  }
  rows.push(['Prix total', `${formatPrice(s.total)} TTC${s.basis === 'flat' ? ' (forfait)' : ''}`])
  rows.push(['Paiement', paymentLine(s)])
  if (s.customer.flightNumber) rows.push(['Vol / train', s.customer.flightNumber])
  if (s.customer.notes) rows.push(['Remarques', s.customer.notes])
  return rows
}

/** E-mails de réservation : confirmation au client + notification à l'exploitant. */
export async function sendBookingEmails(s: BookingSummary): Promise<{ customer: MailResult; owner: MailResult | null }> {
  const customerName = `${s.customer.firstName} ${s.customer.lastName}`.trim()
  const isPaid = s.payment.status === 'paid'
  const title = isPaid ? 'Réservation confirmée' : 'Demande de réservation reçue'
  const intro = isPaid
    ? `Bonjour ${s.customer.firstName}, votre réservation ${s.reference} est confirmée. Votre chauffeur vous attendra à l’adresse et à l’heure indiquées ci-dessous.`
    : `Bonjour ${s.customer.firstName}, nous avons bien reçu votre demande ${s.reference}. Nous vous confirmons la disponibilité du chauffeur dans les plus brefs délais par e-mail ou téléphone.`
  const outro = [
    'Un empêchement ? Prévenez-nous le plus tôt possible : toute annulation à plus de 24 h de la prise en charge est sans frais.',
    `Pour toute question : ${siteConfig.phone.display}.`,
  ]
  const rows = bookingRows(s)
  const attachments: MailAttachment[] = [
    {
      filename: `reservation-${s.reference}.ics`,
      content: buildBookingIcs(s),
      contentType: 'text/calendar; charset=utf-8; method=PUBLISH',
    },
  ]

  const customer = await sendMail({
    to: `${customerName} <${s.customer.email}>`,
    subject: `${title} ${s.reference} — ${siteConfig.name}`,
    text: renderText(title, intro, rows, outro),
    html: renderHtml({ title, intro, rows, outro }),
    replyTo: ownerAddress() ?? undefined,
    attachments,
  })

  const ownerTo = ownerAddress()
  let owner: MailResult | null = null
  if (ownerTo) {
    const ownerTitle = isPaid ? `Nouvelle réservation payée ${s.reference}` : `Nouvelle demande ${s.reference}`
    const ownerIntro = `${customerName} (${s.customer.phone}, ${s.customer.email}) — ${formatDateTimeFr(s.date, s.time)}.`
    const ownerRows: Row[] = [['Client', `${customerName}\n${s.customer.phone}\n${s.customer.email}`], ...rows]
    owner = await sendMail({
      to: ownerTo,
      subject: `${ownerTitle} — ${formatDateTimeFr(s.date, s.time)}`,
      text: renderText(ownerTitle, ownerIntro, ownerRows, []),
      html: renderHtml({ title: ownerTitle, intro: ownerIntro, rows: ownerRows, outro: [] }),
      replyTo: s.customer.email,
      attachments,
    })
  } else {
    console.warn('[mail] MAIL_TO non défini : aucune notification exploitant envoyée.')
  }
  return { customer, owner }
}

export async function sendContactEmail(c: ContactRequest): Promise<MailResult | null> {
  const to = ownerAddress()
  if (!to) {
    console.warn('[mail] MAIL_TO non défini : message de contact non transmis.')
    return null
  }
  const title = `Message de ${c.name}`
  const rows: Row[] = [
    ['Nom', c.name],
    ['E-mail', c.email],
    ['Téléphone', c.phone || '—'],
    ['Message', c.message],
  ]
  return sendMail({
    to,
    subject: `${title} — formulaire de contact`,
    text: renderText(title, 'Nouveau message reçu depuis le site.', rows, []),
    html: renderHtml({ title, intro: 'Nouveau message reçu depuis le site.', rows, outro: [] }),
    replyTo: c.email,
  })
}
