import { ArrowRight, CalendarClock } from 'lucide-react'
import { classes } from '../data/mockData'
import { SectionHeading } from '../components/ui'

export function ClassesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Classes" title="Find the rhythm that fits your energy." description="Each class blends technique, expression, and community in a supportive environment." />
      <div className="grid gap-6 md:grid-cols-2">
        {classes.map((classItem) => (
          <article key={classItem.id} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
            <div className={`h-28 bg-gradient-to-br ${classItem.accent}`} />
            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-semibold text-white">{classItem.name}</h3>
              </div>
              <p className="mt-4 text-slate-300">{classItem.description}</p>
              <div className="mt-5 space-y-2 text-sm text-slate-200">
                <div className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-rose-300" /> {classItem.timing}</div>
              </div>
              <button type="button" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white">
                Enquire now <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
