'use client'

import { useEffect, useRef } from 'react'

export default function AlphaTabPlayer({ fileUrl }: { fileUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    let api: any = null

    // Dynamically import alphaTab since it requires window/document
    import('@coderline/alphatab').then((alphaTab) => {
      if (containerRef.current) {
        api = new alphaTab.AlphaTabApi(containerRef.current, {
          core: {
            file: fileUrl,
            fontDirectory: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/font/'
          },
          player: {
            enablePlayer: true,
            soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2',
          },
        })
      }
    })

    return () => {
      if (api) {
        api.destroy()
      }
    }
  }, [fileUrl])

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 overflow-hidden">
      {/* AlphaTab will render inside this container */}
      <div 
        ref={containerRef} 
        className="w-full min-h-[300px] overflow-auto at-wrap"
      >
        <div className="flex items-center justify-center h-full text-navy/50 font-bold">
          Loading notation...
        </div>
      </div>
      
      <style jsx global>{`
        .at-wrap {
          background: transparent;
        }
        .at-cursor-bar {
          background: rgba(240, 165, 0, 0.2);
        }
        .at-cursor-beat {
          background: rgba(26, 35, 64, 0.2);
        }
      `}</style>
    </div>
  )
}
