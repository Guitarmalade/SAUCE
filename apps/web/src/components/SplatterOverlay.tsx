'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePracticeTimer } from '@/context/PracticeTimerContext'

const splatterPaths = [
  "M 100, 100 Q 150, 50 200, 100 Q 250, 150 200, 200 Q 150, 250 100, 200 Q 50, 150 100, 100", // Placeholder smooth blob
  "M 50, 100 Q 100, 0 150, 100 T 250, 100 T 150, 200 T 50, 100", // Star/splat 
]

export default function SplatterOverlay() {
  const { activeAnimation } = usePracticeTimer()

  return (
    <AnimatePresence>
      {activeAnimation === 'splash' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1.5], rotate: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden"
        >
          {/* Quick splash of vibrant paint */}
          <div className="absolute w-64 h-64 bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-80" />
          <svg viewBox="0 0 300 300" className="w-96 h-96 fill-pink-500 opacity-90 drop-shadow-2xl">
            <path d={splatterPaths[0]} />
          </svg>
        </motion.div>
      )}

      {activeAnimation === 'explosion' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center"
        >
          {/* Massive full-screen explosion */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: [0, 3, 5] }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-[800px] h-[800px] bg-gradient-to-tr from-amber via-yellow-400 to-orange-500 rounded-full filter blur-[100px] opacity-70" />
          </motion.div>

          {/* Splatter particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{ 
                scale: [0, Math.random() * 2 + 1, 0],
                x: (Math.random() - 0.5) * 1000,
                y: (Math.random() - 0.5) * 1000,
              }}
              transition={{ duration: 2, ease: "easeOut", delay: Math.random() * 0.2 }}
              className={`absolute w-16 h-16 rounded-full ${
                ['bg-pink-500', 'bg-purple-500', 'bg-amber', 'bg-blue-500', 'bg-green-500'][i % 5]
              }`}
            />
          ))}

          {/* Central text popup */}
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.6, duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            <h2 className="text-8xl font-paint text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
              LEVEL UP!
            </h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
