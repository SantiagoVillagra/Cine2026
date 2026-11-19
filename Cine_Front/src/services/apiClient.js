import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL

export const apiClient = axios.create({ baseURL })

apiClient.interceptors.request.use((config) => {
  const isLoginRequest = config.url?.replace(/^\//, '') === 'api/login'

  if (!isLoginRequest) {
    const session = readStoredSession()

    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`
    }
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      clearStoredSession()
      window.dispatchEvent(new Event('cine:session-expired'))
    }

    return Promise.reject(error)
  },
)

function readStoredSession() {
  try {
    const rawSession = window.sessionStorage.getItem('cine2026.session')
    if (!rawSession) return null

    const session = JSON.parse(rawSession)
    if (!session?.token || !session?.user || isTokenExpired(session.token)) {
      clearStoredSession()
      return null
    }

    return session
  } catch {
    clearStoredSession()
    return null
  }
}

function clearStoredSession() {
  window.sessionStorage.removeItem('cine2026.session')
}

function isTokenExpired(token) {
  try {
    const payload = token.split('.')[1]
    if (!payload) return true

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const claims = JSON.parse(window.atob(normalizedPayload))
    return typeof claims.exp !== 'number' || claims.exp * 1000 <= Date.now()
  } catch {
    return true
  }
}

export { clearStoredSession, isTokenExpired, readStoredSession }
