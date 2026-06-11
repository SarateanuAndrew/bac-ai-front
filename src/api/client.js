const API_BASE = import.meta.env.VITE_API_BASE || `http://${window.location.hostname}:8000`

function getHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Eroare de rețea.' }))
    throw new Error(err.detail || 'Eroare necunoscută.')
  }
  return res.json()
}

export const register = (data) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify(data) })

export const login = (data) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify(data) })

export const getMe = () => request('/auth/me')

export const startExam = (topic) =>
  request('/exams/start', { method: 'POST', body: JSON.stringify({ topic: topic || null }) })

export const listExams = () => request('/exams/')

export const getExam = (id) => request(`/exams/${id}`)

export const submitExam = (id, answers) =>
  request(`/exams/${id}/submit`, { method: 'POST', body: JSON.stringify({ answers }) })

export const getResults = (id) => request(`/exams/${id}/results`)

export const checkHealth = () => request('/health')
