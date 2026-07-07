import type { Metadata } from 'next'
import { Suspense } from 'react'
import SauceDiagnosticQuiz from '@/components/sauce-diagnostic-quiz'

export const metadata: Metadata = {
  title: 'SauceDiagnostic | Guitarmalade',
  description: 'Find the fretboard block that is keeping you stuck and get the next path.',
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fff9ef]" />}>
      <SauceDiagnosticQuiz />
    </Suspense>
  )
}
