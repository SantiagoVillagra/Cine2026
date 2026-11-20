import { useContext } from 'react'
import { AlertContext } from '../context/alert-context.js'

export function useAlerts() {
  const context = useContext(AlertContext)
  if (!context) throw new Error('useAlerts debe utilizarse dentro de AlertProvider.')
  return context
}
