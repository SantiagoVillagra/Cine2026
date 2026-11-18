import { apiClient } from './apiClient.js'
import { InvalidCredentialsError } from '../utils/InvalidCredentialsError.js'

export async function login({ email, password }) {
  try {
    const { data } = await apiClient.post(
      '/api/login',
      { userEmail: email, password },
      { headers: { 'Content-Type': 'application/json' } },
    )

    if (
      typeof data?.token !== 'string' ||
      !Number.isInteger(data?.userId) ||
      typeof data?.email !== 'string' ||
      typeof data?.isAdmin !== 'boolean'
    ) {
      throw new Error('La respuesta de login no coincide con el contrato de la API.')
    }

    return {
      token: data.token,
      user: {
        userId: data.userId,
        email: data.email,
        isAdmin: data.isAdmin,
        role: data.isAdmin ? 'Admin' : 'Client',
      },
    }
  } catch (error) {
    if (error.response?.status === 401) {
      throw new InvalidCredentialsError()
    }

    throw error
  }
}
