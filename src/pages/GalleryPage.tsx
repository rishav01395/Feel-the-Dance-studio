import { gallery } from '../data/mockData'
import { SectionHeading } from '../components/ui'

export function GalleryPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Gallery" title="Moments from class, rehearsal, and performance." description="A glimpse into the energy and artistry that fills the studio." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item) => (
          <figure key={item.id} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60">
            <img src={item.image} alt={item.title} className="h-80 w-full object-cover transition duration-500 hover:scale-105" />
            <figcaption className="p-4 text-sm text-slate-300">{item.title}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  )
}
