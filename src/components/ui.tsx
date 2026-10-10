import type { ReactNode } from 'react'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import clsx from 'clsx'

export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">{eyebrow}</p>}
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base text-slate-300">{description}</p>}
    </div>
  )
}

export function Button({ children, className, variant = 'primary', ...props }: { children: ReactNode; className?: string; variant?: 'primary' | 'secondary' | 'ghost'; } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
        variant === 'primary' && 'bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white shadow-lg shadow-rose-500/20 hover:brightness-110',
        variant === 'secondary' && 'border border-white/10 bg-white/5 text-white hover:border-rose-400 hover:text-rose-100',
        variant === 'ghost' && 'bg-transparent text-slate-200 hover:bg-white/5',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30', className)}>{children}</div>
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
      {hint && <p className="mt-2 text-sm text-slate-300">{hint}</p>}
    </Card>
  )
}

export function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-slate-200">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-4 w-4 text-rose-300" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function CTAButton({ text, href }: { text: string; href: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:brightness-110">
      {text}
      <ArrowRight className="h-4 w-4" />
    </a>
  )
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/60 p-10 text-center text-slate-300">
      <Sparkles className="mx-auto mb-3 h-8 w-8 text-rose-300" />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  )
}
