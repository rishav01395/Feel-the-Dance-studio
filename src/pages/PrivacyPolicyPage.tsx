import { SectionHeading } from '../components/ui'

export function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Privacy policy" title="Your information is handled with care." description="This page is a placeholder for the studio’s formal privacy notice and should be tailored to your actual data handling practices." />
      <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-slate-300">
        <p>We collect only the information needed to process school admissions, class enrolment, and studio communications.</p>
        <p>We use this information to manage registrations, contact guardians, schedule classes, and provide relevant operational updates.</p>
        <p>We will not share private student or payment information with unrelated third parties and will store sensitive data securely with access limited to authorized staff.</p>
        <p>Parents may request updates, corrections, or deletion requests in line with applicable privacy requirements and the studio’s operational policies.</p>
      </div>
    </main>
  )
}
