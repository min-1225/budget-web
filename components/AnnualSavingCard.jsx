function formatWon(n) {
  return n.toLocaleString('ko-KR') + '원'
}

export default function AnnualSavingCard({ warnings }) {
  const total = warnings.reduce((sum, w) => sum + w.annualSaving, 0)
  if (total === 0) return null

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-5 shadow">
      <p className="text-sm opacity-80 mb-1">지금처럼 줄이면 1년에 아낄 수 있는 금액</p>
      <p className="text-3xl font-bold">{formatWon(total)}</p>
      <p className="text-xs opacity-70 mt-2">
        {warnings.map(w => `${w.category} ${formatWon(w.annualSaving)}`).join(' · ')}
      </p>
    </div>
  )
}
