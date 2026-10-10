export type StudentRecord = {
  id: string
  name: string
  guardian: string
  phone: string
  className: string
  batch: string
  monthlyFee: number
  dueDay: number
  createdAt: string
}

export type PaymentRecord = {
  id: string
  studentId: string
  month: string
  amount: number
  date: string
  method: 'Cash' | 'UPI' | 'Bank transfer' | 'Other'
  receiptNo: string
}

export type StudioPaymentSettings = {
  upiId: string
  payeeName: string
  whatsappPhone: string
  qrImageDataUrl: string
}

const STUDENTS_KEY = 'feel-dance-owner-students'
const PAYMENTS_KEY = 'feel-dance-owner-payments'
const OWNER_KEY = 'feel-dance-owner-credentials'
const SESSION_KEY = 'feel-dance-owner-session'
const PAYMENT_SETTINGS_KEY = 'feel-dance-payment-settings'

export const emptyPaymentSettings: StudioPaymentSettings = {
  upiId: '',
  payeeName: 'Feel The Dance Studio',
  whatsappPhone: '',
  qrImageDataUrl: '',
}

function readRecords<T>(key: string): T[] {
  const raw = localStorage.getItem(key)
  if (!raw) return []

  try {
    const records: unknown = JSON.parse(raw)
    if (!Array.isArray(records)) throw new Error('Stored data is not a list.')
    return records as T[]
  } catch (error) {
    throw new Error(`Could not read saved studio data (${key}).`, { cause: error })
  }
}

export function getStudents() {
  return readRecords<StudentRecord>(STUDENTS_KEY)
}

export function saveStudents(students: StudentRecord[]) {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
}

export function getPayments() {
  return readRecords<PaymentRecord>(PAYMENTS_KEY)
}

export function savePayments(payments: PaymentRecord[]) {
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments))
}

export function getStudioPaymentSettings(): StudioPaymentSettings {
  const raw = localStorage.getItem(PAYMENT_SETTINGS_KEY)
  if (!raw) return { ...emptyPaymentSettings }
  try {
    const settings = JSON.parse(raw) as Partial<StudioPaymentSettings>
    return { ...emptyPaymentSettings, ...settings }
  } catch (error) {
    throw new Error('Could not read the saved payment settings.', { cause: error })
  }
}

export function saveStudioPaymentSettings(settings: StudioPaymentSettings) {
  localStorage.setItem(PAYMENT_SETTINGS_KEY, JSON.stringify(settings))
}

export function getOwnerCredentials() {
  const raw = localStorage.getItem(OWNER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as { email: string; salt: string; passwordHash: string }
  } catch (error) {
    throw new Error('Could not read the saved owner account.', { cause: error })
  }
}

export function setOwnerCredentials(credentials: { email: string; salt: string; passwordHash: string }) {
  localStorage.setItem(OWNER_KEY, JSON.stringify(credentials))
}

export function isOwnerSessionActive() {
  return sessionStorage.getItem(SESSION_KEY) === 'active'
}

export function startOwnerSession() {
  sessionStorage.setItem(SESSION_KEY, 'active')
}

export function endOwnerSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function currentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function getPaidAmount(studentId: string, month: string, payments: PaymentRecord[]) {
  return payments
    .filter((payment) => payment.studentId === studentId && payment.month === month)
    .reduce((total, payment) => total + payment.amount, 0)
}

export function createReceiptNumber() {
  return `FTD-${Date.now().toString(36).toUpperCase()}`
}

export function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 ? `91${digits}` : digits
}

export function openReceipt(student: StudentRecord, payment: PaymentRecord) {
  const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[character] ?? character)
  const receiptWindow = window.open('', '_blank', 'width=720,height=800')
  if (!receiptWindow) throw new Error('Receipt window was blocked. Allow pop-ups and try again.')

  receiptWindow.document.write(`<!doctype html>
    <html><head><title>Fee receipt ${escapeHtml(payment.receiptNo)}</title>
    <style>
      body{font:16px Arial,sans-serif;color:#172033;padding:40px;max-width:680px;margin:auto}
      header{display:flex;justify-content:space-between;align-items:start;border-bottom:2px solid #f43f5e;padding-bottom:20px}
      h1{margin:0 0 6px;font-size:24px}p{color:#475569}.amount{font-size:28px;font-weight:700;margin:28px 0}
      table{width:100%;border-collapse:collapse}td{padding:12px 4px;border-bottom:1px solid #e2e8f0}
      td:first-child{color:#64748b}.actions{margin-top:30px}button{padding:10px 18px}
      @media print{.actions{display:none}body{padding:0}}
    </style></head><body>
    <header><div><h1>Feel The Dance Studio</h1><p>Fee payment receipt</p></div><div><strong>${escapeHtml(payment.receiptNo)}</strong><p>${escapeHtml(payment.date)}</p></div></header>
    <div class="amount">₹${payment.amount.toLocaleString('en-IN')} <small style="font-size:14px;color:#059669">PAYMENT RECEIVED</small></div>
    <table>
      <tr><td>Student</td><td>${escapeHtml(student.name)}</td></tr>
      <tr><td>Parent / guardian</td><td>${escapeHtml(student.guardian)}</td></tr>
      <tr><td>Class and batch</td><td>${escapeHtml(student.className)} · ${escapeHtml(student.batch)}</td></tr>
      <tr><td>Fee month</td><td>${escapeHtml(payment.month)}</td></tr>
      <tr><td>Payment method</td><td>${escapeHtml(payment.method)}</td></tr>
    </table>
    <p>Thank you for your payment.</p>
    <div class="actions"><button onclick="window.print()">Print / Save as PDF</button></div>
    </body></html>`)
  receiptWindow.document.close()
}

export async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}
