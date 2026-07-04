export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type QuizPayloadArgs = {
  firstName?: string
  email: string
  archetype: string
  scores: Record<string, number>
  answers: unknown
}

export async function submitQuizResult({ firstName, email, archetype, scores, answers }: QuizPayloadArgs) {
  const webhookUrl = process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL

  if (!webhookUrl) {
    console.error('Missing NEXT_PUBLIC_ZAPIER_WEBHOOK_URL')
    return
  }

  const params = new URLSearchParams(window.location.search)
  const payload = {
    first_name: firstName?.trim() || '',
    email: email.trim().toLowerCase(),
    archetype,
    archetype_slug: archetype.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
    scores: JSON.stringify(scores),
    answers: JSON.stringify(answers),
    source: 'sauce_diagnostic_quiz',
    quiz_url: window.location.href,
    submitted_at: new Date().toISOString(),
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    ...(params.get('test') === '1' ? { test: true } : {}),
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('Quiz webhook failed:', err)
  }
}
