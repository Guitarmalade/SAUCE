'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Check, ChevronRight, Sparkles } from 'lucide-react'
import { EMAIL_REGEX, submitQuizResult } from '@/lib/quiz-webhook'

type Stage = 'diagnostic' | 'gate' | 'result'
type Archetype = 'Pattern Prisoner' | 'Modal Fog' | 'Box Locked' | 'Blank-Page Soloist'
type QKey = 'q1' | 'q2' | 'q3' | 'q4'

type DiagnosticSet = Record<QKey, string>
type Part2Answers = {
  q5: string
  q6: string
  q7: string[]
  q8: string
  q9: string
}

const ARCHETYPES: Archetype[] = ['Pattern Prisoner', 'Modal Fog', 'Box Locked', 'Blank-Page Soloist']
const ARCHETYPE_PRIORITY: Archetype[] = ['Pattern Prisoner', 'Box Locked', 'Modal Fog', 'Blank-Page Soloist']

const DIAGNOSTIC_QUESTIONS: Array<{
  key: QKey
  prompt: string
  options: Array<{ label: string; archetype: Archetype }>
}> = [
  {
    key: 'q1',
    prompt: 'When you go to solo, what actually happens?',
    options: [
      { label: 'I fall back on the same licks and shapes every time', archetype: 'Pattern Prisoner' },
      { label: 'I know the modes but freeze on which one to use', archetype: 'Modal Fog' },
      { label: "I'm stuck in one box and can't move around the neck", archetype: 'Box Locked' },
      { label: "I go blank and don't know where to start", archetype: 'Blank-Page Soloist' },
    ],
  },
  {
    key: 'q2',
    prompt: 'The gap between what you hear in your head and what comes out?',
    options: [
      { label: "I don't really hear ideas — my fingers just run patterns", archetype: 'Pattern Prisoner' },
      { label: 'I hear it but can’t connect it to the theory I know', archetype: 'Modal Fog' },
      { label: "I hear it but can't find it outside my one position", archetype: 'Box Locked' },
      { label: "I don't generate my own ideas at all", archetype: 'Blank-Page Soloist' },
    ],
  },
  {
    key: 'q3',
    prompt: 'Which best describes your fretboard right now?',
    options: [
      { label: 'A handful of memorized licks I repeat', archetype: 'Pattern Prisoner' },
      { label: 'I know scale names but the neck feels abstract', archetype: 'Modal Fog' },
      { label: 'One or two comfortable boxes, the rest is dark', archetype: 'Box Locked' },
      { label: "I can play what I'm shown but can't invent my own", archetype: 'Blank-Page Soloist' },
    ],
  },
  {
    key: 'q4',
    prompt: "What have you already tried that hasn't worked?",
    options: [
      { label: 'Learning more licks — it still sounds like licks', archetype: 'Pattern Prisoner' },
      { label: "Studying theory and modes — I still can't use them", archetype: 'Modal Fog' },
      { label: "Learning more scales — I'm still stuck in position", archetype: 'Box Locked' },
      { label: "Watching others improvise — I still can't do it myself", archetype: 'Blank-Page Soloist' },
    ],
  },
]

const RESULT_COPY: Record<
  Archetype,
  { title: string; description: string; cure: string }
> = {
  'Pattern Prisoner': {
    title: 'Pattern Prisoner',
    description: 'You have vocabulary, but it keeps coming out in the same routes. The result is repetition, not conversation.',
    cure: 'The fix is converting patterns into moveable fretboard language.',
  },
  'Modal Fog': {
    title: 'Modal Fog',
    description: 'You know the names, but they do not yet turn into usable sound on demand.',
    cure: 'The fix is linking theory to concrete neck locations and targets.',
  },
  'Box Locked': {
    title: 'Box Locked',
    description: 'You can play, but the fretboard still feels fenced in to a couple of safe zones.',
    cure: 'The fix is breaking position habits and learning to move with intent.',
  },
  'Blank-Page Soloist': {
    title: 'Blank-Page Soloist',
    description: 'You can execute ideas when given them, but generating your own starts from zero.',
    cure: 'The fix is a starting framework that makes invention easier than freezing.',
  },
}

const PART2_Q5_OPTIONS = [
  'starting/restarting',
  'basic chords & scales but stuck',
  "solid intermediate but solos don't sound how I want",
  'advanced, chasing mastery',
  'play professionally/semi-pro',
]

const PART2_Q6_OPTIONS = [
  '10–20 min a few times',
  '30 min 3–4x/week',
  '45–60 min most days',
  '1+ hour/day',
  "it varies but I'm committed",
]

const PART2_Q7_OPTIONS = ['Blues', 'Rock', 'Jazz/Fusion', 'Funk/R&B', 'Classic guitar heroes', 'A bit of everything']

const PART2_Q8_OPTIONS = [
  'Time',
  'Information overload',
  "Past programs didn't work",
  'Motivation/consistency',
  'Nothing — I\'m ready',
]

const PART2_Q9_OPTIONS = [
  'Yes — show me my best path',
  'Yes — and include advanced options',
  'Just browsing for now',
]

const DEV_DIAGNOSTIC_MAP: Record<Archetype, DiagnosticSet> = {
  'Pattern Prisoner': {
    q1: 'I fall back on the same licks and shapes every time',
    q2: "I don't really hear ideas — my fingers just run patterns",
    q3: 'A handful of memorized licks I repeat',
    q4: 'Learning more licks — it still sounds like licks',
  },
  'Modal Fog': {
    q1: 'I know the modes but freeze on which one to use',
    q2: 'I hear it but can’t connect it to the theory I know',
    q3: 'I know scale names but the neck feels abstract',
    q4: "Studying theory and modes — I still can't use them",
  },
  'Box Locked': {
    q1: "I'm stuck in one box and can't move around the neck",
    q2: "I hear it but can't find it outside my one position",
    q3: 'One or two comfortable boxes, the rest is dark',
    q4: "Learning more scales — I'm still stuck in position",
  },
  'Blank-Page Soloist': {
    q1: "I go blank and don't know where to start",
    q2: "I don't generate my own ideas at all",
    q3: "I can play what I'm shown but can't invent my own",
    q4: "Watching others improvise — I still can't do it myself",
  },
}

const SAUCE_NATION_URL = 'https://www.skool.com/guitarmalades-sauce-nation-2450/about'
const COOKBOOK_URL = 'https://guitarmalade.gumroad.com/l/kayac'
const COMMITMENT_Q6 = new Set(['45–60 min most days', '1+ hour/day'])
const YES_Q9 = new Set(['Yes — show me my best path', 'Yes — and include advanced options'])

function normalizeArchetypeParam(value: string | null): Archetype | null {
  if (!value) return null

  const normalized = value.toLowerCase()
  const map: Record<string, Archetype> = {
    'pattern-prisoner': 'Pattern Prisoner',
    'modal-fog': 'Modal Fog',
    'box-locked': 'Box Locked',
    'blank-page-soloist': 'Blank-Page Soloist',
  }

  return map[normalized] ?? null
}

function computeDiagnosticOutcome(answers: DiagnosticSet) {
  const scores = ARCHETYPES.reduce<Record<Archetype, number>>((acc, archetype) => {
    acc[archetype] = 0
    return acc
  }, {} as Record<Archetype, number>)

  const hasAllAnswers = DIAGNOSTIC_QUESTIONS.every((question) => answers[question.key])
  if (!hasAllAnswers) {
    return { archetype: null, scores }
  }

  const q1Winner = (ARCHETYPES.find((archetype) => answers.q1 === DEV_DIAGNOSTIC_MAP[archetype].q1) ?? null) as Archetype | null

  for (const question of DIAGNOSTIC_QUESTIONS) {
    const selectedOption = question.options.find((option) => option.label === answers[question.key])
    if (selectedOption) {
      scores[selectedOption.archetype] += 1
    }
  }

  const maxScore = Math.max(...ARCHETYPES.map((archetype) => scores[archetype]))
  const tied = ARCHETYPES.filter((archetype) => scores[archetype] === maxScore)

  let archetype: Archetype | null = null
  if (q1Winner && tied.includes(q1Winner)) {
    archetype = q1Winner
  } else {
    archetype = ARCHETYPE_PRIORITY.find((candidate) => tied.includes(candidate)) ?? tied[0] ?? null
  }

  return { archetype, scores }
}

function computeLeadScore(q6: string, q8: string, q9: string) {
  if (q9 === 'Just browsing for now') return 'Nurture'
  if (YES_Q9.has(q9) && (q8 === 'Nothing — I\'m ready' || COMMITMENT_Q6.has(q6))) return 'Hot'
  return 'Warm'
}

function SectionCard({
  eyebrow,
  title,
  copy,
  children,
}: {
  eyebrow?: string
  title: string
  copy?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[28px] border border-navy/10 bg-white/90 p-6 shadow-[0_24px_70px_rgba(26,35,64,0.12)] backdrop-blur md:p-8">
      {eyebrow ? <p className="label-eyebrow text-amber-700">{eyebrow}</p> : null}
      <div className="mt-2 space-y-3">
        <h2 className="text-3xl font-black tracking-tight text-navy md:text-4xl">{title}</h2>
        {copy ? <p className="max-w-3xl text-base leading-relaxed text-navy/72 md:text-lg">{copy}</p> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function OptionButton({
  selected,
  onClick,
  children,
  multi = false,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  multi?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-left font-semibold transition-all',
        selected
          ? 'border-amber-500 bg-amber-50 text-navy shadow-[0_8px_30px_rgba(245,158,11,0.18)]'
          : 'border-navy/10 bg-white text-navy/80 hover:border-amber-300 hover:bg-amber-50/50',
      ].join(' ')}
    >
      <span className="leading-relaxed">{children}</span>
      <span
        className={[
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs transition-colors',
          selected ? 'border-amber-600 bg-amber-500 text-white' : 'border-navy/20 text-transparent',
        ].join(' ')}
      >
        {multi ? <Check className="h-3.5 w-3.5" /> : '•'}
      </span>
    </button>
  )
}

export default function SauceDiagnosticQuiz() {
  const searchParams = useSearchParams()
  const devMode = process.env.NODE_ENV !== 'production'
  const testArchetype = devMode ? normalizeArchetypeParam(searchParams.get('archetype')) : null

  const initialAnswers: DiagnosticSet = testArchetype ? DEV_DIAGNOSTIC_MAP[testArchetype] : { q1: '', q2: '', q3: '', q4: '' }

  const [stage, setStage] = useState<Stage>(testArchetype ? 'gate' : 'diagnostic')
  const [questionIndex, setQuestionIndex] = useState(testArchetype ? 3 : 0)
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<DiagnosticSet>(initialAnswers)
  const [gateFirstName, setGateFirstName] = useState('')
  const [gateEmail, setGateEmail] = useState('')
  const [gateTouched, setGateTouched] = useState(false)
  const [submittedGate, setSubmittedGate] = useState(false)
  const [isGateSubmitting, setIsGateSubmitting] = useState(false)
  const [part2, setPart2] = useState<Part2Answers>({
    q5: '',
    q6: '',
    q7: [],
    q8: '',
    q9: '',
  })
  const [finalSubmitted, setFinalSubmitted] = useState(false)
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false)
  const [leadSubmitError, setLeadSubmitError] = useState('')

  const diagnosticOutcome = useMemo(() => computeDiagnosticOutcome(diagnosticAnswers), [diagnosticAnswers])
  const selectedArchetype = diagnosticOutcome.archetype

  const currentQuestion = DIAGNOSTIC_QUESTIONS[Math.min(questionIndex, DIAGNOSTIC_QUESTIONS.length - 1)]!
  const currentAnswer = diagnosticAnswers[currentQuestion.key]
  const gateEmailValid = EMAIL_REGEX.test(gateEmail.trim())
  const canAdvanceDiagnostic = Boolean(currentAnswer)
  const leadScore = computeLeadScore(part2.q6, part2.q8, part2.q9)
  const canSubmitFinal =
    Boolean(selectedArchetype) &&
    Boolean(part2.q5) &&
    Boolean(part2.q6) &&
    part2.q7.length > 0 &&
    Boolean(part2.q8) &&
    Boolean(part2.q9) &&
    !isFinalSubmitting &&
    !finalSubmitted

  const handleDiagnosticChoice = (key: QKey, choice: string) => {
    setDiagnosticAnswers((previous) => ({ ...previous, [key]: choice }))
  }

  const handleDiagnosticNext = () => {
    if (!canAdvanceDiagnostic) return
    if (questionIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setQuestionIndex((previous) => previous + 1)
      return
    }
    setStage('gate')
  }

  const handleGateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setGateTouched(true)
    if (!gateEmailValid || !selectedArchetype || isGateSubmitting) return

    setIsGateSubmitting(true)
    setLeadSubmitError('')

    try {
      await submitQuizResult({
        phase: 'gate',
        email: gateEmail.trim().toLowerCase(),
        firstName: gateFirstName.trim(),
        archetype: selectedArchetype,
        source: 'sauce_diagnostic_quiz',
        timestamp: new Date().toISOString(),
      })

      setSubmittedGate(true)
      setStage('result')
    } catch (error) {
      console.error('SauceDiagnostic gate lead failed:', error)
      setLeadSubmitError('Could not send the lead. Please try again.')
    } finally {
      setIsGateSubmitting(false)
    }
  }

  const toggleStyle = (style: string) => {
    setPart2((previous) => ({
      ...previous,
      q7: previous.q7.includes(style) ? previous.q7.filter((entry) => entry !== style) : [...previous.q7, style],
    }))
  }

  const handleFinalSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmitFinal || !selectedArchetype) return

    setIsFinalSubmitting(true)
    setLeadSubmitError('')

    try {
      await submitQuizResult({
        phase: 'final',
        email: gateEmail.trim().toLowerCase(),
        firstName: gateFirstName.trim(),
        archetype: selectedArchetype,
        experience: part2.q5,
        practiceTime: part2.q6,
        styles: part2.q7,
        blocker: part2.q8,
        readiness: part2.q9,
        leadScore,
        answers: {
          q1: diagnosticAnswers.q1,
          q2: diagnosticAnswers.q2,
          q3: diagnosticAnswers.q3,
          q4: diagnosticAnswers.q4,
        },
        source: 'sauce_diagnostic_quiz',
        timestamp: new Date().toISOString(),
      })

      setFinalSubmitted(true)
    } catch (error) {
      console.error('SauceDiagnostic final lead failed:', error)
      setLeadSubmitError('Could not send the lead. Please try again.')
    } finally {
      setIsFinalSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.10),_transparent_32%),linear-gradient(180deg,#fffdf8_0%,#fff9ef_100%)] px-4 py-8 text-navy md:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="rounded-[30px] border border-navy/10 bg-white/70 p-6 shadow-[0_20px_60px_rgba(26,35,64,0.08)] backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-amber-700">
                <Sparkles className="h-4 w-4" />
                SauceDiagnostic
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">
                Find the fretboard bottleneck that is actually blocking you.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-navy/72 md:text-lg">
                Four quick questions. Then get your personalized result and a clear path to break through - no more
                guessing what to practice.
              </p>
            </div>
          </div>
        </header>

        {stage === 'diagnostic' ? (
          <SectionCard
            eyebrow={`Question ${questionIndex + 1} of ${DIAGNOSTIC_QUESTIONS.length}`}
            title={currentQuestion.prompt}
            copy="Pick the answer that feels most like your current reality."
          >
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <OptionButton
                  key={option.label}
                  selected={currentAnswer === option.label}
                  onClick={() => handleDiagnosticChoice(currentQuestion.key, option.label)}
                >
                  {option.label}
                </OptionButton>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                disabled={!canAdvanceDiagnostic}
                onClick={handleDiagnosticNext}
                className="inline-flex items-center gap-2 rounded-2xl border-none bg-navy px-6 py-4 font-black text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {questionIndex === DIAGNOSTIC_QUESTIONS.length - 1 ? 'See my result' : 'Next question'}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </SectionCard>
        ) : null}

        {stage === 'gate' ? (
          <>
            <SectionCard
              eyebrow="Lead gate"
              title="Your Sauce Path is ready — where should we send it?"
              copy="Enter a valid email to unlock the result. First name is optional."
            >
              <form onSubmit={handleGateSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-navy/60">First name</span>
                  <input
                    value={gateFirstName}
                    onChange={(event) => setGateFirstName(event.target.value)}
                    className="w-full rounded-2xl border border-navy/10 bg-white px-4 py-4 font-semibold text-navy outline-none transition-colors focus:border-amber-400"
                    placeholder="Chris"
                    autoComplete="given-name"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-navy/60">Email</span>
                  <input
                    value={gateEmail}
                    onChange={(event) => setGateEmail(event.target.value)}
                    onBlur={() => setGateTouched(true)}
                    className="w-full rounded-2xl border border-navy/10 bg-white px-4 py-4 font-semibold text-navy outline-none transition-colors focus:border-amber-400"
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
                    type="email"
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={!gateEmailValid || submittedGate || isGateSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-none bg-amber-500 px-6 py-4 font-black text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGateSubmitting ? 'Sending...' : 'Unlock result'}
                  <ChevronRight className="h-5 w-5" />
                </button>
              </form>
              {gateTouched && gateEmail.trim() && !gateEmailValid ? (
                <p className="mt-3 text-sm font-semibold text-red-600">Enter a valid email address.</p>
              ) : null}
              {leadSubmitError ? <p className="mt-3 text-sm font-semibold text-red-600">{leadSubmitError}</p> : null}
            </SectionCard>
          </>
        ) : null}

        {stage === 'result' && selectedArchetype ? (
          <>
            <SectionCard
              eyebrow="Result"
              title={RESULT_COPY[selectedArchetype].title}
              copy={RESULT_COPY[selectedArchetype].description}
            >
              <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[24px] border border-navy/10 bg-amber-50 p-6">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-700">What it means</p>
                  <p className="mt-3 text-lg leading-relaxed text-navy">
                    {RESULT_COPY[selectedArchetype].cure}
                  </p>
                </div>

                <div className="rounded-[24px] border border-navy/10 bg-white p-6">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-navy/50">Next move</p>
                  <p className="mt-3 text-lg leading-relaxed text-navy/80">
                    Join Sauce Nation for the guided path, or open the Cookbook if you want the framework first.
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <a
                      href={SAUCE_NATION_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl bg-navy px-5 py-4 font-black text-white transition-transform hover:-translate-y-0.5"
                    >
                      Join Sauce Nation
                    </a>
                    <a
                      href={COOKBOOK_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl border border-navy/10 bg-white px-5 py-4 font-black text-navy transition-transform hover:-translate-y-0.5"
                    >
                      Open the Cookbook
                    </a>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="Qualification"
              title="A few questions so I can score the lead properly."
              copy="These do not change the archetype. They only help segment the follow-up."
            >
              <form onSubmit={handleFinalSubmit} className="space-y-8">
                <div className="space-y-6">
                  <QuestionBlock label="Q5. Where would you honestly place your playing right now?" required>
                    <div className="grid gap-3 md:grid-cols-2">
                      {PART2_Q5_OPTIONS.map((option) => (
                        <OptionButton
                          key={option}
                          selected={part2.q5 === option}
                          onClick={() => setPart2((previous) => ({ ...previous, q5: option }))}
                        >
                          {option}
                        </OptionButton>
                      ))}
                    </div>
                  </QuestionBlock>

                  <QuestionBlock label="Q6. How much can you realistically practice most weeks?" required>
                    <div className="grid gap-3 md:grid-cols-2">
                      {PART2_Q6_OPTIONS.map((option) => (
                        <OptionButton
                          key={option}
                          selected={part2.q6 === option}
                          onClick={() => setPart2((previous) => ({ ...previous, q6: option }))}
                        >
                          {option}
                        </OptionButton>
                      ))}
                    </div>
                  </QuestionBlock>

                  <QuestionBlock label="Q7. Which styles excite you most?" required hint="Select all that apply.">
                    <div className="grid gap-3 md:grid-cols-2">
                      {PART2_Q7_OPTIONS.map((option) => (
                        <OptionButton
                          key={option}
                          selected={part2.q7.includes(option)}
                          onClick={() => toggleStyle(option)}
                          multi
                        >
                          {option}
                        </OptionButton>
                      ))}
                    </div>
                  </QuestionBlock>

                  <QuestionBlock label="Q8. If you had a clear roadmap, what would stop you from committing?" required>
                    <div className="grid gap-3 md:grid-cols-2">
                      {PART2_Q8_OPTIONS.map((option) => (
                        <OptionButton
                          key={option}
                          selected={part2.q8 === option}
                          onClick={() => setPart2((previous) => ({ ...previous, q8: option }))}
                        >
                          {option}
                        </OptionButton>
                      ))}
                    </div>
                  </QuestionBlock>

                  <QuestionBlock label="Q9. Want a personalized recommendation from Guitarmalade?" required>
                    <div className="grid gap-3 md:grid-cols-2">
                      {PART2_Q9_OPTIONS.map((option) => (
                        <OptionButton
                          key={option}
                          selected={part2.q9 === option}
                          onClick={() => setPart2((previous) => ({ ...previous, q9: option }))}
                        >
                          {option}
                        </OptionButton>
                      ))}
                    </div>
                  </QuestionBlock>
                </div>

                <div className="rounded-[24px] border border-navy/10 bg-white p-6">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-navy/50">Lead score preview</p>
                  <p className="mt-3 text-2xl font-black text-navy">{leadScore}</p>
                  <p className="mt-2 text-sm leading-relaxed text-navy/65">
                    Hot = a yes plus commitment. Warm = open but not fully ready. Nurture = browsing.
                  </p>
                </div>

                {finalSubmitted ? (
                  <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
                    Lead sent.
                  </div>
                ) : null}
                {leadSubmitError ? (
                  <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-red-800">
                    {leadSubmitError}
                  </div>
                ) : null}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!canSubmitFinal}
                    className="inline-flex items-center gap-2 rounded-2xl border-none bg-navy px-6 py-4 font-black text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isFinalSubmitting ? 'Sending…' : 'Send final recommendation'}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </SectionCard>
          </>
        ) : null}
      </div>
    </main>
  )
}

function QuestionBlock({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-navy/70">
          {label} {required ? <span className="text-amber-700">*</span> : null}
        </p>
        {hint ? <p className="text-sm text-navy/55">{hint}</p> : null}
      </div>
      {children}
    </section>
  )
}
