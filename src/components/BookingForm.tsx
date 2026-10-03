'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AddressInput } from '@/components/AddressInput'
import { pricingConfig, type OptionId, type VehicleId } from '@/config/pricing'
import { siteConfig } from '@/config/site'
import { getDictionary } from '@/i18n/dictionaries'
import { useLocale } from '@/i18n/locale-context'
import { formatDateTimeFr, formatDuration, formatKm, formatPrice, todayParis } from '@/lib/format'
import type { Place, RouteResult } from '@/lib/geo'
import type { Quote, TripMode } from '@/lib/pricing'

type Step = 1 | 2 | 3

type QuoteResponse = { quote: Quote; route: RouteResult | null; online: boolean }
type BookingResponse =
  | { mode: 'stripe'; url: string; reference: string }
  | { mode: 'request'; reference: string; simulated?: boolean }

const MODE_IDS: TripMode[] = ['oneway', 'return', 'hourly']
const optionIds = Object.keys(pricingConfig.options) as OptionId[]

/** Libellés anglais des options (les libellés français sont dans la configuration). */
const optionLabelsEn: Record<OptionId, string> = {
  childSeat: 'Child seat / booster',
  meetAndGreet: 'Meet & greet in the terminal',
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) throw new Error(data.error ?? `Erreur ${res.status}`)
  return data
}

/** « jeudi 12 novembre 2026 à 09 h 30 » ou « Thursday 12 November 2026, 09:30 ». */
function formatWhen(date: string, time: string, locale: 'fr' | 'en'): string {
  if (locale === 'fr') return formatDateTimeFr(date, time)
  const d = new Date(`${date}T12:00:00Z`)
  if (Number.isNaN(d.getTime())) return `${date} ${time}`
  const day = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d)
  return `${day}, ${time}`
}

export function BookingForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const locale = useLocale()
  const t = getDictionary(locale).booking
  const optionLabel = (id: OptionId) => (locale === 'en' ? optionLabelsEn[id] : pricingConfig.options[id].label)
  const [step, setStep] = useState<Step>(1)

  // Étape 1 — trajet
  const [mode, setMode] = useState<TripMode>('oneway')
  const [from, setFrom] = useState<Place | null>(null)
  const [to, setTo] = useState<Place | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [returnTime, setReturnTime] = useState('')
  const [hours, setHours] = useState<number>(pricingConfig.hourly.minimumHours)
  const [passengers, setPassengers] = useState(2)
  const [luggage, setLuggage] = useState(2)
  const [options, setOptions] = useState<Record<OptionId, number>>(
    Object.fromEntries(optionIds.map((id) => [id, 0])) as Record<OptionId, number>,
  )

  // Étape 2 — véhicule et devis
  const [vehicleId, setVehicleId] = useState<VehicleId>(pricingConfig.vehicles[0].id)
  const [quoteData, setQuoteData] = useState<QuoteResponse | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState<string | null>(null)

  // Étape 3 — coordonnées
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    flightNumber: '',
    notes: '',
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [website, setWebsite] = useState('') // pot de miel
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const toPlace = (p: Place) => ({ label: p.label, lon: p.lon, lat: p.lat, city: p.city, postcode: p.postcode })

  const tripPayload = (vehicle: VehicleId = vehicleId) => {
    if (!from) return null
    if (mode !== 'hourly' && !to) return null
    return {
      mode,
      from: toPlace(from),
      to: mode !== 'hourly' && to ? toPlace(to) : undefined,
      date,
      time,
      returnDate: mode === 'return' ? returnDate : undefined,
      returnTime: mode === 'return' ? returnTime : undefined,
      hours: mode === 'hourly' ? hours : undefined,
      passengers,
      luggage,
      vehicleId: vehicle,
      options,
    }
  }

  async function requestQuote(vehicle: VehicleId = vehicleId): Promise<boolean> {
    const payload = tripPayload(vehicle)
    if (!payload) {
      setQuoteError(mode === 'hourly' ? t.errFrom : t.errFromTo)
      return false
    }
    if (!date || !time) {
      setQuoteError(t.errDate)
      return false
    }
    if (mode === 'return' && (!returnDate || !returnTime)) {
      setQuoteError(t.errReturn)
      return false
    }
    setQuoteLoading(true)
    setQuoteError(null)
    try {
      const data = await postJson<QuoteResponse>('/api/quote', payload)
      setQuoteData(data)
      return true
    } catch (err) {
      setQuoteError((err as Error).message)
      return false
    } finally {
      setQuoteLoading(false)
    }
  }

  async function goToStep2(e: React.FormEvent) {
    e.preventDefault()
    if (await requestQuote()) setStep(2)
  }

  async function chooseVehicle(id: VehicleId) {
    setVehicleId(id)
    await requestQuote(id)
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault()
    const payload = tripPayload()
    if (!payload) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const data = await postJson<BookingResponse>('/api/booking', {
        ...payload,
        customer: {
          ...customer,
          flightNumber: customer.flightNumber || undefined,
          notes: customer.notes || undefined,
        },
        acceptTerms,
        website,
      })
      if (data.mode === 'stripe') {
        window.location.assign(data.url)
        return
      }
      router.push(`${t.confirmationHref}?ref=${encodeURIComponent(data.reference)}&mode=request`)
    } catch (err) {
      setSubmitError((err as Error).message)
      setSubmitting(false)
    }
  }

  const quote = quoteData?.quote

  return (
    <div className={`card overflow-hidden ${compact ? '' : 'lg:grid lg:grid-cols-[1fr_360px]'}`}>
      <div className="p-6 sm:p-8">
        <ol className="mb-8 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase">
          {t.steps.map((label, i) => {
            const n = (i + 1) as Step
            return (
              <li key={label} className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={n > step}
                  onClick={() => setStep(n)}
                  className={`flex items-center gap-2 transition ${
                    n === step ? 'text-gold-2' : n < step ? 'text-cream/80 hover:text-gold-2' : 'text-mist-2'
                  }`}
                  aria-current={n === step ? 'step' : undefined}
                >
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full border text-[11px] ${
                      n <= step ? 'border-gold text-gold-2' : 'border-line text-mist-2'
                    }`}
                  >
                    {n < step ? '✓' : n}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
                {i < t.steps.length - 1 && <span className="bg-line h-px w-6 sm:w-10" aria-hidden />}
              </li>
            )
          })}
        </ol>

        {step === 1 && (
          <form onSubmit={goToStep2} noValidate className="space-y-5">
            <div role="radiogroup" aria-label={t.modeGroup} className="grid gap-2 sm:grid-cols-3">
              {MODE_IDS.map((id) => {
                const m = t.modes[id]
                const selected = id === mode
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setMode(id)
                      setQuoteError(null)
                    }}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      selected ? 'border-gold/70 bg-gold/10' : 'border-line hover:border-line-strong'
                    }`}
                  >
                    <span className={`block text-sm font-semibold ${selected ? 'text-gold-2' : 'text-cream'}`}>
                      {m.label}
                    </span>
                    <span className="text-mist block text-xs">{m.hint}</span>
                  </button>
                )
              })}
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <AddressInput
                id="from"
                label={mode === 'hourly' ? t.pickup : t.from}
                placeholder={t.addressPlaceholder}
                value={from}
                onChange={setFrom}
              />
              {mode === 'hourly' ? (
                <div>
                  <label htmlFor="hours" className="label">
                    {t.duration}
                  </label>
                  <select id="hours" className="input" value={hours} onChange={(e) => setHours(Number(e.target.value))}>
                    {Array.from(
                      { length: pricingConfig.hourly.maximumHours - pricingConfig.hourly.minimumHours + 1 },
                      (_, i) => i + pricingConfig.hourly.minimumHours,
                    ).map((h) => (
                      <option key={h} value={h}>
                        {h} {t.hours} · {formatPrice(h * pricingConfig.hourly.pricePerHour)}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <AddressInput id="to" label={t.to} placeholder={t.addressPlaceholder} value={to} onChange={setTo} />
              )}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <label htmlFor="date" className="label">
                  {mode === 'return' ? t.dateOut : t.date}
                </label>
                <input
                  id="date"
                  type="date"
                  className="input"
                  min={todayParis()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="label">
                  {mode === 'return' ? t.timeOut : t.time}
                </label>
                <input
                  id="time"
                  type="time"
                  className="input"
                  step={300}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="passengers" className="label">
                  {t.passengers}
                </label>
                <select
                  id="passengers"
                  className="input"
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                >
                  {Array.from({ length: siteConfig.booking.maxPassengers }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {t.passenger(n)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="luggage" className="label">
                  {t.luggage}
                </label>
                <select id="luggage" className="input" value={luggage} onChange={(e) => setLuggage(Number(e.target.value))}>
                  {Array.from({ length: 9 }, (_, i) => i).map((n) => (
                    <option key={n} value={n}>
                      {t.bag(n)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {mode === 'return' && (
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="returnDate" className="label">
                    {t.dateBack}
                  </label>
                  <input
                    id="returnDate"
                    type="date"
                    className="input"
                    min={date || todayParis()}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="returnTime" className="label">
                    {t.timeBack}
                  </label>
                  <input
                    id="returnTime"
                    type="time"
                    className="input"
                    step={300}
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <fieldset className="grid gap-3 sm:grid-cols-2">
              <legend className="label">{t.options}</legend>
              {optionIds.map((id) => {
                const opt = pricingConfig.options[id]
                const checked = options[id] > 0
                return (
                  <label
                    key={id}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                      checked ? 'border-gold/70 bg-gold/10' : 'border-line hover:border-line-strong'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="accent-gold h-4 w-4"
                        checked={checked}
                        onChange={(e) => setOptions({ ...options, [id]: e.target.checked ? 1 : 0 })}
                      />
                      {optionLabel(id)}
                    </span>
                    <span className="text-gold-2 font-semibold">+{formatPrice(opt.price)}</span>
                  </label>
                )
              })}
            </fieldset>

            {quoteError && (
              <p role="alert" className="text-danger text-sm">
                {quoteError}
              </p>
            )}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-mist text-xs">{t.fixedPrice}</p>
              <button type="submit" className="btn-gold" disabled={quoteLoading}>
                {quoteLoading ? t.computing : t.seePrice}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="grid gap-4">
              {pricingConfig.vehicles.map((v) => {
                const selected = v.id === vehicleId
                return (
                  <button
                    type="button"
                    key={v.id}
                    onClick={() => chooseVehicle(v.id)}
                    className={`card-hover rounded-2xl border p-5 text-left transition ${
                      selected ? 'border-gold/70 bg-gold/10' : 'border-line'
                    }`}
                    aria-pressed={selected}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="eyebrow">{v.tagline}</p>
                        <h3 className="mt-2 text-2xl">{v.name}</h3>
                        <p className="text-mist mt-2 max-w-xl text-sm leading-relaxed">{v.description}</p>
                      </div>
                      <div className="text-right">
                        {quote && quote.vehicleId === v.id && (
                          <p className="font-display text-gold-2 text-3xl">{formatPrice(quote.total)}</p>
                        )}
                        <p className="text-mist text-xs">{t.passengersLuggage(v.passengers, v.luggage)}</p>
                      </div>
                    </div>
                    <ul className="text-mist mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs">
                      {v.features.map((f) => (
                        <li key={f} className="before:text-gold before:mr-1.5 before:content-['◆']">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                )
              })}
            </div>
            {quote && quote.vehicleCount > 1 && (
              <p className="text-gold-2 text-sm">{t.twoVehicles(passengers, luggage, quote.vehicleCount)}</p>
            )}
            {quoteError && (
              <p role="alert" className="text-danger text-sm">
                {quoteError}
              </p>
            )}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button type="button" className="btn-ghost" onClick={() => setStep(1)}>
                {t.editTrip}
              </button>
              <button type="button" className="btn-gold" disabled={!quote || quoteLoading} onClick={() => setStep(3)}>
                {t.continue}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={submitBooking} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="firstName" label={t.firstName} value={customer.firstName} onChange={(v) => setCustomer({ ...customer, firstName: v })} autoComplete="given-name" required />
              <Field id="lastName" label={t.lastName} value={customer.lastName} onChange={(v) => setCustomer({ ...customer, lastName: v })} autoComplete="family-name" required />
              <Field id="email" label={t.email} type="email" value={customer.email} onChange={(v) => setCustomer({ ...customer, email: v })} autoComplete="email" required />
              <Field id="phone" label={t.phone} type="tel" value={customer.phone} onChange={(v) => setCustomer({ ...customer, phone: v })} autoComplete="tel" required />
              <Field id="flightNumber" label={t.flight} value={customer.flightNumber} onChange={(v) => setCustomer({ ...customer, flightNumber: v })} placeholder={t.flightPlaceholder} />
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="label">
                  {t.notes}
                </label>
                <textarea
                  id="notes"
                  className="input min-h-24"
                  maxLength={1000}
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  placeholder={t.notesPlaceholder}
                />
              </div>
            </div>

            {/* Pot de miel : masqué aux humains, rempli par les robots. */}
            <div className="hidden" aria-hidden>
              <label>
                Site web
                <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </label>
            </div>

            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="accent-gold mt-1 h-4 w-4"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                required
              />
              <span className="text-mist">
                {t.acceptPrefix}{' '}
                <a href="/cgv" target="_blank" className="text-gold-2 underline-offset-4 hover:underline">
                  {t.terms}
                </a>{' '}
                {t.and}{' '}
                <a href="/confidentialite" target="_blank" className="text-gold-2 underline-offset-4 hover:underline">
                  {t.privacy}
                </a>
                .
              </span>
            </label>

            {submitError && (
              <p role="alert" className="text-danger text-sm">
                {submitError}
              </p>
            )}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" className="btn-ghost" onClick={() => setStep(2)}>
                {t.back}
              </button>
              <button type="submit" className="btn-gold" disabled={submitting || !acceptTerms}>
                {submitting ? t.sending : quoteData?.online && quote ? t.pay(formatPrice(quote.dueNow)) : t.confirm}
              </button>
            </div>
          </form>
        )}
      </div>

      {!compact && (
        <aside className="border-line bg-ink-3/60 border-t p-6 sm:p-8 lg:border-t-0 lg:border-l">
          <p className="eyebrow">{t.yourTrip}</p>
          {quote && from && (mode === 'hourly' || to) ? (
            <div className="mt-4 space-y-4 text-sm">
              <p className="text-gold-2 text-xs font-semibold tracking-[0.18em] uppercase">
                {t.modes[quote.mode].label}
                {quote.mode === 'hourly' && quote.hours ? ` · ${quote.hours} h` : ''}
              </p>
              <div>
                <p className="text-mist text-xs">{mode === 'hourly' ? t.pickup : t.from}</p>
                <p className="text-cream">{from.label}</p>
              </div>
              {mode !== 'hourly' && to && (
                <div>
                  <p className="text-mist text-xs">{t.to}</p>
                  <p className="text-cream">{to.label}</p>
                </div>
              )}
              <div>
                <p className="text-mist text-xs">{mode === 'return' ? t.outbound : t.pickup}</p>
                <p className="text-cream">{formatWhen(date, time, locale)}</p>
              </div>
              {mode === 'return' && returnDate && returnTime && (
                <div>
                  <p className="text-mist text-xs">{t.inbound}</p>
                  <p className="text-cream">{formatWhen(returnDate, returnTime, locale)}</p>
                </div>
              )}
              <p className="text-mist text-xs">
                {quote.mode === 'hourly'
                  ? `${formatKm(quote.distanceKm)} ${t.included}`
                  : `${formatKm(quote.distanceKm)} · ${formatDuration(quote.durationMin)}${
                      quoteData?.route?.source === 'estimation' ? ` ${t.estimate}` : ''
                    }${quote.mode === 'return' ? ` ${t.perLeg}` : ''}`}{' '}
                · {quote.vehicleCount > 1 ? `${quote.vehicleCount} × ` : ''}
                {quote.vehicleName}
              </p>
              <ul className="border-line divide-line divide-y border-y">
                {quote.lines.map((l, i) => (
                  <li key={i} className="flex justify-between py-2">
                    <span className="text-mist">{l.label}</span>
                    <span>{formatPrice(l.amount)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-baseline justify-between">
                <span className="text-cream font-semibold">{t.total}</span>
                <span className="font-display text-gold-2 text-3xl">{formatPrice(quote.total)}</span>
              </div>
              <p className="text-mist text-xs leading-relaxed">
                {quoteData?.online
                  ? quote.paymentMode === 'deposit' && quote.balance > 0
                    ? t.depositNote(formatPrice(quote.dueNow), quote.depositPercent, formatPrice(quote.balance))
                    : t.onlineNote
                  : t.onboardNote}
              </p>
            </div>
          ) : (
            <div className="text-mist mt-4 space-y-3 text-sm leading-relaxed">
              <p>{t.emptyIntro}</p>
              <ul className="space-y-2">
                {t.emptyPoints.map((p) => (
                  <li key={p} className="before:text-gold before:mr-2 before:content-['◆']">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      )}
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required,
  autoComplete,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  autoComplete?: string
  placeholder?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="input"
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
