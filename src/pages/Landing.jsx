import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Brain, CheckCircle, BarChart3, GraduationCap, Zap, ArrowRight } from 'lucide-react'

const FEATURES = [
  {
    icon: Brain,
    title: 'Generare AI',
    desc: 'Subiecte generate automat cu AI, bazate pe programa BAC de biologie și examene reale.',
  },
  {
    icon: CheckCircle,
    title: 'Corectare automată',
    desc: 'Răspunsurile sunt evaluate semantic de un model de limbaj, cu feedback în română.',
  },
  {
    icon: BarChart3,
    title: 'Urmărire progres',
    desc: 'Consultă istoricul testelor, notele obținute și evoluția ta în timp.',
  },
  {
    icon: GraduationCap,
    title: '22 capitole BAC',
    desc: 'Acoperim toate capitolele din programa oficială: celulă, genetică, sisteme, ecologie și altele.',
  },
]

const CHAPTERS_PREVIEW = [
  'Celula - structura și ultrastructura',
  'Genetica - legile lui Mendel',
  'Sistemul nervos',
  'Sistemul cardiovascular',
  'Evoluția și selecția naturală',
  'Ecologia - ecosisteme și lanțuri trofice',
]

export default function Landing() {
  const { user } = useAuth()

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Pregătire BAC cu Inteligență Artificială
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Exersează pentru{' '}
            <span className="text-emerald-600">BAC Biologie</span>
            {' '}cu AI
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Generează subiecte realiste, răspunde la întrebări și primești feedback instant
            de la un model AI antrenat pe manuale și examene reale BAC.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-200"
              >
                Mergi la Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-200"
                >
                  Începe gratuit
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 text-lg px-8 py-3.5 rounded-xl font-semibold border border-gray-200 transition-colors"
                >
                  Autentificare
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Tot ce ai nevoie pentru BAC</h2>
            <p className="text-gray-500 text-lg">O platformă completă pentru pregătire eficientă</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapters preview */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Capitole disponibile</h2>
            <p className="text-gray-500">Alege orice capitol din programa BAC sau generează un subiect aleatoriu</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {CHAPTERS_PREVIEW.map((ch) => (
              <div
                key={ch}
                className="bg-white border border-gray-200 rounded-xl p-4 text-sm font-medium text-gray-700"
              >
                {ch}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm">+ 16 alte capitole din programa oficială</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-emerald-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Gata să exersezi?</h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Creează-ți un cont gratuit și generează primul tău subiect de biologie în câteva secunde.
          </p>
          {!user && (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 font-semibold text-lg px-8 py-3.5 rounded-xl transition-colors"
            >
              Creează cont gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>
    </main>
  )
}
