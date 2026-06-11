import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, LogOut, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to={user ? '/dashboard' : '/'}
          className="flex items-center gap-2 text-emerald-700 font-bold text-lg"
        >
          <BookOpen className="w-6 h-6" />
          BAC Biologie AI
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-500 hidden sm:block">
                Salut, <strong className="text-gray-700">{user.username}</strong>
              </span>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-emerald-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Ieșire</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-emerald-700 transition-colors px-3 py-1.5"
              >
                Autentificare
              </Link>
              <Link
                to="/register"
                className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Înregistrare
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
