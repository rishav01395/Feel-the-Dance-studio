import { Clock3, Mail, MapPin, MessageCircleMore, Phone } from 'lucide-react'
import { academyConfig } from '../data/mockData'
import { SectionHeading } from '../components/ui'

export function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Contact" title="Reach out and connect with the studio." description="We’re here to help with admissions, class enquiries, and trial bookings." />
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <div className="flex items-start gap-3"><Phone className="mt-1 h-5 w-5 text-rose-300" /><div><p className="font-medium text-white">Phone</p><a href={`tel:${academyConfig.phone}`} className="text-slate-300">{academyConfig.phone}</a></div></div>
          <div className="flex items-start gap-3"><MessageCircleMore className="mt-1 h-5 w-5 text-rose-300" /><div><p className="font-medium text-white">WhatsApp</p><a href={`https://wa.me/${academyConfig.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-slate-300">Chat on WhatsApp</a></div></div>
          <div className="flex items-start gap-3"><Mail className="mt-1 h-5 w-5 text-rose-300" /><div><p className="font-medium text-white">Email</p><a href={`mailto:${academyConfig.email}`} className="text-slate-300">{academyConfig.email}</a></div></div>
          <div className="flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 text-rose-300" /><div><p className="font-medium text-white">Address</p><p className="text-slate-300">{academyConfig.address}</p></div></div>
          <div className="flex items-start gap-3"><Clock3 className="mt-1 h-5 w-5 text-rose-300" /><div><p className="font-medium text-white">Opening hours</p><p className="text-slate-300">{academyConfig.hours}</p></div></div>
        </div>

        <form className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm text-slate-300">
              Name
              <input type="text" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" placeholder="Your name" />
            </label>
            <label className="text-sm text-slate-300">
              Email
              <input type="email" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" placeholder="you@example.com" />
            </label>
            <label className="sm:col-span-2 text-sm text-slate-300">
              Subject
              <input type="text" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" placeholder="Class enquiry" />
            </label>
            <label className="sm:col-span-2 text-sm text-slate-300">
              Message
              <textarea rows={5} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" placeholder="Tell us about your interest or questions." />
            </label>
          </div>
          <button type="submit" className="mt-5 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white">Send enquiry</button>
        </form>
      </div>
    </main>
  )
}
