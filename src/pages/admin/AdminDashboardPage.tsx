import { useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Check, CircleDollarSign, GraduationCap, LogOut, Pencil, Plus, Printer, Search, Settings, Trash2, Upload, Users, X } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../../components/ui'
import {
  createReceiptNumber,
  currentMonthKey,
  endOwnerSession,
  getStudioPaymentSettings,
  getPaidAmount,
  getPayments,
  getStudents,
  openReceipt,
  savePayments,
  saveStudioPaymentSettings,
  saveStudents,
  whatsappNumber,
  type PaymentRecord,
  type StudioPaymentSettings,
  type StudentRecord,
} from '../../lib/ownerStore'

type View = 'overview' | 'students' | 'fees' | 'settings'
type StudentForm = Omit<StudentRecord, 'id' | 'createdAt'>

const blankStudent: StudentForm = {
  name: '',
  guardian: '',
  phone: '',
  className: '',
  batch: '',
  monthlyFee: 0,
  dueDay: 28,
}

const inputClass = 'mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-rose-400'
const labelClass = 'block text-sm text-slate-300'
const chartColors = ['#fb7185', '#a78bfa']
const monthLabel = (month: string) => {
  const [year, monthNumber] = month.split('-').map(Number)
  return new Date(year, monthNumber - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

function formatRupees(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function AdminDashboardPage({ initialView = 'overview' }: { initialView?: View }) {
  const navigate = useNavigate()
  const [view, setView] = useState<View>(initialView)
  const [students, setStudents] = useState<StudentRecord[]>(() => getStudents())
  const [payments, setPayments] = useState<PaymentRecord[]>(() => getPayments())
  const [studentForm, setStudentForm] = useState<StudentForm>(blankStudent)
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null)
  const [editingStudentForm, setEditingStudentForm] = useState<StudentForm>(blankStudent)
  const [paymentSettings, setPaymentSettings] = useState<StudioPaymentSettings>(() => getStudioPaymentSettings())
  const [paymentQrFile, setPaymentQrFile] = useState<File | null>(null)
  const [paymentStudentId, setPaymentStudentId] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentRecord['method']>('UPI')
  const [month, setMonth] = useState(currentMonthKey)
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const feeRows = useMemo(() => students.map((student) => {
    const paid = getPaidAmount(student.id, month, payments)
    return { student, paid, due: Math.max(0, student.monthlyFee - paid) }
  }), [month, payments, students])
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.guardian} ${student.phone} ${student.className}`.toLowerCase().includes(search.toLowerCase()),
  )
  const collection = feeRows.reduce((total, row) => total + row.paid, 0)
  const outstanding = feeRows.reduce((total, row) => total + row.due, 0)
  const feeChartData = useMemo(() => {
    const [year, monthNumber] = month.split('-').map(Number)
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(year, monthNumber - 1 - (5 - index), 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const expected = students.reduce((total, student) => total + student.monthlyFee, 0)
      const received = payments
        .filter((payment) => payment.month === monthKey)
        .reduce((total, payment) => total + payment.amount, 0)
      return {
        month: date.toLocaleDateString('en-IN', { month: 'short' }),
        received,
        pending: Math.max(0, expected - received),
      }
    })
  }, [month, payments, students])
  const hasChartAmounts = feeChartData.some((entry) => entry.received > 0 || entry.pending > 0)
  const collectionBreakdown = [
    { name: 'Received', value: collection },
    { name: 'Pending', value: outstanding },
  ]
  const pieHasData = collection + outstanding > 0
  const pieChartData = pieHasData
    ? collectionBreakdown
    : [{ name: 'No fee data', value: 1 }]

  const persistStudents = (updated: StudentRecord[]) => {
    saveStudents(updated)
    setStudents(updated)
  }
  const persistPayments = (updated: PaymentRecord[]) => {
    savePayments(updated)
    setPayments(updated)
  }

  const addStudent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setNotice('')
    try {
      const phoneDigits = studentForm.phone.replace(/\D/g, '')
      if (phoneDigits.length < 10) throw new Error('Parent/guardian ka valid phone number daalein.')
      if (studentForm.monthlyFee <= 0) throw new Error('Monthly fee zero se zyada honi chahiye.')
      const newStudent: StudentRecord = {
        ...studentForm,
        id: `STD-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      persistStudents([...students, newStudent])
      setStudentForm(blankStudent)
      setNotice(`${newStudent.name} register ho gaya.`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Student save nahi ho saka.')
    }
  }

  const beginStudentEdit = (student: StudentRecord) => {
    setEditingStudentId(student.id)
    setEditingStudentForm({
      name: student.name,
      guardian: student.guardian,
      phone: student.phone,
      className: student.className,
      batch: student.batch,
      monthlyFee: student.monthlyFee,
      dueDay: student.dueDay,
    })
    setError('')
    setNotice('')
  }

  const saveStudentEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    try {
      if (editingStudentForm.phone.replace(/\D/g, '').length < 10) throw new Error('Parent/guardian ka valid phone number daalein.')
      if (editingStudentForm.monthlyFee <= 0) throw new Error('Monthly fee zero se zyada honi chahiye.')
      const original = students.find((student) => student.id === editingStudentId)
      if (!original) throw new Error('Student record nahi mila. Page refresh karke dobara try karein.')
      persistStudents(students.map((student) => student.id === editingStudentId
        ? { ...student, ...editingStudentForm }
        : student))
      setEditingStudentId(null)
      setNotice(`${editingStudentForm.name} ka record update ho gaya.`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Student update nahi ho saka.')
    }
  }

  const deleteStudent = (student: StudentRecord) => {
    if (!window.confirm(`${student.name} aur unke payment/receipt records delete karne hain? Yeh action undo nahi hoga.`)) return
    try {
      persistStudents(students.filter((item) => item.id !== student.id))
      persistPayments(payments.filter((payment) => payment.studentId !== student.id))
      if (editingStudentId === student.id) setEditingStudentId(null)
      setNotice(`${student.name} aur unke associated payment records delete ho gaye.`)
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Student delete nahi ho saka.')
    }
  }

  const savePaymentSetup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setNotice('')
    try {
      const phoneDigits = paymentSettings.whatsappPhone.replace(/\D/g, '')
      if (paymentSettings.whatsappPhone && phoneDigits.length < 10) {
        throw new Error('Admin WhatsApp number valid nahi lag raha; country code ke saath number daalein.')
      }
      const persist = (qrImageDataUrl: string) => {
        const updatedSettings = { ...paymentSettings, qrImageDataUrl }
        saveStudioPaymentSettings(updatedSettings)
        setPaymentSettings(updatedSettings)
        setPaymentQrFile(null)
        setNotice('Payment setup save ho gaya. Public Pay Now page par updated details isi browser mein dikhengi.')
      }

      if (!paymentQrFile) {
        persist(paymentSettings.qrImageDataUrl)
        return
      }
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(paymentQrFile.type)) {
        throw new Error('QR image PNG, JPG ya WebP format mein honi chahiye.')
      }
      if (paymentQrFile.size > 1_000_000) {
        throw new Error('QR image 1 MB se chhoti rakhein.')
      }
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          setError('QR image read nahi ho saki. Dusri image try karein.')
          return
        }
        try {
          persist(reader.result)
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : 'Payment setup save nahi ho saka.')
        }
      }
      reader.onerror = () => setError('QR image read nahi ho saki. Dusri image try karein.')
      reader.readAsDataURL(paymentQrFile)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Payment setup save nahi ho saka.')
    }
  }

  const recordPayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setNotice('')
    try {
      const student = students.find((item) => item.id === paymentStudentId)
      const amount = Number(paymentAmount)
      if (!student) throw new Error('Student select karein.')
      if (!Number.isFinite(amount) || amount <= 0) throw new Error('Payment amount sahi daalein.')
      const payment: PaymentRecord = {
        id: crypto.randomUUID(),
        studentId: student.id,
        month,
        amount,
        date: new Date().toISOString().slice(0, 10),
        method: paymentMethod,
        receiptNo: createReceiptNumber(),
      }
      persistPayments([...payments, payment])
      setPaymentAmount('')
      setNotice(`Payment save ho gaya. Receipt ${payment.receiptNo} ready hai.`)
      openReceipt(student, payment)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Payment record nahi ho saka.')
    }
  }

  const sendReminder = (student: StudentRecord, due: number) => {
    if (!due) return
    const phone = whatsappNumber(student.phone)
    if (phone.length < 11) {
      setError(`${student.name} ka phone number mein country code add karein.`)
      return
    }
    const message = `Namaste ${student.guardian}, ${student.name} ki ${monthLabel(month)} dance class fee ${formatRupees(due)} pending hai. Kripya month end se pehle payment kar dein. Payment ke baad receipt studio se le sakte hain. - Feel The Dance Studio`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  const signOut = () => {
    endOwnerSession()
    navigate('/admin/login', { replace: true })
  }

  const latestPayments = [...payments].filter((payment) => payment.month === month).reverse().slice(0, 5)

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-rose-300">Owner management</p>
            <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Feel The Dance Studio</h1>
            <p className="mt-1 text-sm text-slate-400">{monthLabel(month)} · Studio records</p>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5">Website</Link>
            <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5"><LogOut className="h-4 w-4" /> Logout</button>
          </div>
        </header>

        <nav className="mb-6 flex flex-wrap gap-2" aria-label="Management sections">
          {([
            ['overview', 'Overview'],
            ['students', 'Students'],
            ['fees', 'Fees & receipts'],
            ['settings', 'Payment setup'],
          ] as const).map(([key, title]) => (
            <button key={key} type="button" onClick={() => setView(key)} className={`rounded-full px-4 py-2 text-sm font-medium ${view === key ? 'bg-rose-500 text-white' : 'border border-white/10 bg-white/5 text-slate-300 hover:text-white'}`}>{title}</button>
          ))}
        </nav>

        {notice && <div role="status" className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{notice}</div>}
        {error && <div role="alert" className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div>}

        {view === 'overview' && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Stat icon={<Users />} label="Registered students" value={students.length.toString()} hint="Saved in this browser" />
              <Stat icon={<CircleDollarSign />} label="Collected this month" value={formatRupees(collection)} hint={monthLabel(month)} />
              <Stat icon={<Bell />} label="Fees outstanding" value={formatRupees(outstanding)} hint={`${feeRows.filter((row) => row.due > 0).length} students pending`} />
              <Stat icon={<Check />} label="Paid in full" value={feeRows.filter((row) => row.due === 0 && row.student.monthlyFee > 0).length.toString()} hint="For this month" />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <Card className="p-5 sm:p-6">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">Collection insights</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">Monthly fee overview</h2>
                    <p className="mt-1 text-sm text-slate-400">Last 6 months · received vs outstanding</p>
                  </div>
                  <CircleDollarSign className="h-6 w-6 text-rose-300" />
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={feeChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={8}>
                        <CartesianGrid stroke="#ffffff12" vertical={false} />
                        <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis domain={hasChartAmounts ? [0, 'auto'] : [0, 0]} ticks={hasChartAmounts ? undefined : [0]} tickFormatter={(value: number) => value >= 1000 ? `₹${Math.round(value / 1000)}k` : `₹${value}`} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
                        <Tooltip
                          cursor={{ fill: '#ffffff0a' }}
                          contentStyle={{ background: '#0f172a', border: '1px solid #ffffff20', borderRadius: 12, color: '#fff' }}
                          formatter={(value) => formatRupees(Number(value ?? 0))}
                          labelStyle={{ color: '#cbd5e1' }}
                        />
                        <Legend wrapperStyle={{ color: '#cbd5e1', fontSize: 12 }} />
                        <Bar dataKey="received" name="Received" fill={chartColors[0]} radius={[6, 6, 0, 0]} />
                        <Bar dataKey="pending" name="Outstanding" fill={chartColors[1]} radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <div className="mb-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-300">This month</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">Paid vs pending fees</h2>
                  <p className="mt-1 text-sm text-slate-400">{monthLabel(month)}</p>
                </div>
                <>
                    <div className="relative h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieChartData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={collection > 0 && outstanding > 0 ? 5 : 0} stroke="none">
                            {pieChartData.map((entry, index) => <Cell key={entry.name} fill={pieHasData ? chartColors[index] : '#334155'} />)}
                          </Pie>
                          {pieHasData && <Tooltip
                            contentStyle={{ background: '#0f172a', border: '1px solid #ffffff20', borderRadius: 12, color: '#fff' }}
                            formatter={(value) => formatRupees(Number(value ?? 0))}
                          />}
                        </PieChart>
                      </ResponsiveContainer>
                      {!pieHasData && <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-1"><span className="text-2xl font-bold text-white">₹0</span><span className="text-xs text-slate-400">No payments yet</span></div>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {collectionBreakdown.map((item, index) => (
                        <div key={item.name} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                          <div className="flex items-center gap-2 text-xs text-slate-400"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chartColors[index] }} />{item.name}</div>
                          <p className="mt-2 text-lg font-semibold text-white">{formatRupees(item.value)}</p>
                        </div>
                      ))}
                    </div>
                </>
              </Card>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <Card className="p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div><h2 className="text-xl font-semibold text-white">Register a student</h2><p className="mt-1 text-sm text-slate-400">Student and guardian details</p></div>
                  <GraduationCap className="h-6 w-6 text-rose-300" />
                </div>
                <StudentFormFields value={studentForm} onChange={setStudentForm} onSubmit={addStudent} />
              </Card>

              <Card className="p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div><h2 className="text-xl font-semibold text-white">Record a fee payment</h2><p className="mt-1 text-sm text-slate-400">Payment is added to this month’s ledger</p></div>
                  <CircleDollarSign className="h-6 w-6 text-emerald-300" />
                </div>
                {students.length === 0
                  ? <p className="rounded-xl border border-dashed border-white/15 p-6 text-center text-sm text-slate-400">Payment record karne se pehle student register karein.</p>
                  : <PaymentForm students={students} value={paymentStudentId} onStudentChange={setPaymentStudentId} amount={paymentAmount} onAmountChange={setPaymentAmount} method={paymentMethod} onMethodChange={setPaymentMethod} month={month} onMonthChange={setMonth} onSubmit={recordPayment} />}
              </Card>
            </div>

            <Card className="mt-6 overflow-hidden p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5">
                <div><h2 className="text-xl font-semibold text-white">Fee status</h2><p className="mt-1 text-sm text-slate-400">Pending fees ke liye WhatsApp reminder kholein</p></div>
                <button type="button" onClick={() => setView('fees')} className="text-sm font-medium text-rose-200 hover:text-white">Full ledger →</button>
              </div>
              <FeeTable rows={feeRows.slice(0, 6)} onReminder={sendReminder} onReceipt={(student, payment) => openReceipt(student, payment)} payments={payments} month={month} />
            </Card>
          </>
        )}

        {view === 'students' && (
          <Card className="overflow-hidden p-0">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5">
              <div><h2 className="text-xl font-semibold text-white">Students</h2><p className="mt-1 text-sm text-slate-400">{students.length} registered</p></div>
              <label className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-full border border-white/10 bg-slate-950 py-2.5 pl-9 pr-4 text-sm text-white outline-none focus:border-rose-400" placeholder="Search student or phone" />
              </label>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredStudents.length === 0
                ? <p className="col-span-full py-8 text-center text-sm text-slate-400">{students.length ? 'Koi student match nahi hua.' : 'Abhi students register nahi hue.'}</p>
                : filteredStudents.map((student) => {
                  const fee = feeRows.find((row) => row.student.id === student.id)
                  return (
                    <article key={student.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      {editingStudentId === student.id
                        ? <div>
                          <div className="mb-4 flex items-center justify-between"><h3 className="font-semibold text-white">Edit student</h3><button type="button" onClick={() => setEditingStudentId(null)} aria-label="Cancel edit" className="rounded-full border border-white/10 p-1.5 text-slate-300 hover:text-white"><X className="h-4 w-4" /></button></div>
                          <StudentFormFields value={editingStudentForm} onChange={setEditingStudentForm} onSubmit={saveStudentEdit} submitLabel="Save changes" />
                        </div>
                        : <>
                          <div className="flex items-start justify-between gap-2">
                            <div><h3 className="font-semibold text-white">{student.name}</h3><p className="text-xs text-slate-400">{student.id}</p></div>
                            <span className={`rounded-full px-2 py-1 text-xs ${fee?.due ? 'bg-amber-400/10 text-amber-200' : 'bg-emerald-500/10 text-emerald-200'}`}>{fee?.due ? 'Fee pending' : 'Paid'}</span>
                          </div>
                          <div className="mt-4 space-y-1.5 text-sm text-slate-300">
                            <p>Guardian: {student.guardian}</p><p>Phone: {student.phone}</p><p>Class: {student.className} · {student.batch}</p>
                            <p>Monthly fee: {formatRupees(student.monthlyFee)} · Due by {student.dueDay}</p>
                            <p>Paid: <span className="text-emerald-200">{formatRupees(fee?.paid ?? 0)}</span> · Pending: <span className={fee?.due ? 'text-amber-200' : 'text-emerald-200'}>{formatRupees(fee?.due ?? 0)}</span></p>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button type="button" onClick={() => beginStudentEdit(student)} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200 hover:bg-white/5"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                            <button type="button" onClick={() => deleteStudent(student)} className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 px-3 py-2 text-xs text-rose-200 hover:bg-rose-500/10"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                            {fee?.due ? <button type="button" onClick={() => sendReminder(student, fee.due)} className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 px-3 py-2 text-xs text-emerald-200 hover:bg-emerald-500/10"><Bell className="h-3.5 w-3.5" /> WhatsApp due</button> : null}
                          </div>
                        </>}
                    </article>
                  )
                })}
            </div>
          </Card>
        )}

        {view === 'fees' && (
          <>
            <div className="mb-5 grid gap-4 sm:grid-cols-3">
              <Stat icon={<CircleDollarSign />} label="Monthly fee total" value={formatRupees(feeRows.reduce((sum, row) => sum + row.student.monthlyFee, 0))} hint={monthLabel(month)} />
              <Stat icon={<Check />} label="Received" value={formatRupees(collection)} hint="Payments recorded this month" />
              <Stat icon={<Bell />} label="Remaining" value={formatRupees(outstanding)} hint="Send WhatsApp reminder to due families" />
            </div>
            <Card className="overflow-hidden p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5">
                <div><h2 className="text-xl font-semibold text-white">Monthly fee ledger</h2><p className="mt-1 text-sm text-slate-400">Payment record karte hi balance update hota hai; full payment par status paid ho jata hai.</p></div>
                <label className="text-xs text-slate-400">Fee month<input type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="ml-2 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" /></label>
              </div>
              <FeeTable rows={feeRows} onReminder={sendReminder} onReceipt={(student, payment) => openReceipt(student, payment)} payments={payments} month={month} />
            </Card>
            <Card className="mt-6 overflow-hidden p-0">
              <div className="border-b border-white/10 p-5"><h2 className="text-xl font-semibold text-white">Recent payments</h2></div>
              <div className="divide-y divide-white/5">
                {latestPayments.length === 0 ? <p className="p-5 text-sm text-slate-400">Is month abhi payments record nahi hue.</p> : latestPayments.map((payment) => {
                  const student = students.find((item) => item.id === payment.studentId)
                  if (!student) return null
                  return <div key={payment.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div><p className="font-medium text-white">{student.name} <span className="text-xs text-slate-400">· {payment.receiptNo}</span></p><p className="mt-1 text-xs text-slate-400">{payment.date} · {payment.method} · {monthLabel(payment.month)}</p></div>
                    <div className="flex items-center gap-3"><strong className="text-emerald-200">{formatRupees(payment.amount)}</strong><button type="button" onClick={() => openReceipt(student, payment)} title="Print receipt" className="rounded-full border border-white/10 p-2 text-slate-300 hover:text-white"><Printer className="h-4 w-4" /></button></div>
                  </div>
                })}
              </div>
            </Card>
          </>
        )}

        {view === 'settings' && (
          <PaymentSettingsForm
            settings={paymentSettings}
            onChange={setPaymentSettings}
            file={paymentQrFile}
            onFileChange={setPaymentQrFile}
            onSubmit={savePaymentSetup}
          />
        )}

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">Local demo data is saved in this browser only. WhatsApp reminders open a pre-filled message for you to review and send. Automatic scheduled delivery needs a secure WhatsApp Business API backend.</p>
      </div>
    </main>
  )
}

function Stat({ icon, label, value, hint }: { icon: ReactNode; label: string; value: string; hint: string }) {
  return <Card className="p-4"><div className="flex items-center justify-between text-rose-200">{icon}<span className="text-xs uppercase tracking-wider text-slate-400">{label}</span></div><div className="mt-3 text-2xl font-bold text-white">{value}</div><p className="mt-1 text-xs text-slate-400">{hint}</p></Card>
}

function StudentFormFields({ value, onChange, onSubmit, submitLabel = 'Register student' }: { value: StudentForm; onChange: (value: StudentForm) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; submitLabel?: string }) {
  const update = (field: keyof StudentForm, next: string) => onChange({ ...value, [field]: field === 'monthlyFee' || field === 'dueDay' ? Number(next) : next })
  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className={labelClass}>Student name<input required value={value.name} onChange={(event) => update('name', event.target.value)} className={inputClass} /></label>
      <label className={labelClass}>Parent / guardian<input required value={value.guardian} onChange={(event) => update('guardian', event.target.value)} className={inputClass} /></label>
      <label className={labelClass}>WhatsApp phone<input required type="tel" value={value.phone} onChange={(event) => update('phone', event.target.value)} className={inputClass} placeholder="+91 98765 43210" /></label>
      <label className={labelClass}>Class / style<input required value={value.className} onChange={(event) => update('className', event.target.value)} className={inputClass} placeholder="e.g. Bollywood" /></label>
      <label className={labelClass}>Batch<input required value={value.batch} onChange={(event) => update('batch', event.target.value)} className={inputClass} placeholder="e.g. Tue & Thu evening" /></label>
      <label className={labelClass}>Monthly fee (₹)<input required type="number" min="1" step="1" value={value.monthlyFee || ''} onChange={(event) => update('monthlyFee', event.target.value)} className={inputClass} /></label>
      <label className={labelClass}>Fee due day<input required type="number" min="1" max="28" value={value.dueDay} onChange={(event) => update('dueDay', event.target.value)} className={inputClass} /></label>
      <button type="submit" className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white sm:col-span-2">{submitLabel === 'Register student' && <Plus className="h-4 w-4" />} {submitLabel}</button>
    </form>
  )
}

function PaymentForm({ students, value, onStudentChange, amount, onAmountChange, method, onMethodChange, month, onMonthChange, onSubmit }: { students: StudentRecord[]; value: string; onStudentChange: (value: string) => void; amount: string; onAmountChange: (value: string) => void; method: PaymentRecord['method']; onMethodChange: (value: PaymentRecord['method']) => void; month: string; onMonthChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className={labelClass}>Student<select required value={value} onChange={(event) => onStudentChange(event.target.value)} className={inputClass}><option value="">Select student</option>{students.map((student) => <option key={student.id} value={student.id}>{student.name} — {student.className}</option>)}</select></label>
      <label className={labelClass}>Amount received (₹)<input required type="number" min="1" step="1" value={amount} onChange={(event) => onAmountChange(event.target.value)} className={inputClass} /></label>
      <label className={labelClass}>Fee month<input required type="month" value={month} onChange={(event) => onMonthChange(event.target.value)} className={inputClass} /></label>
      <label className={labelClass}>Payment method<select value={method} onChange={(event) => onMethodChange(event.target.value as PaymentRecord['method'])} className={inputClass}><option>UPI</option><option>Cash</option><option>Bank transfer</option><option>Other</option></select></label>
      <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white"><Check className="h-4 w-4" /> Save payment & receipt</button>
    </form>
  )
}

type FeeRow = { student: StudentRecord; paid: number; due: number }
function FeeTable({ rows, onReminder, onReceipt, payments, month }: { rows: FeeRow[]; onReminder: (student: StudentRecord, due: number) => void; onReceipt: (student: StudentRecord, payment: PaymentRecord) => void; payments: PaymentRecord[]; month: string }) {
  if (rows.length === 0) return <p className="p-8 text-center text-sm text-slate-400">Ledger dekhne ke liye pehle student register karein.</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">Student</th><th className="px-5 py-3">Monthly fee</th><th className="px-5 py-3">Paid</th><th className="px-5 py-3">Balance</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Action</th></tr></thead>
        <tbody className="divide-y divide-white/5">
          {rows.map(({ student, paid, due }) => {
            const latestPayment = [...payments].reverse().find((payment) => payment.studentId === student.id && payment.month === month)
            const status = due === 0 ? 'Paid' : paid ? 'Partial' : 'Due'
            return <tr key={student.id}>
              <td className="px-5 py-4"><div className="font-medium text-white">{student.name}</div><div className="mt-1 text-xs text-slate-400">{student.className} · {student.batch}</div></td>
              <td className="px-5 py-4 text-slate-300">{formatRupees(student.monthlyFee)}</td>
              <td className="px-5 py-4 text-emerald-200">{formatRupees(paid)}</td>
              <td className="px-5 py-4 text-slate-200">{formatRupees(due)}</td>
              <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs ${status === 'Paid' ? 'bg-emerald-500/10 text-emerald-200' : status === 'Partial' ? 'bg-amber-400/10 text-amber-200' : 'bg-rose-500/10 text-rose-200'}`}>{status}</span></td>
              <td className="px-5 py-4"><div className="flex items-center gap-2">
                {due > 0 && <button type="button" onClick={() => onReminder(student, due)} className="rounded-full border border-emerald-500/25 px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-500/10">WhatsApp</button>}
                {latestPayment && <button type="button" onClick={() => onReceipt(student, latestPayment)} className="rounded-full border border-white/10 p-2 text-slate-300 hover:text-white" title="Print latest receipt"><Printer className="h-4 w-4" /></button>}
              </div></td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  )
}

function PaymentSettingsForm({ settings, onChange, file, onFileChange, onSubmit }: {
  settings: StudioPaymentSettings
  onChange: (settings: StudioPaymentSettings) => void
  file: File | null
  onFileChange: (file: File | null) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <Card className="mx-auto max-w-3xl p-5 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-rose-500/10 p-3 text-rose-200"><Settings className="h-5 w-5" /></div>
        <div><h2 className="text-xl font-semibold text-white">Website payment setup</h2><p className="mt-1 text-sm text-slate-400">UPI details aur support number public Pay Now page par dikhte hain.</p></div>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <label className={labelClass}>Studio / UPI payee name<input required value={settings.payeeName} onChange={(event) => onChange({ ...settings, payeeName: event.target.value })} className={inputClass} placeholder="Feel The Dance Studio" /></label>
        <label className={labelClass}>UPI ID<input value={settings.upiId} onChange={(event) => onChange({ ...settings, upiId: event.target.value.trim() })} className={inputClass} placeholder="studio@upi" autoComplete="off" /></label>
        <label className={labelClass}>Admin WhatsApp number<input type="tel" value={settings.whatsappPhone} onChange={(event) => onChange({ ...settings, whatsappPhone: event.target.value })} className={inputClass} placeholder="+91 98765 43210" /></label>
        <label className="block text-sm text-slate-300">
          UPI QR image <span className="text-xs text-slate-500">(PNG/JPG/WebP, max 1 MB)</span>
          <span className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-slate-950/70 px-4 py-5 text-sm text-slate-200 hover:border-rose-400">
            <Upload className="h-4 w-4 text-rose-200" /> {file?.name ?? (settings.qrImageDataUrl ? 'Choose a replacement QR image' : 'Choose a QR image')}
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} className="sr-only" />
          </span>
        </label>
        {settings.qrImageDataUrl && <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-slate-950/50 p-3">
          <img src={settings.qrImageDataUrl} alt="Configured UPI QR preview" className="h-24 w-24 rounded-lg bg-white p-1 object-contain" />
          <div className="min-w-0 flex-1"><p className="text-sm font-medium text-white">Current QR preview</p><p className="mt-1 text-xs text-slate-400">This image will show on the public Pay Now page in this browser.</p></div>
          <button type="button" onClick={() => { onChange({ ...settings, qrImageDataUrl: '' }); onFileChange(null) }} className="rounded-full border border-rose-500/25 px-3 py-2 text-xs text-rose-200 hover:bg-rose-500/10">Remove</button>
        </div>}
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white"><Check className="h-4 w-4" /> Save payment setup</button>
      </form>
      <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-xs leading-5 text-amber-100/80">
        This demo stores the QR, UPI ID, and WhatsApp number in this browser only. They will not be shared with other devices or website visitors until a secure shared backend is connected. UPI payments are not automatically verified.
      </div>
    </Card>
  )
}
