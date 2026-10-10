import { describe, expect, it } from 'vitest'
import { admissionSchema, calculateFeeBalance, createReminderKey, isDuplicateAttendance, shouldSkipReminder } from '../lib/validation'
import { getPaidAmount, type PaymentRecord } from '../lib/ownerStore'

describe('admission validation', () => {
  it('accepts valid admission data', () => {
    const result = admissionSchema.safeParse({
      studentName: 'Aarya Singh',
      dob: '2015-04-10',
      parentName: 'Manoj Singh',
      parentPhone: '+919876543210',
      email: 'parent@example.com',
      requestedClass: 'Bollywood Groove',
      preferredBatch: 'Beginner',
      notes: 'Interested in weekend sessions',
      privacyAccepted: true,
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid admission data', () => {
    const result = admissionSchema.safeParse({
      studentName: 'A',
      dob: '',
      parentName: 'M',
      parentPhone: '123',
      email: 'not-an-email',
      requestedClass: '',
      preferredBatch: '',
      notes: 'x'.repeat(501),
      privacyAccepted: false,
    })

    expect(result.success).toBe(false)
  })
})

describe('fee calculations', () => {
  it('calculates remaining balance correctly', () => {
    expect(calculateFeeBalance(5000, [1500, 2000])).toBe(1500)
  })

  it('totals payments only for the selected student and fee month', () => {
    const payments: PaymentRecord[] = [
      { id: 'p1', studentId: 's1', month: '2026-10', amount: 1200, date: '2026-10-10', method: 'UPI', receiptNo: 'r1' },
      { id: 'p2', studentId: 's1', month: '2026-10', amount: 800, date: '2026-10-12', method: 'Cash', receiptNo: 'r2' },
      { id: 'p3', studentId: 's1', month: '2026-09', amount: 5000, date: '2026-09-05', method: 'UPI', receiptNo: 'r3' },
      { id: 'p4', studentId: 's2', month: '2026-10', amount: 4500, date: '2026-10-05', method: 'UPI', receiptNo: 'r4' },
    ]

    expect(getPaidAmount('s1', '2026-10', payments)).toBe(2000)
    expect(getPaidAmount('s1', '2026-09', payments)).toBe(5000)
    expect(getPaidAmount('s3', '2026-10', payments)).toBe(0)
  })
})

describe('attendance and reminders', () => {
  it('prevents duplicate attendance records', () => {
    const attendance = [{ studentId: 's1', date: '2026-10-10' }]
    expect(isDuplicateAttendance(attendance, 's1', '2026-10-10')).toBe(true)
    expect(isDuplicateAttendance(attendance, 's2', '2026-10-10')).toBe(false)
  })

  it('creates a stable reminder key', () => {
    expect(createReminderKey('Aarya Singh', '2026-10-15')).toBe('aarya-singh-2026-10-15')
  })

  it('skips reminders for paid or waived fees', () => {
    expect(shouldSkipReminder('paid', false)).toBe(true)
    expect(shouldSkipReminder('pending', true)).toBe(true)
    expect(shouldSkipReminder('pending', false)).toBe(false)
  })
})
