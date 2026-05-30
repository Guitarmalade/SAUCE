import type { Metadata } from 'next'
import { BetaVslPlayer, FounderCallCTA } from '@/components/beta-watch-experience'

export const metadata: Metadata = {
  title: 'Watch the SAUCE Beta Overview | Guitarmalade',
  description:
    'Watch the SAUCE beta overview and book a short founder call with Chris from Guitarmalade.',
}

export default function WatchPage() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-10 md:py-12">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <section>
          <div className="mb-6 max-w-3xl">
            <p className="label-eyebrow text-navy/55">SAUCE Beta Overview</p>
            <h1 className="mt-3 text-4xl font-black leading-[0.98] tracking-tight text-navy md:text-6xl">
              Watch this before your beta wave opens.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-navy/70">
              A short look at the practice system, why it exists, and how the early beta feedback loop works.
            </p>
          </div>

          <BetaVslPlayer className="mt-0" />
        </section>

        <aside className="lg:sticky lg:top-10">
          <FounderCallCTA className="mt-0" />
        </aside>
      </div>
    </main>
  )
}
