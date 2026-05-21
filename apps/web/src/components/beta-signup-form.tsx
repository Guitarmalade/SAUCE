'use client'

import { type FormEvent, useEffect, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

const archetypeOptions = [
  { value: 'shredFanatic', label: 'Shred fanatic' },
  { value: 'bluesMan', label: 'Blues player' },
  { value: 'classicRocker', label: 'Classic rocker' },
  { value: 'songwriter', label: 'Songwriter' },
  { value: 'neoSoul', label: 'Neo soul player' },
] as const

const yearsPlayingOptions = [
  '0-1 years',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years',
]

type FormState = {
  email: string
  archetype: string
  yearsPlaying: string
  referrer: string
}

type WaitlistResponse = {
  ok: boolean
  error?: string
  position?: number
}

function deriveReferrer() {
  if (typeof window === 'undefined') {
    return ''
  }

  const params = new URLSearchParams(window.location.search)
  const explicitRef = params.get('ref')

  if (explicitRef) {
    return explicitRef
  }

  const utmSource = params.get('utm_source')
  const utmMedium = params.get('utm_medium')
  const utmCampaign = params.get('utm_campaign')
  const utmReferrer = [utmSource, utmMedium, utmCampaign].filter(Boolean).join(' / ')

  if (utmReferrer) {
    return utmReferrer
  }

  if (!document.referrer) {
    return ''
  }

  try {
    return new URL(document.referrer).hostname
  } catch {
    return document.referrer
  }
}

export default function BetaSignupForm() {
  const [form, setForm] = useState<FormState>({
    email: '',
    archetype: 'bluesMan',
    yearsPlaying: '',
    referrer: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [position, setPosition] = useState<number | null>(null)

  useEffect(() => {
    const referrer = deriveReferrer()

    if (!referrer) {
      return
    }

    setForm((current) => {
      if (current.referrer) {
        return current
      }

      return {
        ...current,
        referrer,
      }
    })
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    setPosition(null)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          archetype: form.archetype.trim(),
          yearsPlaying: form.yearsPlaying.trim(),
          referrer: form.referrer.trim(),
        }),
      })

      const result = (await response.json()) as WaitlistResponse

      if (!response.ok || !result.ok) {
        setStatus('error')
        setMessage(result.error || 'That did not save cleanly. Check the fields and try again.')
        return
      }

      setStatus('success')
      setPosition(result.position ?? null)
      setMessage("You're in. I'll use this email for the beta invite and launch updates.")
      setForm((current) => ({
        ...current,
        email: '',
      }))
    } catch {
      setStatus('error')
      setMessage('That did not save cleanly. Check the fields and try again.')
    }
  }

  if (status === 'success') {
    return (
      <section className="glass-card rounded-[28px] border border-white/60 bg-white/85 p-7 shadow-[0_24px_60px_rgba(26,35,64,0.12)] md:p-8">
        <div className="space-y-4">
          <p className="label-eyebrow">You&apos;re In</p>
          <h2 className="text-3xl font-extrabold text-navy">Your seat is saved.</h2>
          <p className="text-base leading-relaxed text-navy/70">
            {message}
            {position !== null ? ` Current beta position: #${position}.` : ''}
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-navy/10 bg-navy shadow-[0_18px_44px_rgba(26,35,64,0.18)]">
          <div className="aspect-video">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/DIrE2cQ1yyU?autoplay=1&rel=0&modestbranding=1"
              title="SAUCE beta video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Watch the short VSL while you wait for the beta invite.</p>
          </div>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-navy/55">
          Keep this tab if you want the fast overview right now. Your spot is already recorded.
        </p>
      </section>
    )
  }

  return (
    <section className="glass-card rounded-[28px] border border-white/60 bg-white/85 p-7 shadow-[0_24px_60px_rgba(26,35,64,0.12)] md:p-8">
      <div className="mb-6 space-y-3">
        <p className="label-eyebrow">Beta Signup</p>
        <h2 className="text-3xl font-extrabold text-navy">Claim an early seat</h2>
        <p className="text-base leading-relaxed text-navy/70">
          No spam. Just beta access, rollout updates, and a short feedback loop once the product is live.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-bold text-navy">Email</span>
          <input
            className="w-full rounded-2xl border border-navy/10 bg-white px-4 py-3 text-base text-navy outline-none transition focus:border-amber focus:ring-4 focus:ring-amber/15"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@domain.com"
            required
            disabled={status === 'submitting'}
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-bold text-navy">Which best describes you?</span>
          <select
            className="w-full rounded-2xl border border-navy/10 bg-white px-4 py-3 text-base text-navy outline-none transition focus:border-amber focus:ring-4 focus:ring-amber/15"
            name="archetype"
            required
            disabled={status === 'submitting'}
            value={form.archetype}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                archetype: event.target.value,
              }))
            }
          >
            {archetypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-bold text-navy">Years playing</span>
          <select
            className="w-full rounded-2xl border border-navy/10 bg-white px-4 py-3 text-base text-navy outline-none transition focus:border-amber focus:ring-4 focus:ring-amber/15"
            name="yearsPlaying"
            disabled={status === 'submitting'}
            value={form.yearsPlaying}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                yearsPlaying: event.target.value,
              }))
            }
          >
            <option value="">Prefer not to say</option>
            {yearsPlayingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-bold text-navy">How did you hear about this?</span>
          <input
            className="w-full rounded-2xl border border-navy/10 bg-white px-4 py-3 text-base text-navy outline-none transition focus:border-amber focus:ring-4 focus:ring-amber/15"
            type="text"
            name="referrer"
            placeholder="Instagram, YouTube, friend, lesson, blog..."
            disabled={status === 'submitting'}
            value={form.referrer}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                referrer: event.target.value,
              }))
            }
          />
        </label>

        <button
          className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          {status === 'submitting' ? 'Saving your spot...' : 'Join the beta'}
        </button>
      </form>

      {message ? (
        <div
          className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          <div className="flex items-start gap-2">
            <p>{message}</p>
          </div>
        </div>
      ) : null}

      <p className="mt-5 text-xs leading-relaxed text-navy/55">
        By joining, you&apos;re raising your hand for early access. This is not a billing commitment.
      </p>
    </section>
  )
}
