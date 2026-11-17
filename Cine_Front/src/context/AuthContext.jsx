import { useState } from 'react'
import { AuthContext } from './auth-context.js'

export function AuthProvider({ children }) {
  // La autenticación se conectará cuando backend confirme su contrato.
  const [user, setUser] = useState(() => {
    if (
      import.meta.env.DEV &&
      import.meta.env.VITE_ADMIN_PREVIEW === 'true'
    ) {
      return { role: 'Admin' }
    }

    return null
  })
  const value = { user, setUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
