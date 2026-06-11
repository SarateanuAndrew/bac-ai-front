export default function LoadingSpinner({ text = 'Se încarcă...' }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  )
}
