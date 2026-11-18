/** Señala credenciales rechazadas sin depender del formato de error del backend. */
export class InvalidCredentialsError extends Error {
  constructor() {
    super()
    this.name = 'InvalidCredentialsError'
  }
}
