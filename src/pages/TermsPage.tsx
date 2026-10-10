import { SectionHeading } from '../components/ui'

export function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Terms" title="Studio terms and conditions." description="These terms should be reviewed and adapted to the actual studio policies before a live deployment." />
      <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-slate-300">
        <p>Students and parents agree to follow the studio’s dress code, punctuality expectations, and class behaviour policies.</p>
        <p>Fees are due as communicated by the studio and missed or late payments may affect class access until resolved.</p>
        <p>Photos and video capture may be used for internal studio promotion and social media only where consent has been appropriately provided.</p>
        <p>Final terms may vary by programme, and the studio reserves the right to modify schedules or class allocations when necessary.</p>
      </div>
    </main>
  )
}
