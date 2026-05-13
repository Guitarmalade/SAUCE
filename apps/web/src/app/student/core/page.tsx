import Link from 'next/link'
import { ArrowLeft, Key, Music, Sliders } from 'lucide-react'
import { Splat, SplatBackdrop } from '@/components/ui/Splats'

export default function CoreCurriculumReference() {
  return (
    <div className="min-h-screen bg-[var(--bg)] relative overflow-hidden pb-20">
      <SplatBackdrop intensity="subtle" palette="default" />

      {/* Header */}
      <header className="relative z-20 backdrop-blur-md bg-white/80 border-b border-[var(--line)] sticky top-0">
        <div className="max-w-[1320px] mx-auto px-6 md:px-14 h-24 flex items-center gap-6">
          <Link href="/student/dashboard" className="p-3 text-[var(--ink-mid)] hover:text-[var(--punch)] hover:bg-[rgba(230,54,120,.1)] rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[.18em] text-[var(--marmalade)]">
              Complete, Organized, Real-world, Expertise
            </div>
            <h1 className="text-3xl font-paint text-[var(--ink)] leading-none mt-0.5">
              Guitarmalade <span className="text-[var(--punch)]">C.O.R.E.</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 md:px-14 py-12 space-y-8">
        
        {/* Level 1 */}
        <div className="relative rounded-[var(--r-xl)] bg-white/95 border-2 border-[var(--line)] shadow-[var(--shadow-pop)] p-8 overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <span className="text-9xl font-paint text-[var(--ink)]">1</span>
          </div>
          <div className="absolute -top-10 -right-10 opacity-20 pointer-events-none"><Splat.Burst color="var(--marmalade)" size={200} rotate={45} /></div>
          
          <h2 className="drip-text text-[40px] text-[var(--marmalade)] mb-6 relative z-10">Level 1</h2>
          <ul className="space-y-4 text-[var(--ink)] font-bold text-[15px] relative z-10 mb-8 list-disc pl-5">
            <li>Find Notes Up 12 Down 5</li>
            <li>Major Scale Along 1 string, in-position (1 Octave)</li>
            <li>Major Pentatonic (1 Octave)</li>
            <li>Root position triad, or Open Chord or Barre Chord</li>
          </ul>
          
          <div className="bg-[var(--cream)] border-2 border-[var(--cream-shadow)] p-6 rounded-2xl relative z-10">
            <h4 className="font-extrabold text-[var(--ink)] mb-2 flex items-center gap-2"><Music className="w-5 h-5 text-[var(--punch)]" /> Application</h4>
            <p className="text-[14px] text-[var(--ink-mid)] font-medium leading-relaxed">
              Play Song, ask: what is the Key, what is the tempo, meter, chord progression, are the chords diatonic? What is the arrangement? What is your favorite part of the song, what imagery does it solicit? If this song were in a movie trailer or movie scene what would the scene be?
            </p>
          </div>
        </div>

        {/* Level 2 */}
        <div className="relative rounded-[var(--r-xl)] bg-white/95 border-2 border-[var(--line)] shadow-[var(--shadow-pop)] p-8 overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <span className="text-9xl font-paint text-[var(--ink)]">2</span>
          </div>
          <div className="absolute -bottom-10 -left-10 opacity-20 pointer-events-none"><Splat.Drip color="var(--cyan)" size={180} rotate={-20} /></div>
          
          <h2 className="drip-text text-[40px] text-[var(--cyan)] mb-6 relative z-10">Level 2</h2>
          <ul className="space-y-4 text-[var(--ink)] font-bold text-[15px] relative z-10 mb-8 list-disc pl-5">
            <li>Find Notes Up 12 Down 5 (asc/desc)</li>
            <li>Major Scale along 1 string, (in-position 2 octaves)</li>
            <li>Major pentatonic (2 octaves)</li>
            <li>Major triad inversions across string-sets, or open chord or barre</li>
            <li>Find relative minor, play along 1 string</li>
          </ul>
          
          <div className="bg-[var(--cream)] border-2 border-[var(--cream-shadow)] p-6 rounded-2xl relative z-10">
            <h4 className="font-extrabold text-[var(--ink)] mb-2 flex items-center gap-2"><Music className="w-5 h-5 text-[var(--cyan)]" /> Application</h4>
            <p className="text-[14px] text-[var(--ink-mid)] font-medium leading-relaxed">
              Play Song, ask questions. Transpose progression to new key, apply open, barre or diad voicing.
            </p>
          </div>
        </div>

        {/* Level 3 */}
        <div className="relative rounded-[var(--r-xl)] bg-white/95 border-2 border-[var(--line)] shadow-[var(--shadow-pop)] p-8 overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <span className="text-9xl font-paint text-[var(--ink)]">3</span>
          </div>
          <div className="absolute top-20 right-10 opacity-20 pointer-events-none"><Splat.Star color="var(--punch)" size={150} rotate={15} /></div>
          
          <h2 className="drip-text text-[40px] text-[var(--punch)] mb-6 relative z-10">Level 3</h2>
          <ul className="space-y-4 text-[var(--ink)] font-bold text-[15px] relative z-10 mb-8 list-disc pl-5">
            <li>Find notes up 12 down 5, and octave shapes (asc/dsc)</li>
            <li>Major scale along 1 string, in-position and 3nps, string shift 1 octave</li>
            <li>Major pent 2 octaves and each pattern</li>
            <li>Major triad inversions across and along DBG, and string shift root pos</li>
            <li>Diatonic barre chords and triads - spell chord along 1 string</li>
            <li>Find relative minor: play along 1 string and in pos or 3nps</li>
            <li>Play minor pentatonic each pattern</li>
          </ul>
          
          <div className="bg-[var(--cream)] border-2 border-[var(--cream-shadow)] p-6 rounded-2xl relative z-10">
            <h4 className="font-extrabold text-[var(--ink)] mb-2 flex items-center gap-2"><Music className="w-5 h-5 text-[var(--punch)]" /> Application</h4>
            <p className="text-[14px] text-[var(--ink-mid)] font-medium leading-relaxed">
              Play Song, ask questions. Transpose progression to new key, apply open, barre or diad, embellished 7th chord voicing improvise melody.
            </p>
          </div>
        </div>

        {/* Level 4 */}
        <div className="relative rounded-[var(--r-xl)] bg-white/95 border-2 border-[var(--line)] shadow-[var(--shadow-pop)] p-8 overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <span className="text-9xl font-paint text-[var(--ink)]">4</span>
          </div>
          <div className="absolute top-5 right-40 opacity-20 pointer-events-none"><Splat.Specks color="var(--acid)" size={120} /></div>

          <h2 className="drip-text text-[40px] text-[var(--acid)] mb-6 relative z-10">Level 4</h2>
          <ul className="space-y-4 text-[var(--ink)] font-bold text-[15px] relative z-10 list-disc pl-5">
            <li>Major scale along 1 string, in-position or 3nps pedal tone and 3rds, string shift 1 octave pedal tone</li>
            <li>Major pent 2 octaves and each position, all modes</li>
            <li>Major triad inversions across and along DBG and/or GBE</li>
            <li>Diatonic 7th chords</li>
            <li>Major 7 arpeggio inversions</li>
            <li>Play minor pentatonic all patterns across, along</li>
            <li>Minor 7 arpeggio inversions</li>
            <li>Play diatonic minor key barre and triads</li>
          </ul>
        </div>

        {/* Level 5 */}
        <div className="relative rounded-[var(--r-xl)] bg-white/95 border-2 border-[var(--line)] shadow-[var(--shadow-pop)] p-8 overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <span className="text-9xl font-paint text-[var(--ink)]">5</span>
          </div>
          <div className="absolute -bottom-10 right-0 opacity-20 pointer-events-none"><Splat.Burst color="var(--grape)" size={220} rotate={180} /></div>

          <h2 className="drip-text text-[40px] text-[var(--grape)] mb-6 relative z-10">Level 5</h2>
          <ul className="space-y-4 text-[var(--ink)] font-bold text-[15px] relative z-10 list-disc pl-5">
            <li>Major scale along 1 string, in-position or 3nps pedal tone and 3rds</li>
            <li>Major pent 2 octaves and each position, all modes</li>
            <li>Major triad inversions across and along any string set</li>
            <li>Diatonic 7th chords, all diatonic arpeggio inversions</li>
            <li>Play minor pentatonic all patterns, across/along/diagonal</li>
            <li>Diatonic 7th chords</li>
          </ul>
        </div>

        {/* Mind Management & Bag o Tricks */}
        <div className="relative rounded-[var(--r-xl)] bg-[var(--ink)] text-[var(--cream-warm)] border-4 border-[var(--ink)] shadow-[var(--shadow-pop)] p-8 mt-12 overflow-hidden">
          <div className="absolute top-0 right-0 opacity-15 pointer-events-none"><Splat.Streak color="var(--marmalade)" size={500} rotate={-10} /></div>

          <h2 className="drip-text text-[40px] text-[var(--marmalade)] mb-8 relative z-10">Long Term Crafting</h2>
          
          <div className="space-y-8 relative z-10">
            <div>
              <h3 className="font-extrabold text-xl text-white mb-3 flex items-center gap-2"><Key className="w-5 h-5 text-[var(--cyan)]" /> Mind Management</h3>
              <p className="text-white/70 font-medium">Belief: I AM. "I am so thankful that I..." Cultivate belief through self hypnosis/mantras/subliminal audio. Level up your identity.</p>
            </div>

            <div>
              <h3 className="font-extrabold text-xl text-white mb-3 flex items-center gap-2"><Sliders className="w-5 h-5 text-[var(--punch)]" /> Bag O' Tricks</h3>
              <p className="text-white/70 font-medium mb-4">Choose from Guitarmalade Bag O'Tricks and catalogue BOTH rhythm and lead concepts for your OWN bag.</p>
              
              <div className="bg-white/10 p-5 rounded-2xl text-[14px] font-medium leading-relaxed">
                <p className="mb-3"><strong className="text-[var(--cyan)]">Rhythm:</strong> EJ spread voicings, triads with non chord tones, double stops, neo soul hammer-on/pull-offs, diads (10ths), slapping a la mayer/fujita</p>
                <p><strong className="text-[var(--punch)]">Lead:</strong> 2nps sliding arpeggios, sweep arpeggios w non chord tones, cascading pentaotnic licks, diminished over dom 7 vs altered over dom 7, abac melodic motif, rhythm displacement</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
