import { useContext } from 'react'
import { AuthContext } from '../context/auth-context.js'

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider')
  }

  return {
    ...context,
    isAuthenticated: Boolean(context.user && context.token),
  }
}
