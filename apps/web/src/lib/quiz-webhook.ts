export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type QuizSubmissionPayload = Record<string, unknown>

export async function submitQuizResult(payload: QuizSubmissionPayload) {
  try {
    await fetch('/api/sauce-diagnostic/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.error('SauceDiagnostic lead webhook failed:', error)
  }
}
