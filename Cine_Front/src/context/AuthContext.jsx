import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth-context.js'
import { login as loginRequest } from '../services/authService.js'
import { clearStoredSession, isTokenExpired, readStoredSession } from '../services/apiClient.js'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession())

  const logout = useCallback(() => {
    clearStoredSession()
    setSession(null)
  }, [])

  const authenticate = useCallback(async (credentials) => {
    const nextSession = await loginRequest(credentials)

    if (isTokenExpired(nextSession.token)) {
      throw new Error('La API devolvió un token vencido o inválido.')
    }

    window.sessionStorage.setItem('cine2026.session', JSON.stringify(nextSession))
    setSession(nextSession)
    return nextSession.user
  }, [])

  useEffect(() => {
    const handleSessionExpired = () => setSession(null)
    window.addEventListener('cine:session-expired', handleSessionExpired)
    return () => window.removeEventListener('cine:session-expired', handleSessionExpired)
  }, [])

  useEffect(() => {
    if (!session?.token) return undefined

    let claims
    try {
      const payload = session.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      claims = JSON.parse(window.atob(payload))
    } catch {
      const timeoutId = window.setTimeout(logout, 0)
      return () => window.clearTimeout(timeoutId)
    }

    const expiresIn = claims.exp * 1000 - Date.now()
    if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
      const timeoutId = window.setTimeout(logout, 0)
      return () => window.clearTimeout(timeoutId)
    }

    const timeoutId = window.setTimeout(logout, expiresIn)
    return () => window.clearTimeout(timeoutId)
  }, [session, logout])

  const value = useMemo(() => ({
    user: session?.user ?? null,
    token: session?.token ?? null,
    authenticate,
    logout,
  }), [session, authenticate, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
