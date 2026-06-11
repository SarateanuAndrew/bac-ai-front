import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getMe } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  const signIn = useCallback((tokenData) => {
    localStorage.setItem('token', tokenData.access_token)
    setUser({ id: tokenData.user_id, username: tokenData.username })
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
