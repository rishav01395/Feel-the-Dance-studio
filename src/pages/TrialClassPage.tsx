import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { SectionHeading } from '../components/ui'
import { trialClassSchema } from '../lib/validation'

const classOptions = ['Bollywood Groove', 'Hip-Hop Crew', 'Contemporary Flow', 'Freestyle Fusion']

export function TrialClassPage() {
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle')
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(trialClassSchema),
    defaultValues: {
      studentName: '',
      parentName: '',
      parentPhone: '',
      email: '',
      requestedClass: '',
      preferredBatch: '',
      notes: '',
    },
  })

  const onSubmit = async (values: typeof trialClassSchema._input) => {
    try {
      const response = await fetch('/api/trials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, requestedAt: new Date().toISOString() }),
      })

      if (!response.ok) throw new Error('Failed to save trial request')
      reset()
      setSubmitState('success')
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Trial class" title="Book a free trial and feel the energy for yourself." description="Tell us a little about your child or your interest, and we’ll help you find the right class." />
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            Student name
            <input {...register('studentName')} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white" />
            {errors.studentName && <span className="mt-1 block text-xs text-rose-300">{errors.studentName.message}</span>}
          </label>

          <label className="text-sm text-slate-300">
            Parent/guardian name
            <input {...register('parentName')} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white" />
            {errors.parentName && <span className="mt-1 block text-xs text-rose-300">{errors.parentName.message}</span>}
          </label>

          <label className="text-sm text-slate-300">
            Parent phone number
            <input {...register('parentPhone')} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white" />
            {errors.parentPhone && <span className="mt-1 block text-xs text-rose-300">{errors.parentPhone.message}</span>}
          </label>

          <label className="text-sm text-slate-300">
            Email (optional)
            <input type="email" {...register('email')} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white" />
            {errors.email && <span className="mt-1 block text-xs text-rose-300">{errors.email.message}</span>}
          </label>

          <label className="text-sm text-slate-300 md:col-span-2">
            Requested class
            <select {...register('requestedClass')} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white">
              <option value="">Choose a class</option>
              {classOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            {errors.requestedClass && <span className="mt-1 block text-xs text-rose-300">{errors.requestedClass.message}</span>}
          </label>

          <label className="text-sm text-slate-300 md:col-span-2">
            Preferred batch or timing
            <input {...register('preferredBatch')} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white" placeholder="e.g. Weekend Batch, Sat 10:00 AM" />
            {errors.preferredBatch && <span className="mt-1 block text-xs text-rose-300">{errors.preferredBatch.message}</span>}
          </label>

          <label className="text-sm text-slate-300 md:col-span-2">
            Notes
            <textarea rows={4} {...register('notes')} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white" placeholder="Any styling, experience, or questions?" />
            {errors.notes && <span className="mt-1 block text-xs text-rose-300">{errors.notes.message}</span>}
          </label>
        </div>

        {submitState === 'success' && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
            <CheckCircle2 className="h-4 w-4" /> Your trial request was submitted successfully.
          </div>
        )}

        {submitState === 'error' && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
            <AlertCircle className="h-4 w-4" /> There was a problem with your request. Please try again.
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="mt-6 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Booking...' : 'Book trial class'}
        </button>
      </form>
    </main>
  )
}
