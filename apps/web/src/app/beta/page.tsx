import type { Metadata } from 'next'
import { ArrowRight, Clock3, Flame, Map } from 'lucide-react'
import BetaSignupForm from '@/components/beta-signup-form'

export const metadata: Metadata = {
  title: 'Join the SAUCE Beta | Guitarmalade',
  description:
    'Get early access to the SAUCE beta and help shape Guitarmalade’s student-first practice platform.',
}

const valueProps = [
  {
    title: 'Structured onboarding',
    copy: 'Start with your actual level, goals, and weak spots instead of a generic course dump.',
    Icon: Map,
  },
  {
    title: 'Daily accountability',
    copy: 'Practice logs, streak pressure, and a tighter loop between intent and real guitar time.',
    Icon: Clock3,
  },
  {
    title: 'Turn it into music',
    copy: 'The point is not just theory retention. The point is applying it in a way that sounds like you.',
    Icon: Flame,
  },
]

export default function BetaSignupPage() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-10 md:py-12">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 shadow-sm backdrop-blur">
            <span className="label-eyebrow text-[10px]">Guitarmalade x SAUCE</span>
          </div>

          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-navy md:text-7xl">
              Join the beta for the practice platform built to make guitar players harder to ignore.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-navy/72 md:text-xl">
              SAUCE is Guitarmalade&apos;s student-first system for practice, progression, and accountability.
              Structured curriculum, real momentum, and a tighter bridge from exercises to music.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {valueProps.map(({ title, copy, Icon }) => (
              <article key={title} className="glass-card rounded-[24px] border border-white/60 p-6">
                <div className="mb-5 inline-flex rounded-2xl bg-amber/12 p-3 text-amber-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mb-2 text-xl font-extrabold text-navy">{title}</h2>
                <p className="text-sm leading-relaxed text-navy/68">{copy}</p>
              </article>
            ))}
          </div>

          <div className="rounded-[28px] border border-navy/10 bg-navy px-6 py-7 text-offwhite shadow-[0_28px_70px_rgba(26,35,64,0.22)] md:px-7">
            <p className="label-eyebrow text-white/60">What beta gets you</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
                <p className="text-sm leading-relaxed text-white/82">
                  First access to the beta rollout before the public launch.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
                <p className="text-sm leading-relaxed text-white/82">
                  A direct line into the product while the practice flow is still being shaped.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
                <p className="text-sm leading-relaxed text-white/82">
                  A calmer alternative to random tabs, scattered notes, and zero accountability.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="lg:sticky lg:top-10">
          <BetaSignupForm />
        </div>
      </div>
    </main>
  )
}
