import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import StartExam from './pages/StartExam'
import ExamPage from './pages/ExamPage'
import ResultsPage from './pages/ResultsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/exams/start"
              element={<ProtectedRoute><StartExam /></ProtectedRoute>}
            />
            <Route
              path="/exams/:id"
              element={<ProtectedRoute><ExamPage /></ProtectedRoute>}
            />
            <Route
              path="/exams/:id/results"
              element={<ProtectedRoute><ResultsPage /></ProtectedRoute>}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
