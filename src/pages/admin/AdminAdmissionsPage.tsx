import { admissions } from '../../data/mockData'

export function AdminAdmissionsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-white">Admissions</h1>
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="bg-slate-950/80 text-xs uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Parent</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((item) => (
                <tr key={item.id} className="border-t border-white/5">
                  <td className="px-4 py-3 text-white">{item.studentName}</td>
                  <td className="px-4 py-3">{item.parentName}</td>
                  <td className="px-4 py-3">{item.requestedClass}</td>
                  <td className="px-4 py-3"><span className="rounded-full border border-rose-400/20 bg-rose-500/10 px-2 py-1 text-xs text-rose-200">{item.status}</span></td>
                  <td className="px-4 py-3">{item.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
