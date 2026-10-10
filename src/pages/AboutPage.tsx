import { HeartHandshake, Music4, Users } from 'lucide-react'
import { SectionHeading } from '../components/ui'

export function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="About us" title="A joyful space where movement becomes confidence." description="Feel The Dance Studio celebrates discipline, creativity, and self-belief through every class and performance." />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <Music4 className="h-10 w-10 text-rose-300" />
          <h3 className="mt-4 text-xl font-semibold text-white">Our mission</h3>
          <p className="mt-3 text-slate-300">To help students discover confidence, expression, and joy through structured, imaginative dance training.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <Users className="h-10 w-10 text-rose-300" />
          <h3 className="mt-4 text-xl font-semibold text-white">Our community</h3>
          <p className="mt-3 text-slate-300">We build a welcoming and uplifting studio culture where learners feel safe to explore movement and creativity.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <HeartHandshake className="h-10 w-10 text-rose-300" />
          <h3 className="mt-4 text-xl font-semibold text-white">Our values</h3>
          <p className="mt-3 text-slate-300">Respect, discipline, encouragement, and performance excellence shape every session and workshop.</p>
        </div>
      </div>
    </main>
  )
}
