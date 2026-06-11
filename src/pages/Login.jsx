import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as apiLogin } from '../api/client'
import { BookOpen } from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiLogin(form)
      signIn(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-2xl mb-4">
            <BookOpen className="w-7 h-7 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Autentificare</h1>
          <p className="text-gray-500 mt-1">Intră în contul tău BAC Biologie AI</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={set('email')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                placeholder="exemplu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Parolă</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={set('password')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                placeholder="••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Se autentifică...' : 'Autentificare'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Nu ai cont?{' '}
            <Link to="/register" className="text-emerald-600 hover:underline font-medium">
              Înregistrează-te
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
