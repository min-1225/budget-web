import { CATEGORY_EMOJI } from '@/lib/categories'

const COLORS = {
  '식사': 'bg-orange-400',
  '카페': 'bg-yellow-400',
  '교통': 'bg-green-400',
  '쇼핑': 'bg-purple-400',
  '기타': 'bg-gray-400',
}

function formatWon(n) {
  return n.toLocaleString('ko-KR') + '원'
}

export default function CategoryChart({ totals }) {
  const entries = Object.entries(totals).sort(([, a], [, b]) => b - a)
  if (entries.length === 0) return null

  const max = entries[0][1]

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
      <h2 className="text-sm font-semibold text-gray-700">카테고리별 지출</h2>
      {entries.map(([cat, amount]) => (
        <div key={cat}>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{CATEGORY_EMOJI[cat]} {cat}</span>
            <span className="font-medium">{formatWon(amount)}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${COLORS[cat] || 'bg-blue-400'}`}
              style={{ width: `${(amount / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
