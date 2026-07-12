import { NextResponse } from 'next/server'

type LeadPhase = 'gate' | 'final'

export async function POST(request: Request) {
  const webhookUrl = process.env.WEBHOOK_URL ?? process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL

  if (!webhookUrl) {
    return NextResponse.json({ error: 'Missing Zapier webhook URL' }, { status: 500 })
  }

  const body = await request.json().catch(() => null)

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const phase = (body as { phase?: LeadPhase }).phase
  const timestamp = new Date().toISOString()

  const minimalPayload = {
    email: String((body as { email?: string }).email ?? ''),
    firstName: String((body as { firstName?: string }).firstName ?? ''),
    first_name: String((body as { firstName?: string }).firstName ?? ''),
    archetype: String((body as { archetype?: string }).archetype ?? ''),
    archetype_slug: String((body as { archetype?: string }).archetype ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '_'),
    source: 'sauce_diagnostic_quiz',
    timestamp,
    submitted_at: timestamp,
  }

  const finalPayload = {
    email: String((body as { email?: string }).email ?? ''),
    firstName: String((body as { firstName?: string }).firstName ?? ''),
    first_name: String((body as { firstName?: string }).firstName ?? ''),
    archetype: String((body as { archetype?: string }).archetype ?? ''),
    archetype_slug: String((body as { archetype?: string }).archetype ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '_'),
    experience: String((body as { experience?: string }).experience ?? ''),
    practiceTime: String((body as { practiceTime?: string }).practiceTime ?? ''),
    styles: Array.isArray((body as { styles?: string[] }).styles) ? (body as { styles: string[] }).styles : [],
    blocker: String((body as { blocker?: string }).blocker ?? ''),
    readiness: String((body as { readiness?: string }).readiness ?? ''),
    leadScore: String((body as { leadScore?: string }).leadScore ?? ''),
    answers: (body as { answers?: Record<string, string> }).answers ?? {},
    source: 'sauce_diagnostic_quiz',
    timestamp,
    submitted_at: timestamp,
  }

  const payload = phase === 'gate' ? minimalPayload : finalPayload

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error('Zapier webhook returned a non-OK status', response.status)
      return NextResponse.json({ error: 'Zapier webhook returned a non-OK status' }, { status: 502 })
    }
  } catch (error) {
    console.error('Zapier webhook failed', error)
    return NextResponse.json({ error: 'Zapier webhook failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
