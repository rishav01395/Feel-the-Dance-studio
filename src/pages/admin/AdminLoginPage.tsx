import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LockKeyhole, ShieldCheck } from 'lucide-react'
import {
  getOwnerCredentials,
  hashPassword,
  isOwnerSessionActive,
  setOwnerCredentials,
  startOwnerSession,
} from '../../lib/ownerStore'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [isSetup] = useState(() => !getOwnerCredentials())
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isOwnerSessionActive()) return <Navigate to="/admin" replace />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const normalizedEmail = email.trim().toLowerCase()
      if (!normalizedEmail || password.length < 8) {
        setError('Email daalein aur password kam se kam 8 characters ka rakhein.')
        return
      }

      if (isSetup) {
        const salt = crypto.randomUUID()
        const passwordHash = await hashPassword(password, salt)
        setOwnerCredentials({ email: normalizedEmail, salt, passwordHash })
      } else {
        const credentials = getOwnerCredentials()
        if (!credentials || normalizedEmail !== credentials.email || await hashPassword(password, credentials.salt) !== credentials.passwordHash) {
          setError('Email ya password sahi nahi hai.')
          return
        }
      }

      startOwnerSession()
      navigate('/admin', { replace: true })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Login nahi ho saka. Dobara try karein.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.18),_transparent_25%),#020617] px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl">
        <Link to="/" className="mb-7 inline-block text-sm text-slate-400 hover:text-white">← Studio website</Link>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-fuchsia-500"><ShieldCheck className="h-5 w-5" /></div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-rose-300">{isSetup ? 'Owner setup' : 'Owner access'}</p>
            <h1 className="text-2xl font-semibold text-white">{isSetup ? 'Create owner account' : 'Owner login'}</h1>
          </div>
        </div>

        <p className="mb-6 text-sm text-slate-300">
          {isSetup
            ? 'Is browser mein pehli baar setup ke liye owner email aur password banayein.'
            : 'Students, monthly fees, payments aur receipts manage karne ke liye sign in karein.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm text-slate-300">
            Owner email
            <input type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-rose-400" placeholder="owner@example.com" />
          </label>
          <label className="block text-sm text-slate-300">
            Password
            <input type="password" required minLength={8} autoComplete={isSetup ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-rose-400" placeholder="At least 8 characters" />
          </label>
          {error && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
          <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
            <LockKeyhole className="h-4 w-4" /> {busy ? 'Please wait…' : isSetup ? 'Create account and continue' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-5 text-amber-100/80">
          Local demo mode: account and records are stored only in this browser. This is not production-grade authentication or cloud backup. Real owner access needs Supabase Auth and database security.
        </p>
      </div>
    </main>
  )
}
