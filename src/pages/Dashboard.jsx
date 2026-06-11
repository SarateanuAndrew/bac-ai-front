import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listExams } from '../api/client'
import { Plus, BookOpen, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

function ScoreBadge({ score }) {
  if (score === null || score === undefined) {
    return (
      <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
        În progres
      </span>
    )
  }
  const s = Math.round(score)
  if (s >= 70) {
    return <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">{s}%</span>
  }
  if (s >= 50) {
    return <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-semibold">{s}%</span>
  }
  return <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-semibold">{s}%</span>
}

function StatCard({ icon: Icon, label, value, colorClass }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

function ExamRow({ exam }) {
  const date = new Date(exam.generated_at).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const isCompleted = exam.completed_at !== null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-emerald-200 hover:shadow-sm transition-all">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{exam.topic}</p>
        <p className="text-xs text-gray-400 mt-0.5">{date}</p>
      </div>
      <div className="flex items-center gap-3">
        <ScoreBadge score={exam.score} />
        {isCompleted ? (
          <Link
            to={`/exams/${exam.id}/results`}
            className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            Rezultate
          </Link>
        ) : (
          <Link
            to={`/exams/${exam.id}`}
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            Continuă
          </Link>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listExams()
      .then(setExams)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const completed = exams.filter((e) => e.completed_at !== null)
  const avgScore =
    completed.length
      ? Math.round(completed.reduce((s, e) => s + (e.score || 0), 0) / completed.length)
      : null
  const bestScore =
    completed.length ? Math.round(Math.max(...completed.map((e) => e.score || 0))) : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bun venit, {user?.username}!</h1>
          <p className="text-gray-500 mt-1">Continuă să exersezi pentru BAC.</p>
        </div>
        <Link
          to="/exams/start"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Examen Nou
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BookOpen} label="Total examene" value={exams.length} colorClass="bg-emerald-100 text-emerald-600" />
        <StatCard icon={CheckCircle} label="Finalizate" value={completed.length} colorClass="bg-blue-100 text-blue-600" />
        <StatCard icon={TrendingUp} label="Scor mediu" value={avgScore !== null ? `${avgScore}%` : '—'} colorClass="bg-purple-100 text-purple-600" />
        <StatCard icon={Clock} label="Cel mai bun" value={bestScore !== null ? `${bestScore}%` : '—'} colorClass="bg-orange-100 text-orange-600" />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {exams.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Niciun examen încă</h3>
          <p className="text-gray-500 mb-6">Generează primul tău examen de practică.</p>
          <Link
            to="/exams/start"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Examen Nou
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Istoricul examenelor</h2>
          <div className="space-y-3">
            {exams.map((exam) => (
              <ExamRow key={exam.id} exam={exam} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
