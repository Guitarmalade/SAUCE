import type { Metadata } from 'next'
import { Inter, Rubik_Wet_Paint } from 'next/font/google'
import './globals.css'
import { PracticeTimerProvider } from '@/context/PracticeTimerContext'
import SplatterOverlay from '@/components/SplatterOverlay'
import ActiveTimerWidget from '@/components/ActiveTimerWidget'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const paintFont = Rubik_Wet_Paint({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-paint',
})

export const metadata: Metadata = {
  title: 'SAUCE',
  description: 'The ultimate student practice and progress tracking platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${paintFont.variable} font-sans antialiased bg-offwhite min-h-screen selection:bg-amber selection:text-navy`}>
        {/* Background decorative elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-navy/5 blur-[120px]" />
        </div>
        <PracticeTimerProvider>
          {children}
          <SplatterOverlay />
          <ActiveTimerWidget />
        </PracticeTimerProvider>
      </body>
    </html>
  )
}
