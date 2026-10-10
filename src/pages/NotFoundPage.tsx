import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">404</p>
        <h1 className="mt-4 text-4xl font-bold text-white">Page not found</h1>
        <p className="mt-4 text-slate-300">The page you are looking for could not be found.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white">Return home</Link>
      </div>
    </main>
  )
}
