import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { admissionSchema } from '../lib/validation'
import { SectionHeading } from '../components/ui'

const classOptions = ['Bollywood Groove', 'Hip-Hop Crew', 'Contemporary Flow', 'Freestyle Fusion']

export function AdmissionPage() {
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle')
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      studentName: '',
      dob: '',
      parentName: '',
      parentPhone: '',
      email: '',
      requestedClass: '',
      preferredBatch: '',
      notes: '',
      privacyAccepted: false,
    },
  })

  const onSubmit = async (values: typeof admissionSchema._input) => {
    try {
      setSubmitState('idle')
      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, submittedAt: new Date().toISOString() }),
      })

      if (!response.ok) {
        throw new Error('Unable to save admission.')
      }

      reset()
      setSubmitState('success')
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Admission" title="Start your dance journey with a secure online application." description="Share your details and we’ll reach out with next steps and class recommendations." />

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            Student full name
            <input {...register('studentName')} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white" />
            {errors.studentName && <span className="mt-1 block text-xs text-rose-300">{errors.studentName.message}</span>}
          </label>

          <label className="text-sm text-slate-300">
            Date of birth
            <input type="date" {...register('dob')} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white" />
            {errors.dob && <span className="mt-1 block text-xs text-rose-300">{errors.dob.message}</span>}
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

          <label className="text-sm text-slate-300">
            Requested dance class
            <select {...register('requestedClass')} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white">
              <option value="">Select a class</option>
              {classOptions.map((className) => <option key={className} value={className}>{className}</option>)}
            </select>
            {errors.requestedClass && <span className="mt-1 block text-xs text-rose-300">{errors.requestedClass.message}</span>}
          </label>

          <label className="text-sm text-slate-300 md:col-span-2">
            Preferred batch or timing
            <input {...register('preferredBatch')} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white" placeholder="e.g. Beginner, Tue & Thu 5:30 PM" />
            {errors.preferredBatch && <span className="mt-1 block text-xs text-rose-300">{errors.preferredBatch.message}</span>}
          </label>

          <label className="text-sm text-slate-300 md:col-span-2">
            Relevant notes
            <textarea rows={4} {...register('notes')} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white" placeholder="Tell us about experience, goals, or any specific notes." />
            {errors.notes && <span className="mt-1 block text-xs text-rose-300">{errors.notes.message}</span>}
          </label>

          <label className="md:col-span-2 flex items-start gap-3 rounded-xl border border-white/10 bg-slate-950 p-3 text-sm text-slate-300">
            <input type="checkbox" {...register('privacyAccepted')} className="mt-1" />
            <span>I acknowledge and accept the privacy policy and data-processing notice.</span>
          </label>
          {errors.privacyAccepted && <span className="md:col-span-2 text-xs text-rose-300">{errors.privacyAccepted.message}</span>}
        </div>

        {submitState === 'success' && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
            <CheckCircle2 className="h-4 w-4" /> Your admission application was submitted successfully.
          </div>
        )}

        {submitState === 'error' && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
            <AlertCircle className="h-4 w-4" /> There was a problem submitting your application. Please try again.
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="mt-6 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Submitting...' : 'Submit application'}
        </button>
      </form>
    </main>
  )
}
