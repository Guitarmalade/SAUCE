'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { CalendarClock, ExternalLink } from 'lucide-react'

export const founderCallUrl = 'https://calendly.com/chris-guitarmalade/guitarmalade-call'
const founderHeadshotUrl =
  'https://cdn.prod.website-files.com/642e7ef447d6adbabfead056/6446140c1c8ecc626430967b_pic.jpg'
const betaVideoUrl =
  'https://www.youtube.com/embed/DIrE2cQ1yyU?autoplay=1&rel=0&modestbranding=1&enablejsapi=1'

type YouTubePlayer = {
  destroy: () => void
}

type YouTubePlayerConstructor = new (
  elementId: string,
  options: {
    events: {
      onStateChange: (event: { data: number }) => void
    }
  },
) => YouTubePlayer

declare global {
  interface Window {
    YT?: {
      Player: YouTubePlayerConstructor
      PlayerState?: {
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

let youtubeApiPromise: Promise<void> | null = null

function loadYouTubeIframeApi() {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  if (window.YT?.Player) {
    return Promise.resolve()
  }

  youtubeApiPromise ??= new Promise((resolve) => {
    const previousReadyHandler = window.onYouTubeIframeAPIReady

    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.()
      resolve()
    }

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      document.body.appendChild(script)
    }
  })

  return youtubeApiPromise
}

export function FounderCallCTA({ className = 'mt-6' }: { className?: string }) {
  return (
    <section className={`${className} overflow-hidden rounded-[24px] border border-amber/30 bg-amber/10 shadow-[0_18px_44px_rgba(26,35,64,0.1)]`}>
      <div className="grid gap-5 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex items-center gap-4 sm:block">
          <img
            className="h-16 w-16 shrink-0 rounded-full border-4 border-white object-cover shadow-[0_10px_28px_rgba(26,35,64,0.18)] sm:h-20 sm:w-20"
            src={founderHeadshotUrl}
            alt="Chris Schreiner"
          />
          <div className="sm:hidden">
            <p className="label-eyebrow text-navy/55">Founder Call</p>
            <h3 className="text-xl font-extrabold leading-tight text-navy">Book a call with Chris</h3>
          </div>
        </div>

        <div>
          <div className="hidden sm:block">
            <p className="label-eyebrow text-navy/55">Founder Call</p>
            <h3 className="text-2xl font-extrabold leading-tight text-navy">Book a call with Chris</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-navy/70">
            Bring your goals, current roadblocks, and what you want SAUCE to solve. Early beta feedback
            gets a direct founder conversation while spots are still manageable.
          </p>

          <a
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-navy px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-navy/15 transition hover:-translate-y-0.5 hover:bg-navy/90 sm:w-auto"
            href={founderCallUrl}
            target="_blank"
            rel="noreferrer"
          >
            <CalendarClock className="h-4 w-4" />
            Book a call
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

export function BetaVslPlayer({ className = 'mt-6' }: { className?: string }) {
  const reactId = useId()
  const playerId = `sauce-beta-vsl-player-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const playerRef = useRef<YouTubePlayer | null>(null)
  const [videoEnded, setVideoEnded] = useState(false)

  useEffect(() => {
    let isMounted = true

    loadYouTubeIframeApi().then(() => {
      if (!isMounted || playerRef.current || !window.YT?.Player) {
        return
      }

      playerRef.current = new window.YT.Player(playerId, {
        events: {
          onStateChange: (event) => {
            if (event.data === 0) {
              setVideoEnded(true)
            }
          },
        },
      })
    })

    return () => {
      isMounted = false
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [playerId])

  return (
    <div
      className={`${className} overflow-hidden rounded-[24px] border border-navy/10 bg-navy shadow-[0_18px_44px_rgba(26,35,64,0.18)]`}
      data-testid="beta-vsl-player"
    >
      <div className="relative aspect-video">
        <iframe
          id={playerId}
          className="h-full w-full"
          src={betaVideoUrl}
          title="SAUCE beta video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />

        {videoEnded ? (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-navy/95 p-5 text-center text-white"
            data-testid="beta-vsl-ended-overlay"
          >
            <div className="max-w-sm">
              <p className="label-eyebrow text-white/55">Next Step</p>
              <h3 className="mt-2 text-2xl font-extrabold leading-tight">Talk through your guitar goals with Chris</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/72">
                Keep the momentum here instead of drifting into YouTube recommendations.
              </p>
              <a
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber px-4 py-3 text-sm font-extrabold text-navy shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-amber-400 sm:w-auto"
                href={founderCallUrl}
                target="_blank"
                rel="noreferrer"
              >
                <CalendarClock className="h-4 w-4" />
                Book a call
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
