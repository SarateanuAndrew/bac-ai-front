import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { startExam } from '../api/client'
import { Shuffle, ChevronLeft, BookOpen } from 'lucide-react'

const BAC_CHAPTERS = [
  'Celula - structura și ultrastructura',
  'Membrana celulară și transportul prin membrană',
  'Nucleul celular și materialul genetic',
  'Diviziunea celulară - mitoza și meioza',
  'Metabolismul celular - respirația celulară',
  'Fotosinteza',
  'Sinteza proteinelor - transcripția și translația',
  'Genetica - legile lui Mendel',
  'Genetica - mutații și variabilitate',
  'Sistemul nervos',
  'Sistemul endocrin',
  'Sistemul cardiovascular',
  'Sistemul respirator',
  'Sistemul digestiv',
  'Sistemul excretor',
  'Sistemul reproducător și reproducerea',
  'Sistemul imunitar',
  'Sistemul locomotor - oase și mușchi',
  'Evoluția și selecția naturală',
  'Ecologia - ecosisteme și lanțuri trofice',
  'Biotehnologia și ingineria genetică',
  'Embriologia și dezvoltarea organismelor',
]

export default function StartExam() {
  const [loading, setLoading] = useState(false)
  const [loadingTopic, setLoadingTopic] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleStart = async (topic) => {
    setError('')
    setLoading(true)
    setLoadingTopic(topic || 'Aleatoriu')
    try {
      const exam = await startExam(topic)
      navigate(`/exams/${exam.id}`)
    } catch (err) {
      setError(err.message)
      setLoading(false)
      setLoadingTopic('')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-gray-900 font-semibold text-lg">Se generează subiectul...</p>
          <p className="text-gray-500 text-sm mt-1">Capitol: {loadingTopic}</p>
          <p className="text-gray-400 text-xs mt-3">Modelul AI pregătește întrebările. Poate dura 30–60 de secunde.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Înapoi la Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Alege un capitol</h1>
        <p className="text-gray-500 mt-1">
          Selectează un capitol sau generează un subiect aleatoriu din toate capitolele.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Random button */}
      <button
        onClick={() => handleStart(null)}
        className="w-full mb-8 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-100 text-lg"
      >
        <Shuffle className="w-5 h-5" />
        Subiect Aleatoriu
      </button>

      {/* Chapter grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {BAC_CHAPTERS.map((chapter, index) => (
          <button
            key={chapter}
            onClick={() => handleStart(chapter)}
            className="text-left p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 bg-emerald-100 group-hover:bg-emerald-200 rounded-lg flex items-center justify-center transition-colors">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <span className="text-xs font-medium text-emerald-600 mb-1 block">
                  Capitol {index + 1}
                </span>
                <p className="text-sm font-medium text-gray-800 leading-snug">{chapter}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
