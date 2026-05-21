import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const allowedArchetypes = new Set([
  'shredFanatic',
  'bluesMan',
  'classicRocker',
  'songwriter',
  'neoSoul',
])

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const resendApiUrl = 'https://api.resend.com/emails'
const betaVslUrl = 'https://www.youtube.com/watch?v=DIrE2cQ1yyU'
const brandInk = '#141A36'
const brandCream = '#FCF6E8'
const brandMarmalade = '#F5A623'
const brandMuted = '#6C7286'
const brandPaper = '#FFFDF8'
const brandLine = 'rgba(20, 26, 54, 0.12)'
const emailFontStack =
  "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

const archetypeMeta = {
  shredFanatic: {
    displayName: 'Shred Fanatic',
    tagline: 'Fast hands, big appetite, zero interest in staying boxed in.',
  },
  bluesMan: {
    displayName: 'Blues Man',
    tagline: 'Feel first, phrasing over flash, and every note needs a reason.',
  },
  classicRocker: {
    displayName: 'Classic Rocker',
    tagline: 'Big riffs, strong hooks, and tone that still makes the room turn.',
  },
  songwriter: {
    displayName: 'Songwriter',
    tagline: 'Chasing songs that say something, not just shapes on the neck.',
  },
  neoSoul: {
    displayName: 'Neo Soul Player',
    tagline: 'Color, pocket, and chord movement with real personality.',
  },
} as const

type AllowedArchetype = keyof typeof archetypeMeta

function getAllowedOrigins() {
  const configuredOrigins = (process.env.BETA_SIGNUP_ORIGIN || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  return new Set([
    'https://beta.guitarmalade.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ...configuredOrigins,
  ])
}

function buildCorsHeaders(origin?: string) {
  const allowedOrigins = getAllowedOrigins()
  const safeOrigin =
    origin && allowedOrigins.has(origin)
      ? origin
      : Array.from(allowedOrigins)[0] || 'https://beta.guitarmalade.com'

  return {
    'Access-Control-Allow-Origin': safeOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

function isAllowedOrigin(origin: string | null) {
  if (!origin) {
    return true
  }

  return getAllowedOrigins().has(origin)
}

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase service role configuration is missing.')
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function getSenderEmail() {
  return process.env.RESEND_FROM_EMAIL || 'Chris <onboarding@resend.dev>'
}

function getFounderNotificationEmail() {
  return process.env.BETA_WAITLIST_NOTIFY_TO || 'schreiner.chris@gmail.com'
}

function getArchetypeDetails(archetype: string) {
  return archetypeMeta[archetype as AllowedArchetype]
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getSupabaseWaitlistRowUrl(rowId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const match = supabaseUrl.match(/^https:\/\/([a-z0-9-]+)\.supabase\.co$/i)

  if (!match || !rowId) {
    return ''
  }

  return `https://supabase.com/dashboard/project/${match[1]}/editor?schema=public&table=waitlist&filter=${encodeURIComponent(`id:eq.${rowId}`)}`
}

function buildEmailShell(
  content: string,
  options: {
    outerBackground?: string
    cardBackground?: string
    borderColor?: string
    textColor?: string
    topBarColor?: string
  } = {}
) {
  const outerBackground = options.outerBackground || brandCream
  const cardBackground = options.cardBackground || brandPaper
  const borderColor = options.borderColor || brandLine
  const textColor = options.textColor || brandInk
  const topBarColor = options.topBarColor || brandMarmalade

  return `
    <div style="margin:0;padding:32px 20px;background:${outerBackground};font-family:${emailFontStack};color:${textColor};">
      <div style="max-width:640px;margin:0 auto;background:${cardBackground};border:1px solid ${borderColor};border-radius:28px;overflow:hidden;box-shadow:0 18px 44px rgba(20,26,54,0.08);">
        <div style="height:10px;background:${topBarColor};"></div>
        <div style="padding:32px;">
          ${content}
        </div>
      </div>
    </div>
  `
}

function buildActionLink(
  href: string,
  label: string,
  options: {
    background?: string
    borderColor?: string
    textColor?: string
  } = {}
) {
  const background = options.background || brandPaper
  const borderColor = options.borderColor || brandLine
  const textColor = options.textColor || brandInk

  return `<a href="${href}" style="display:inline-block;padding:12px 16px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:700;border:1px solid ${borderColor};background:${background};color:${textColor};">${label}</a>`
}

async function sendResendEmail(payload: {
  to: string | string[]
  subject: string
  html: string
  text: string
}) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY.')
  }

  const response = await fetch(resendApiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: getSenderEmail(),
      ...payload,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Resend email failed (${response.status}): ${errorText}`)
  }
}

function buildWelcomeEmail(archetype: string, position: number) {
  const details = getArchetypeDetails(archetype)
  const displayName = escapeHtml(details.displayName)
  const tagline = escapeHtml(details.tagline)

  return {
    subject: "you're in",
    html: `
      <div style="margin:0;padding:28px 20px;background:${brandCream};font-family:${emailFontStack};color:${brandInk};">
        <div style="max-width:560px;margin:0 auto;">
          <p style="margin:0 0 18px;font-size:17px;line-height:1.75;color:${brandInk};">hey,</p>
          <p style="margin:0 0 18px;font-size:17px;line-height:1.75;color:${brandInk};">
            you're in.
          </p>
          <p style="margin:0 0 18px;font-size:17px;line-height:1.75;color:${brandInk};">
            i've got your spot saved for the beta at <strong>#${position}</strong>.
          </p>
          <p style="margin:0 0 18px;font-size:17px;line-height:1.75;color:${brandInk};">
            you came in as a <strong>${displayName}</strong>.
            <br />
            <span style="font-style:italic;color:${brandMuted};">${tagline}</span>
          </p>
          <p style="margin:0 0 18px;font-size:17px;line-height:1.75;color:${brandInk};">
            that gives me a pretty good read on what you're hearing, what you're chasing, and how this can help.
          </p>
          <p style="margin:0 0 18px;font-size:17px;line-height:1.75;color:${brandInk};">
            i'm opening this up in waves so i can keep it personal, see how people actually practice, and make the thing better before i widen the circle.
          </p>
          <p style="margin:0 0 18px;font-size:17px;line-height:1.75;color:${brandInk};">
            if you want the quick overview, watch this:
            <a href="${betaVslUrl}" style="color:${brandInk};font-weight:700;text-decoration:underline;">${betaVslUrl}</a>
          </p>
          <p style="margin:0 0 18px;font-size:17px;line-height:1.75;color:${brandInk};">
            when your wave opens, i'll send the invite here.
          </p>
          <p style="margin:0;font-size:17px;line-height:1.75;color:${brandInk};">— Chris</p>
        </div>
      </div>
    `,
    text: `hey,

you're in.

i've got your spot saved for the beta at #${position}.

you came in as a ${details.displayName}.
${details.tagline}

that gives me a pretty good read on what you're hearing, what you're chasing, and how this can help.

i'm opening this up in waves so i can keep it personal, see how people actually practice, and make the thing better before i widen the circle.

if you want the quick overview, watch this:
${betaVslUrl}

when your wave opens, i'll send the invite here.

— Chris`,
  }
}

function buildFounderNotificationEmail(input: {
  rowId: string
  email: string
  archetype: string
  yearsPlaying: string
  referrer: string
  position: number
}) {
  const details = getArchetypeDetails(input.archetype)
  const timestamp = new Date().toISOString()
  const supabaseRowUrl = getSupabaseWaitlistRowUrl(input.rowId)
  const replyUrl = `mailto:${encodeURIComponent(input.email)}?subject=${encodeURIComponent('Welcome to Guitarmalade — from Chris')}`
  const displayName = escapeHtml(details.displayName)
  const tagline = escapeHtml(details.tagline)
  const safeEmail = escapeHtml(input.email)
  const safeYearsPlaying = escapeHtml(input.yearsPlaying || 'Not provided')
  const safeReferrer = escapeHtml(input.referrer || 'Not provided')

  return {
    subject: `🎸 New beta signup — ${details.displayName}`,
    html: buildEmailShell(`
      <h1 style="margin:0 0 14px;font-size:30px;line-height:1.12;font-weight:800;color:${brandCream};">🎸 NEW BETA SIGNUP — #${input.position}</h1>
      <p style="margin:0 0 8px;font-size:32px;line-height:1.08;font-weight:800;color:${brandCream};">${displayName}</p>
      <p style="margin:0 0 24px;font-size:17px;line-height:1.7;font-style:italic;color:rgba(252,246,232,0.72);">${tagline}</p>
      <div style="margin:0 0 24px;padding:22px;border-radius:22px;background:rgba(252,246,232,0.06);border:1px solid rgba(245,166,35,0.26);">
        <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:${brandCream};">📧 <strong>Email:</strong> ${safeEmail}</p>
        <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:${brandCream};">🎯 <strong>Archetype:</strong> ${displayName}</p>
        <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:${brandCream};">🔥 <strong>Tagline:</strong> ${tagline}</p>
        <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:${brandCream};">⏱️ <strong>Years:</strong> ${safeYearsPlaying}</p>
        <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:${brandCream};">📍 <strong>Referrer:</strong> ${safeReferrer}</p>
        <p style="margin:0;font-size:16px;line-height:1.6;color:${brandCream};">🕒 <strong>Timestamp:</strong> ${escapeHtml(timestamp)}</p>
      </div>
      <div style="padding-top:20px;border-top:1px solid rgba(245,166,35,0.22);">
        <div>
          ${supabaseRowUrl ? buildActionLink(supabaseRowUrl, 'View in Supabase', {
            background: 'transparent',
            borderColor: 'rgba(252,246,232,0.34)',
            textColor: brandCream,
          }) : ''}
          <span style="display:inline-block;width:10px;"></span>
          ${buildActionLink(replyUrl, 'Reply with welcome', {
            background: brandMarmalade,
            borderColor: brandMarmalade,
            textColor: brandInk,
          })}
        </div>
      </div>
    `, {
      outerBackground: brandInk,
      cardBackground: brandInk,
      borderColor: 'rgba(245,166,35,0.28)',
      textColor: brandCream,
      topBarColor: brandMarmalade,
    }),
    text: `New beta signup

email: ${input.email}
archetype: ${details.displayName}
tagline: ${details.tagline}
years_playing: ${input.yearsPlaying || 'Not provided'}
referrer: ${input.referrer || 'Not provided'}
position: #${input.position}
timestamp: ${timestamp}

View in Supabase: ${supabaseRowUrl || 'Unavailable'}
Reply: ${replyUrl}`,
  }
}

async function sendWaitlistEmails(input: {
  rowId: string
  email: string
  archetype: string
  yearsPlaying: string
  referrer: string
  position: number
}) {
  const welcomeEmail = buildWelcomeEmail(input.archetype, input.position)
  const founderEmail = buildFounderNotificationEmail(input)

  const results = await Promise.allSettled([
    sendResendEmail({
      to: input.email,
      subject: welcomeEmail.subject,
      html: welcomeEmail.html,
      text: welcomeEmail.text,
    }),
    sendResendEmail({
      to: getFounderNotificationEmail(),
      subject: founderEmail.subject,
      html: founderEmail.html,
      text: founderEmail.text,
    }),
  ])

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const label = index === 0 ? 'welcome' : 'founder'
      console.error(`waitlist ${label} email failed`, result.reason)
    }
  })
}

function badRequest(message: string, origin?: string | null) {
  return NextResponse.json(
    { ok: false, error: message },
    {
      status: 400,
      headers: buildCorsHeaders(origin || undefined),
    }
  )
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')

  if (!isAllowedOrigin(origin)) {
    return NextResponse.json(
      { ok: false, error: 'Origin not allowed.' },
      {
        status: 403,
        headers: buildCorsHeaders(origin || undefined),
      }
    )
  }

  return new NextResponse(null, {
    status: 204,
    headers: buildCorsHeaders(origin || undefined),
  })
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  if (!isAllowedOrigin(origin)) {
    return NextResponse.json(
      { ok: false, error: 'Origin not allowed.' },
      {
        status: 403,
        headers: buildCorsHeaders(origin || undefined),
      }
    )
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return badRequest('Invalid JSON body.', origin)
  }

  const payload = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''
  const archetype = typeof payload.archetype === 'string' ? payload.archetype.trim() : ''
  const yearsPlaying =
    typeof payload.yearsPlaying === 'string' ? payload.yearsPlaying.trim() : ''
  const referrer = typeof payload.referrer === 'string' ? payload.referrer.trim() : ''

  if (!emailPattern.test(email)) {
    return badRequest('Please enter a valid email address.', origin)
  }

  if (!allowedArchetypes.has(archetype)) {
    return badRequest('Please choose a valid player type.', origin)
  }

  try {
    const supabase = createAdminClient()

    const { data: waitlistRow, error: upsertError } = await supabase
      .from('waitlist')
      .upsert(
        {
          email,
          archetype,
          years_playing: yearsPlaying || null,
          referrer: referrer || null,
        },
        {
          onConflict: 'email',
        }
      )
      .select('id')
      .single()

    if (upsertError) {
      throw upsertError
    }

    const { count, error: countError } = await supabase
      .from('waitlist')
      .select('id', { count: 'exact', head: true })

    if (countError) {
      throw countError
    }

    try {
      await sendWaitlistEmails({
        rowId: waitlistRow.id,
        email,
        archetype,
        yearsPlaying,
        referrer,
        position: count ?? 0,
      })
    } catch (error) {
      console.error('waitlist email dispatch failed', error)
    }

    return NextResponse.json(
      {
        ok: true,
        position: count ?? 0,
      },
      {
        headers: buildCorsHeaders(origin || undefined),
      }
    )
  } catch (error) {
    console.error('waitlist POST failed', error)

    return NextResponse.json(
      { ok: false, error: 'Could not save waitlist signup.' },
      {
        status: 500,
        headers: buildCorsHeaders(origin || undefined),
      }
    )
  }
}
