import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getResults, getExam } from '../api/client'
import LoadingSpinner from '../components/LoadingSpinner'
import { CheckCircle2, XCircle, MinusCircle, Trophy, Home, RotateCcw } from 'lucide-react'

const GRADE = {
  correct: {
    Icon: CheckCircle2,
    label: 'Corect',
    card: 'bg-green-50 border-green-200',
    badge: 'bg-green-100 text-green-700',
    icon: 'text-green-500',
  },
  partial: {
    Icon: MinusCircle,
    label: 'Parțial corect',
    card: 'bg-yellow-50 border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-700',
    icon: 'text-yellow-500',
  },
  incorrect: {
    Icon: XCircle,
    label: 'Incorect',
    card: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-700',
    icon: 'text-red-500',
  },
}

function ScoreDisplay({ score }) {
  const s = Math.round(score)
  const color = s >= 70 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626'
  const message = s >= 70 ? 'Excelent!' : s >= 50 ? 'Bine, continuă!' : 'Mai exersează'

  return (
    <div className="text-center">
      <div
        className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-8"
        style={{ borderColor: color }}
      >
        <span className="text-4xl font-black leading-none" style={{ color }}>
          {s}%
        </span>
      </div>
      <p className="mt-3 font-semibold text-gray-700 text-lg">{message}</p>
    </div>
  )
}

export default function ResultsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getResults(id), getExam(id)])
      .then(([res, exam]) => {
        setResults(res)
        setTopic(exam.topic)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner text="Se încarcă rezultatele..." />

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    )
  }

  const correct = results.answers.filter((a) => a.grade === 'correct').length
  const partial = results.answers.filter((a) => a.grade === 'partial').length
  const incorrect = results.answers.filter((a) => a.grade === 'incorrect').length

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Result header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
          <Trophy className="w-4 h-4" />
          Rezultatele examenului
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-6">{topic}</h1>
        <ScoreDisplay score={results.score} />

        <div className="flex justify-center gap-10 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{correct}</p>
            <p className="text-xs text-gray-500 mt-0.5">Corecte</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{partial}</p>
            <p className="text-xs text-gray-500 mt-0.5">Parțial</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{incorrect}</p>
            <p className="text-xs text-gray-500 mt-0.5">Incorecte</p>
          </div>
        </div>
      </div>

      {/* Answers detail */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">Detalii pe întrebări</h2>
      <div className="space-y-4 mb-8">
        {results.answers.map((answer) => {
          const cfg = GRADE[answer.grade] || GRADE.incorrect
          const { Icon } = cfg
          return (
            <div key={answer.ref} className={`rounded-xl border p-5 ${cfg.card}`}>
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${cfg.icon}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-gray-900">Întrebarea {answer.ref}</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Răspunsul tău
                      </p>
                      <div className="bg-white/70 rounded-lg p-3 text-gray-700 whitespace-pre-wrap">
                        {answer.user_answer || (
                          <span className="italic text-gray-400">Niciun răspuns</span>
                        )}
                      </div>
                    </div>

                    {answer.correct_answer && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Răspuns corect
                        </p>
                        <div className="bg-white/70 rounded-lg p-3 text-gray-700 whitespace-pre-wrap">
                          {answer.correct_answer}
                        </div>
                      </div>
                    )}

                    {answer.feedback && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Feedback AI
                        </p>
                        <p className="italic text-gray-600">{answer.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl border border-gray-200 transition-colors"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => navigate('/exams/start')}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Examen Nou
        </button>
      </div>
    </div>
  )
}
