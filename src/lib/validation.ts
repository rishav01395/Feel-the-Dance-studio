import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .default('')
  .refine((value) => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
    message: 'Please enter a valid email.',
  })

export const admissionSchema = z.object({
  studentName: z.string().trim().min(2, 'Student name is required.'),
  dob: z.string().min(1, 'Date of birth is required.'),
  parentName: z.string().trim().min(2, 'Parent name is required.'),
  parentPhone: z.string().trim().min(10, 'Parent phone number is required.'),
  email: emailSchema,
  requestedClass: z.string().min(1, 'Please select a class.'),
  preferredBatch: z.string().min(1, 'Please select a preferred batch.'),
  notes: z.string().max(500, 'Notes are limited to 500 characters.').default(''),
  privacyAccepted: z.boolean().refine((value) => value === true, {
    message: 'You must accept the privacy notice.',
  }),
})

export type AdmissionFormValues = z.infer<typeof admissionSchema>

export const trialClassSchema = z.object({
  studentName: z.string().trim().min(2, 'Student name is required.'),
  parentName: z.string().trim().min(2, 'Parent name is required.'),
  parentPhone: z.string().trim().min(10, 'Parent phone is required.'),
  email: emailSchema,
  requestedClass: z.string().min(1, 'Please pick a class.'),
  preferredBatch: z.string().min(1, 'Please pick a batch.'),
  notes: z.string().max(500, 'Notes are limited to 500 characters.').default(''),
})

export type TrialFormValues = z.infer<typeof trialClassSchema>

export function calculateFeeBalance(totalFee: number, payments: number[]) {
  const paid = payments.reduce((sum, payment) => sum + Math.max(0, payment), 0)
  return Math.max(0, totalFee - paid)
}

export function buildStudentFromApplication(application: {
  studentName: string
  parentName: string
  requestedClass: string
  preferredBatch: string
  dob: string
}) {
  return {
    studentId: `ST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    name: application.studentName,
    guardian: application.parentName,
    className: application.requestedClass,
    batch: application.preferredBatch,
    dob: application.dob,
    status: 'active',
  }
}

export function isDuplicateAttendance(existing: { date: string; studentId: string }[], studentId: string, date: string) {
  return existing.some((record) => record.studentId === studentId && record.date === date)
}

export function createReminderKey(studentName: string, feeDueDate: string) {
  return `${studentName.toLowerCase().replace(/\s+/g, '-')}-${feeDueDate}`
}

export function shouldSkipReminder(feeStatus?: string, isPaid = false) {
  return isPaid || feeStatus === 'paid' || feeStatus === 'waived'
}
