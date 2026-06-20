import { getIdToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const authFetch = async (endpoint, options = {}) => {
  const token = await getIdToken()
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.detail || 'Erro na requisição')
  }

  return data
}

export const analyzeProfile = (sections) =>
  authFetch('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({ sections }),
  })

export const fetchReports = () => authFetch('/api/reports')

export const fetchReport = (reportId) => authFetch(`/api/reports/${reportId}`)

export const fetchProfiles = () => authFetch('/api/profiles')
