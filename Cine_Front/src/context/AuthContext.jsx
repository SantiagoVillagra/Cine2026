import { useState } from 'react'
import { AuthContext } from './auth-context.js'

export function AuthProvider({ children }) {
  // La autenticación se conectará cuando backend confirme su contrato.
  const [user, setUser] = useState(null)
  const value = { user, setUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
