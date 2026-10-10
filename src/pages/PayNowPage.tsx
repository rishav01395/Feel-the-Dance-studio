import { useState } from 'react'
import { ArrowUpRight, CheckCircle2, CircleDollarSign, MessageCircle, QrCode } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  getStudioPaymentSettings,
  whatsappNumber,
  type StudioPaymentSettings,
} from '../lib/ownerStore'
import { SectionHeading } from '../components/ui'

function buildUpiLink(settings: StudioPaymentSettings, amount: string, studentName: string) {
  const parameters = new URLSearchParams({
    pa: settings.upiId,
    pn: settings.payeeName,
    cu: 'INR',
  })
  if (amount && Number(amount) > 0) parameters.set('am', Number(amount).toFixed(2))
  if (studentName.trim()) parameters.set('tn', `Dance fee - ${studentName.trim()}`)
  return `upi://pay?${parameters.toString()}`
}

export function PayNowPage() {
  const [settings] = useState(() => getStudioPaymentSettings())
  const [studentName, setStudentName] = useState('')
  const [amount, setAmount] = useState('')
  const [copied, setCopied] = useState(false)
  const hasQrOrUpi = Boolean(settings.qrImageDataUrl || settings.upiId)
  const phone = whatsappNumber(settings.whatsappPhone)
  const whatsappHref = phone.length >= 11
    ? `https://wa.me/${phone}?text=${encodeURIComponent(`Namaste, main ${studentName.trim() || '[student name]'} ke liye ${amount ? `₹${amount} ` : ''}dance fee pay kar raha/rahi hoon. Kripya payment verify karke receipt share karein.`)}`
    : ''

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(settings.upiId)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <SectionHeading
        eyebrow="Secure UPI payment"
        title="Pay your dance class fee"
        description="Scan the studio QR with any UPI app, or open your preferred UPI app directly. After paying, message the studio to request payment confirmation and your receipt."
      />

      {!hasQrOrUpi ? (
        <section className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-6 text-amber-100 sm:p-8">
          <QrCode className="mb-4 h-8 w-8 text-amber-200" />
          <h2 className="text-xl font-semibold">Payment setup is not ready yet</h2>
          <p className="mt-2 text-sm leading-6 text-amber-100/80">The studio owner needs to add a UPI ID or upload a UPI QR code in Owner Login → Payment setup.</p>
          <Link to="/admin/payment-settings" className="mt-5 inline-flex rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white">Owner: set up payment details</Link>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-center sm:p-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-200"><QrCode className="h-6 w-6" /></div>
            <h2 className="text-xl font-semibold text-white">Scan & pay</h2>
            <p className="mt-2 text-sm text-slate-400">Use any UPI app to scan this studio QR code.</p>
            {settings.qrImageDataUrl
              ? <img src={settings.qrImageDataUrl} alt="Feel The Dance Studio UPI payment QR code" className="mx-auto mt-6 aspect-square w-full max-w-[300px] rounded-2xl bg-white p-3 object-contain" />
              : <div className="mx-auto mt-6 flex aspect-square w-full max-w-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-slate-950/50 p-6 text-slate-400"><QrCode className="mb-3 h-10 w-10" /><span className="text-sm">Owner QR code has not been uploaded.</span></div>}
            {settings.upiId && <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Studio UPI ID</p>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                <span className="break-all text-sm font-semibold text-white">{settings.upiId}</span>
                <button type="button" onClick={copyUpiId} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200 hover:bg-white/5">{copied ? 'Copied' : 'Copy'}</button>
              </div>
            </div>}
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <CircleDollarSign className="h-6 w-6 text-emerald-300" />
              <div><h2 className="text-xl font-semibold text-white">Pay using UPI app</h2><p className="text-sm text-slate-400">Details are pre-filled; verify them in your UPI app.</p></div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm text-slate-300">Student name<input value={studentName} onChange={(event) => setStudentName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-rose-400" placeholder="Enter student name" /></label>
              <label className="block text-sm text-slate-300">Amount (₹)<input type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-rose-400" placeholder="Enter fee amount" /></label>
              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm">
                <p className="text-slate-400">Pay to</p><p className="mt-1 font-medium text-white">{settings.payeeName}</p>
                {settings.upiId && <p className="mt-1 break-all text-slate-300">{settings.upiId}</p>}
              </div>
              {settings.upiId
                ? <a href={buildUpiLink(settings, amount, studentName)} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white hover:brightness-110"><ArrowUpRight className="h-4 w-4" /> Pay Now with UPI</a>
                : <p className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-amber-100">UPI app payment link ke liye owner ko UPI ID bhi add karni hogi; QR se scan karke payment kar sakte hain.</p>}
              {whatsappHref
                ? <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500/30 px-5 py-3 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/10"><MessageCircle className="h-4 w-4" /> WhatsApp payment confirmation</a>
                : <p className="rounded-xl border border-white/10 bg-slate-950/50 p-3 text-xs text-slate-400">Admin WhatsApp number owner ke Payment setup se configure hoga.</p>}
              <p className="flex items-start gap-2 text-xs leading-5 text-slate-400"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" /> Payment UPI app mein complete hone ke baad studio ko confirmation bhejein. Website payment ko automatically verify ya fee ledger update nahi karti.</p>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
