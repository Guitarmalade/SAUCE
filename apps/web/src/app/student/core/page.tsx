import Link from 'next/link'
import { ArrowLeft, BookOpen, Key, Music, Sliders, Zap } from 'lucide-react'

export default function CoreCurriculumReference() {
  return (
    <div className="min-h-screen bg-offwhite p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/student/dashboard" className="p-2 hover:bg-navy/5 rounded-full transition-colors text-navy">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-paint text-navy">Guitarmalade C.O.R.E.</h1>
            <p className="text-navy/70 font-bold tracking-wide uppercase text-sm mt-1">Complete, Organized, Real-world, Expertise</p>
          </div>
        </div>

        {/* Levels List */}
        <div className="space-y-8">
          
          {/* Level 1 */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-9xl font-paint text-navy">1</span>
            </div>
            <h2 className="text-3xl font-paint text-amber mb-6 relative z-10">Level 1</h2>
            <ul className="space-y-4 text-navy/80 font-medium relative z-10 mb-8 list-disc pl-5">
              <li>Find Notes Up 12 Down 5</li>
              <li>Major Scale Along 1 string, in-position (1 Octave)</li>
              <li>Major Pentatonic (1 Octave)</li>
              <li>Root position triad, or Open Chord or Barre Chord</li>
            </ul>
            <div className="bg-navy/5 p-6 rounded-2xl relative z-10">
              <h4 className="font-bold text-navy mb-2 flex items-center gap-2"><Music className="w-4 h-4 text-amber" /> Application</h4>
              <p className="text-sm text-navy/70 leading-relaxed">
                Play Song, ask: what is the Key, what is the tempo, meter, chord progression, are the chords diatonic? What is the arrangement? What is your favorite part of the song, what imagery does it solicit? If this song were in a movie trailer or movie scene what would the scene be?
              </p>
            </div>
          </div>

          {/* Level 2 */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-9xl font-paint text-navy">2</span>
            </div>
            <h2 className="text-3xl font-paint text-amber mb-6 relative z-10">Level 2</h2>
            <ul className="space-y-4 text-navy/80 font-medium relative z-10 mb-8 list-disc pl-5">
              <li>Find Notes Up 12 Down 5 (asc/desc)</li>
              <li>Major Scale along 1 string, (in-position 2 octaves)</li>
              <li>Major pentatonic (2 octaves)</li>
              <li>Major triad inversions across string-sets, or open chord or barre</li>
              <li>Find relative minor, play along 1 string</li>
            </ul>
            <div className="bg-navy/5 p-6 rounded-2xl relative z-10">
              <h4 className="font-bold text-navy mb-2 flex items-center gap-2"><Music className="w-4 h-4 text-amber" /> Application</h4>
              <p className="text-sm text-navy/70 leading-relaxed">
                Play Song, ask questions. Transpose progression to new key, apply open, barre or diad voicing.
              </p>
            </div>
          </div>

          {/* Level 3 */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-9xl font-paint text-navy">3</span>
            </div>
            <h2 className="text-3xl font-paint text-amber mb-6 relative z-10">Level 3</h2>
            <ul className="space-y-4 text-navy/80 font-medium relative z-10 mb-8 list-disc pl-5">
              <li>Find notes up 12 down 5, and octave shapes (asc/dsc)</li>
              <li>Major scale along 1 string, in-position and 3nps, string shift 1 octave</li>
              <li>Major pent 2 octaves and each pattern</li>
              <li>Major triad inversions across and along DBG, and string shift root pos</li>
              <li>Diatonic barre chords and triads - spell chord along 1 string</li>
              <li>Find relative minor: play along 1 string and in pos or 3nps</li>
              <li>Play minor pentatonic each pattern</li>
            </ul>
            <div className="bg-navy/5 p-6 rounded-2xl relative z-10">
              <h4 className="font-bold text-navy mb-2 flex items-center gap-2"><Music className="w-4 h-4 text-amber" /> Application</h4>
              <p className="text-sm text-navy/70 leading-relaxed">
                Play Song, ask questions. Transpose progression to new key, apply open, barre or diad, embellished 7th chord voicing improvise melody.
              </p>
            </div>
          </div>

          {/* Level 4 */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-9xl font-paint text-navy">4</span>
            </div>
            <h2 className="text-3xl font-paint text-amber mb-6 relative z-10">Level 4</h2>
            <ul className="space-y-4 text-navy/80 font-medium relative z-10 mb-8 list-disc pl-5">
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
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-9xl font-paint text-navy">5</span>
            </div>
            <h2 className="text-3xl font-paint text-amber mb-6 relative z-10">Level 5</h2>
            <ul className="space-y-4 text-navy/80 font-medium relative z-10 mb-8 list-disc pl-5">
              <li>Major scale along 1 string, in-position or 3nps pedal tone and 3rds</li>
              <li>Major pent 2 octaves and each position, all modes</li>
              <li>Major triad inversions across and along any string set</li>
              <li>Diatonic 7th chords, all diatonic arpeggio inversions</li>
              <li>Play minor pentatonic all patterns, across/along/diagonal</li>
              <li>Diatonic 7th chords</li>
            </ul>
          </div>

          {/* Mind Management & Bag o Tricks */}
          <div className="bg-navy rounded-3xl p-8 text-white shadow-xl mt-12">
            <h2 className="text-3xl font-paint text-amber mb-6">Long Term Crafting</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-xl text-white/90 mb-3 flex items-center gap-2"><Key className="w-5 h-5 text-amber" /> Mind Management</h3>
                <p className="text-white/70">Belief: I AM. "I am so thankful that I..." Cultivate belief through self hypnosis/mantras/subliminal audio. Level up your identity.</p>
              </div>

              <div>
                <h3 className="font-bold text-xl text-white/90 mb-3 flex items-center gap-2"><Sliders className="w-5 h-5 text-amber" /> Bag O' Tricks</h3>
                <p className="text-white/70 mb-4">Choose from Guitarmalade Bag O'Tricks and catalogue BOTH rhythm and lead concepts for your OWN bag.</p>
                <div className="bg-white/10 p-4 rounded-xl text-sm">
                  <p className="mb-2"><strong className="text-amber">Rhythm:</strong> EJ spread voicings, triads with non chord tones, double stops, neo soul hammer-on/pull-offs, diads (10ths), slapping a la mayer/fujita</p>
                  <p><strong className="text-amber">Lead:</strong> 2nps sliding arpeggios, sweep arpeggios w non chord tones, cascading pentaotnic licks, diminished over dom 7 vs altered over dom 7, abac melodic motif, rhythm displacement</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
