export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type QuizSubmissionPayload = Record<string, unknown>

export async function submitQuizResult(payload: QuizSubmissionPayload) {
  const response = await fetch('/api/sauce-diagnostic/lead', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`SauceDiagnostic lead webhook failed with status ${response.status}`)
  }
}
