import { useEffect, useRef, useState } from 'react'
import { ArrowRight, CheckCircle2, Clock3, MapPin, MessageSquareText, Sparkles, Star, TrendingUp, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import danceHero from '../assets/dance-hero.jpg'
import { academyConfig, classes, faqs, gallery } from '../data/mockData'
import { SectionHeading, CTAButton, FeatureList, Card } from '../components/ui'

const registrationPopupSessionKey = 'feel-dance-registration-popup-seen'
const danceVideoUrl = '/videos/dance-background.webm'
const danceVideoSource = 'https://commons.wikimedia.org/wiki/File:Baganda_traditional_dance_01.webm'

export function HomePage() {
  const [registrationPopupOpen, setRegistrationPopupOpen] = useState(
    () => sessionStorage.getItem(registrationPopupSessionKey) !== 'true',
  )
  const [prefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const closePopupButton = useRef<HTMLButtonElement>(null)

  function dismissRegistrationPopup() {
    sessionStorage.setItem(registrationPopupSessionKey, 'true')
    setRegistrationPopupOpen(false)
  }

  useEffect(() => {
    if (!registrationPopupOpen) return

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismissRegistrationPopup()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    closePopupButton.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [registrationPopupOpen])

  return (
    <main>
      {registrationPopupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/30 p-4 backdrop-blur-[2px] sm:p-6" role="dialog" aria-modal="true" aria-labelledby="registration-popup-title">
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            poster={danceHero}
            aria-hidden="true"
          >
            <source src={danceVideoUrl} type="video/webm" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950/45 via-slate-950/25 to-fuchsia-950/30" />

          <section className="relative z-10 my-auto w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950/75 p-7 text-center shadow-2xl shadow-rose-950/40 backdrop-blur-xl sm:p-10">
            <button
              ref={closePopupButton}
              type="button"
              onClick={dismissRegistrationPopup}
              aria-label="Close registration popup"
              className="absolute right-4 top-4 rounded-full border border-white/15 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-rose-200">
              <Sparkles className="h-3.5 w-3.5" /> Feel the rhythm
            </span>
            <h2 id="registration-popup-title" className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">Your dance journey starts here</h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-200 sm:text-base">
              Join our welcoming studio, explore your favourite styles, and find the class that moves you.
            </p>
            <Link
              to="/admission"
              onClick={dismissRegistrationPopup}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition hover:scale-[1.02] hover:brightness-110"
            >
              Register Now <ArrowRight className="h-4 w-4" />
            </Link>
            <button type="button" onClick={dismissRegistrationPopup} className="mx-auto mt-4 block px-4 py-2 text-sm text-slate-300 transition hover:text-white">
              Maybe later
            </button>
            <p className="mt-4 text-[10px] text-slate-400">
              Video: <a href={danceVideoSource} target="_blank" rel="noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-slate-200">“Baganda traditional dance 01” by Kateregga1</a>
              {' · '}<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-slate-200">CC BY-SA 4.0</a>
            </p>
          </section>
        </div>
      )}

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(251,113,133,0.18),_transparent_35%),linear-gradient(135deg,#020617,#111827_45%,#0f172a)]">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-rose-200">
              <Sparkles className="h-3.5 w-3.5" />
              Premium dance culture
            </p>
            <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">{academyConfig.heroTitle}</h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">{academyConfig.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <CTAButton text="Explore Classes" href="/classes" />
              <Link to="/trial-class" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-rose-300 hover:text-rose-100">Book a Trial Class <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 text-sm text-slate-300">
              <div><span className="block text-2xl font-bold text-white">500+</span> students</div>
              <div><span className="block text-2xl font-bold text-white">12+</span> styles</div>
              <div><span className="block text-2xl font-bold text-white">4.9/5</span> experience</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-rose-500/25 via-fuchsia-500/10 to-transparent blur-2xl" />
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 p-3 shadow-2xl shadow-rose-500/10">
              <img
                src={danceHero}
                alt="Energetic dance performance with dancers in motion"
                className="h-[500px] w-full rounded-[1.4rem] object-cover"
              />
            </div>
            <div className="absolute -bottom-2 left-6 max-w-xs rounded-2xl border border-rose-400/20 bg-slate-900/90 p-4 shadow-xl backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">This month</p>
              <div className="mt-2 flex items-center gap-4">
                <TrendingUp className="h-10 w-10 rounded-xl bg-rose-500/10 p-2 text-rose-300" />
                <div>
                  <div className="text-2xl font-bold text-white">+28%</div>
                  <div className="text-sm text-slate-300">growth in enrolments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Why families choose us" title="A studio built for confidence, creativity, and community." description="From first steps to polished performances, we train expressive, disciplined, joyful dancers at every stage." />
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <div className="mb-4 rounded-xl bg-rose-500/10 p-3 text-rose-300"><Star className="h-5 w-5" /></div>
            <h3 className="text-xl font-semibold text-white">Expert Coaching</h3>
            <p className="mt-3 text-slate-300">Dedicated instructors who nurture technique, stage presence, and personal growth.</p>
          </Card>
          <Card>
            <div className="mb-4 rounded-xl bg-fuchsia-500/10 p-3 text-fuchsia-300"><Clock3 className="h-5 w-5" /></div>
            <h3 className="text-xl font-semibold text-white">Flexible Batches</h3>
            <p className="mt-3 text-slate-300">Morning, evening, and weekend sessions designed around real family routines.</p>
          </Card>
          <Card>
            <div className="mb-4 rounded-xl bg-amber-500/10 p-3 text-amber-300"><CheckCircle2 className="h-5 w-5" /></div>
            <h3 className="text-xl font-semibold text-white">Structured Progress</h3>
            <p className="mt-3 text-slate-300">Clear milestones, performance opportunities, and meaningful feedback in every term.</p>
          </Card>
        </div>
      </section>

      <section className="bg-slate-900/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Popular classes" title="Dance styles for every beat and ambition." description="Choose a class that matches your age, goals, and energy." />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {classes.map((classItem) => (
              <div key={classItem.id} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70">
                <div className={`h-32 bg-gradient-to-br ${classItem.accent}`} />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-white">{classItem.name}</h3>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{classItem.description}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-200">
                    <div>Timing: {classItem.timing}</div>
                  </div>
                  <Link to="/classes" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-rose-200">View class <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Our approach" title="Movement that feels empowering and personal." description="We blend technique, creativity, and confidence-building in every session." />
            <FeatureList items={['Beginner-friendly foundations and technique-focused coaching', 'Contemporary curriculum shaped for age, confidence, and growth', 'Performance opportunities and a supportive studio community']} />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {gallery.slice(0, 4).map((item) => (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50">
                <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                <div className="p-4 text-sm text-slate-300">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900/70">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Studio schedule" title="Weekly rhythm for learning and growth." />
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Monday</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Hip-Hop Crew</h3>
              <p className="mt-2 text-slate-300">6:30 PM · Ages 9–25</p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Wednesday</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Bollywood Groove</h3>
              <p className="mt-2 text-slate-300">5:30 PM · Ages 7–18</p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Saturday</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Contemporary Flow</h3>
              <p className="mt-2 text-slate-300">10:00 AM · Ages 12+</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="FAQs" title="Everything parents ask before they join." />
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <Card key={faq.question} className="p-6">
              <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
              <p className="mt-3 text-sm text-slate-300">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-900/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionHeading eyebrow="Location" title="Visit the studio." description="A warm, vibrant space for movement, rehearsal, and growth in Noida." />
            <div className="space-y-4 text-slate-300">
              <div className="flex gap-3"><MapPin className="mt-1 h-5 w-5 text-rose-300" /><span>{academyConfig.address}</span></div>
              <div className="flex gap-3"><MessageSquareText className="mt-1 h-5 w-5 text-rose-300" /><span>{academyConfig.phone}</span></div>
              <div className="flex gap-3"><Clock3 className="mt-1 h-5 w-5 text-rose-300" /><span>{academyConfig.hours}</span></div>
            </div>
            <div className="mt-6">
              <a href={academyConfig.mapLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-rose-300">View map <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80">
            <img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80" alt="Studio interior" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </main>
  )
}
