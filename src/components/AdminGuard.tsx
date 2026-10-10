import { Navigate } from 'react-router-dom'
import { isOwnerSessionActive } from '../lib/ownerStore'
import type { ReactNode } from 'react'

export function AdminGuard({ children }: { children: ReactNode }) {
  return isOwnerSessionActive() ? children : <Navigate to="/admin/login" replace />
}
