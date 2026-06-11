import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getExam, submitExam } from '../api/client'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  Send, AlertCircle, BookOpen, X, ZoomIn,
  Table2, GitMerge, List, AlignLeft, FileText, BookMarked,
} from 'lucide-react'

// ── Type metadata ──────────────────────────────────────────────────────────────

const TYPE_META = {
  definitie: {
    label: 'Definiție',
    icon: BookMarked,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    rows: 3,
  },
  scurt: {
    label: 'Răspuns scurt',
    icon: FileText,
    color: 'text-gray-600 bg-gray-50 border-gray-200',
    rows: 2,
  },
  argumentare: {
    label: 'Argumentare',
    icon: AlignLeft,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    rows: 6,
  },
  enumera: {
    label: 'Enumerare',
    icon: List,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    rows: 4,
  },
  completare_tabel: {
    label: 'Completare tabel',
    icon: Table2,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  asociere: {
    label: 'Asociere',
    icon: GitMerge,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
  },
  open: {
    label: 'Răspuns deschis',
    icon: FileText,
    color: 'text-gray-600 bg-gray-50 border-gray-200',
    rows: 4,
  },
}

// ── Image lightbox ─────────────────────────────────────────────────────────────

function ImageLightbox({ src, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
      >
        <X className="w-6 h-6" />
      </button>
      <img
        src={src}
        alt="Imagine mărită"
        className="max-w-full max-h-full object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

function ExamImage({ src, alt }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div
        className="relative group cursor-zoom-in inline-block"
        onClick={() => setOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-64 rounded-lg border border-gray-200 object-contain block"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
          <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 drop-shadow transition-opacity" />
        </div>
      </div>
      {open && <ImageLightbox src={src} onClose={() => setOpen(false)} />}
    </>
  )
}

// ── Table input (completare_tabel) ─────────────────────────────────────────────

function parseCriteria(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const listItems = lines.filter((l) => /^[-•]\s/.test(l) || /^\d+[.)]\s/.test(l))
  if (listItems.length >= 2) {
    return listItems.map((l) => l.replace(/^[-•]\s+|^\d+[.)]\s+/, '').replace(/:$/, '').trim())
  }
  return []
}

function serializeTable(rows) {
  return rows.filter((r) => r.criteriu || r.valoare).map((r) => `${r.criteriu}: ${r.valoare}`).join('\n')
}

function deserializeTable(value, criteria) {
  if (!value) return criteria.length > 0 ? criteria.map((c) => ({ criteriu: c, valoare: '' })) : [{ criteriu: '', valoare: '' }]
  return value.split('\n').map((line) => {
    const idx = line.indexOf(':')
    if (idx === -1) return { criteriu: '', valoare: line.trim() }
    return { criteriu: line.slice(0, idx).trim(), valoare: line.slice(idx + 1).trim() }
  })
}

function TableInput({ text, value, onChange }) {
  const criteria = parseCriteria(text)
  const [rows, setRows] = useState(() => deserializeTable(value, criteria))

  const updateRow = (i, field, val) => {
    const next = rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r)
    setRows(next)
    onChange(serializeTable(next))
  }
  const addRow = () => {
    const next = [...rows, { criteriu: '', valoare: '' }]
    setRows(next)
    onChange(serializeTable(next))
  }
  const removeRow = (i) => {
    const next = rows.filter((_, idx) => idx !== i)
    setRows(next)
    onChange(serializeTable(next))
  }

  const hasCriteria = criteria.length > 0

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="p-2.5 text-left text-gray-600 font-semibold text-xs uppercase tracking-wide w-2/5">
              Criteriu
            </th>
            <th className="p-2.5 text-left text-gray-600 font-semibold text-xs uppercase tracking-wide">
              Răspuns
            </th>
            {!hasCriteria && <th className="w-8" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 last:border-0">
              <td className="p-1.5 bg-gray-50 align-top">
                {hasCriteria ? (
                  <span className="block px-2 py-1.5 text-gray-700 font-medium">{row.criteriu}</span>
                ) : (
                  <input
                    type="text"
                    value={row.criteriu}
                    onChange={(e) => updateRow(i, 'criteriu', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    placeholder="Criteriu..."
                  />
                )}
              </td>
              <td className="p-1.5 align-top">
                <input
                  type="text"
                  value={row.valoare}
                  onChange={(e) => updateRow(i, 'valoare', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  placeholder="Completează..."
                />
              </td>
              {!hasCriteria && (
                <td className="p-1.5 w-8 align-top">
                  <button
                    onClick={() => removeRow(i)}
                    disabled={rows.length === 1}
                    className="text-gray-300 hover:text-red-400 disabled:opacity-0 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!hasCriteria && (
        <button
          onClick={addRow}
          className="w-full py-2 text-xs text-emerald-600 hover:bg-emerald-50 transition-colors border-t border-gray-100 font-medium"
        >
          + Adaugă rând
        </button>
      )}
    </div>
  )
}

// ── Asociere input ─────────────────────────────────────────────────────────────

function parseColAItems(text) {
  // "Coloana A: item1, item2" or numbered list
  const colMatch = text.match(/coloana\s+A[:\s]+([^;\n.]+)/i)
  if (colMatch) {
    const items = colMatch[1].split(/[,;]/).map((s) => s.trim()).filter((s) => s.length > 1)
    if (items.length >= 2) return items
  }
  const numbered = [...text.matchAll(/^\s*(\d+)[.)]\s+(.+)/gm)].map((m) => m[2].trim())
  if (numbered.length >= 2) return numbered
  return []
}

function serializeAsociere(pairs) {
  return pairs.filter((p) => p.a || p.b).map((p) => `${p.a} - ${p.b}`).join('\n')
}

function deserializeAsociere(value, items) {
  if (!value) {
    if (items.length > 0) return items.map((a) => ({ a, b: '' }))
    return [{ a: '', b: '' }, { a: '', b: '' }]
  }
  return value.split('\n').map((line) => {
    const parts = line.split(' - ')
    return { a: parts[0]?.trim() || '', b: parts.slice(1).join(' - ').trim() || '' }
  })
}

function AsociereInput({ text, value, onChange }) {
  const items = parseColAItems(text)
  const [pairs, setPairs] = useState(() => deserializeAsociere(value, items))
  const hasItems = items.length > 0

  const updatePair = (i, field, val) => {
    const next = pairs.map((p, idx) => idx === i ? { ...p, [field]: val } : p)
    setPairs(next)
    onChange(serializeAsociere(next))
  }
  const addPair = () => {
    const next = [...pairs, { a: '', b: '' }]
    setPairs(next)
    onChange(serializeAsociere(next))
  }
  const removePair = (i) => {
    const next = pairs.filter((_, idx) => idx !== i)
    setPairs(next)
    onChange(serializeAsociere(next))
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">Coloana A</span>
        <span />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">Coloana B</span>
      </div>
      {pairs.map((pair, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto_1fr_auto] gap-2 items-center">
          {hasItems ? (
            <div className="px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-sm text-gray-800 font-medium">
              {pair.a}
            </div>
          ) : (
            <input
              type="text"
              value={pair.a}
              onChange={(e) => updatePair(i, 'a', e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-400"
              placeholder="Element A..."
            />
          )}
          <span className="text-gray-400 font-bold">→</span>
          <input
            type="text"
            value={pair.b}
            onChange={(e) => updatePair(i, 'b', e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-400"
            placeholder="Potrivire din B..."
          />
          {!hasItems && (
            <button
              onClick={() => removePair(i)}
              disabled={pairs.length <= 1}
              className="text-gray-300 hover:text-red-400 disabled:opacity-0 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      {!hasItems && (
        <button
          onClick={addPair}
          className="text-xs text-rose-600 hover:text-rose-700 font-medium transition-colors"
        >
          + Adaugă pereche
        </button>
      )}
    </div>
  )
}

// ── Enumera input ──────────────────────────────────────────────────────────────

function serializeList(items) {
  return items.filter(Boolean).map((item, i) => `${i + 1}. ${item}`).join('\n')
}

function deserializeList(value) {
  if (!value) return ['', '', '']
  return value.split('\n').map((l) => l.replace(/^\d+\.\s*/, '').trim())
}

function EnumeraInput({ value, onChange }) {
  const [items, setItems] = useState(() => deserializeList(value))

  const update = (i, val) => {
    const next = items.map((item, idx) => (idx === i ? val : item))
    setItems(next)
    onChange(serializeList(next))
  }
  const add = () => {
    const next = [...items, '']
    setItems(next)
    onChange(serializeList(next))
  }
  const remove = (i) => {
    const next = items.filter((_, idx) => idx !== i)
    setItems(next)
    onChange(serializeList(next))
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-700 rounded-full text-xs font-bold flex items-center justify-center">
            {i + 1}
          </span>
          <input
            type="text"
            value={item}
            onChange={(e) => update(i, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
            placeholder={`Elementul ${i + 1}...`}
          />
          <button
            onClick={() => remove(i)}
            disabled={items.length <= 1}
            className="text-gray-300 hover:text-red-400 disabled:opacity-0 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
      >
        + Adaugă element
      </button>
    </div>
  )
}

// ── Sub-item card ──────────────────────────────────────────────────────────────

function SubItemCard({ sub, value, onChange }) {
  const meta = TYPE_META[sub.type] || TYPE_META.open
  const Icon = meta.icon

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
        <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-sm min-w-[2.5rem] text-center">
          {sub.ref})
        </span>
        <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.color}`}>
          <Icon className="w-3.5 h-3.5" />
          {meta.label}
        </div>
      </div>

      <div className="p-4">
        {/* Question text */}
        <p className="text-sm text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">{sub.text}</p>

        {/* Images */}
        {sub.images?.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">
              Material de referință ({sub.images.length} {sub.images.length === 1 ? 'imagine' : 'imagini'})
            </p>
            <div className="flex flex-wrap gap-3">
              {sub.images.map((img, i) => (
                <ExamImage key={i} src={img} alt={`Imagine ${i + 1}`} />
              ))}
            </div>
          </div>
        )}

        {/* Type-specific answer input */}
        <div className="mt-2">
          {sub.type === 'completare_tabel' ? (
            <TableInput text={sub.text} value={value} onChange={onChange} />
          ) : sub.type === 'asociere' ? (
            <AsociereInput text={sub.text} value={value} onChange={onChange} />
          ) : sub.type === 'enumera' ? (
            <EnumeraInput value={value} onChange={onChange} />
          ) : (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={meta.rows || 3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-none placeholder-gray-400 transition-colors"
              placeholder={
                sub.type === 'argumentare'
                  ? 'Argumentează răspunsul cu informații biologice...'
                  : sub.type === 'definitie'
                  ? 'Scrie definiția termenului...'
                  : 'Scrie răspunsul tău...'
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main exam page ─────────────────────────────────────────────────────────────

export default function ExamPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [exam, setExam] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getExam(id)
      .then((data) => {
        if (data.completed_at) {
          navigate(`/exams/${id}/results`, { replace: true })
          return
        }
        setExam(data)
        const init = {}
        for (const theme of data.themes) {
          for (const item of theme.items || []) {
            for (const sub of item.sub_items || []) {
              init[sub.ref] = ''
            }
          }
        }
        setAnswers(init)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const setAnswer = useCallback((ref, val) => {
    setAnswers((prev) => ({ ...prev, [ref]: val }))
  }, [])

  const handleSubmit = async () => {
    const list = Object.entries(answers).map(([ref, answer]) => ({ ref, answer }))
    const unanswered = list.filter((a) => !a.answer.trim()).length
    if (unanswered > 0) {
      const ok = window.confirm(
        `Ai ${unanswered} întrebare(i) fără răspuns. Ești sigur că vrei să trimiți?`
      )
      if (!ok) return
    }
    setSubmitting(true)
    try {
      await submitExam(id, list)
      navigate(`/exams/${id}/results`)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (error && !exam) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-red-600" />
        </div>
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    )
  }

  const allRefs = Object.keys(answers)
  const answered = Object.values(answers).filter((a) => a.trim()).length
  const progress = allRefs.length > 0 ? (answered / allRefs.length) * 100 : 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mb-2">
          <BookOpen className="w-4 h-4" />
          {exam?.topic}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Examen de Biologie</h1>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {answered}/{allRefs.length} răspunsuri
          </span>
        </div>
      </div>

      {/* Themes */}
      {exam?.themes.map((theme, tIdx) => (
        <div key={theme.id ?? tIdx} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-shrink-0 bg-emerald-600 text-white text-sm font-bold px-3 py-1 rounded-lg whitespace-nowrap">
              Tema {tIdx + 1}
            </div>
            <div className="flex-1 border-t-2 border-emerald-200" />
            <h2 className="text-sm font-semibold text-gray-600 text-right max-w-xs">
              {theme.title}
            </h2>
          </div>

          {theme.items?.map((item, iIdx) => (
            <div key={item.id ?? iIdx} className="mb-8">
              <div className="flex items-start gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {item.id ?? iIdx + 1}
                </span>
                <div className="flex-1 pt-1">
                  {item.context && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {item.context}
                    </div>
                  )}
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {item.points} {item.points === 1 ? 'punct' : 'puncte'}
                  </span>
                </div>
              </div>

              <div className="pl-11 space-y-4">
                {item.sub_items?.map((sub) => (
                  <SubItemCard
                    key={sub.ref}
                    sub={sub}
                    value={answers[sub.ref] || ''}
                    onChange={(val) => setAnswer(sub.ref, val)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="sticky bottom-4 mt-6">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-200"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Se corectează... (1–2 minute)
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Trimite și corectează
            </>
          )}
        </button>
      </div>
    </div>
  )
}
