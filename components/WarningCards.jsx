import { CATEGORY_EMOJI } from '@/lib/categories'

function formatWon(n) {
  return n.toLocaleString('ko-KR') + '원'
}

export default function WarningCards({ warnings, hasBaseline }) {
  if (!hasBaseline) {
    return (
      <div className="bg-blue-50 rounded-2xl p-5 text-center text-sm text-blue-600">
        소비 패턴을 분석 중이에요.<br />
        한 달간 기록하면 맞춤 분석이 시작돼요.
      </div>
    )
  }

  if (warnings.length === 0) {
    return (
      <div className="bg-green-50 rounded-2xl p-5 text-center text-sm text-green-700">
        이번달 과소비 없어요. 잘 하고 있어요! 🎉
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {warnings.map(w => (
        <div key={w.category} className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-red-700">
              {CATEGORY_EMOJI[w.category]} {w.category}
            </span>
            <span className="text-xs text-red-500">
              기준 {formatWon(w.avg)} → 지출 {formatWon(w.spent)}
            </span>
          </div>
          <p className="text-sm text-red-600">
            평균보다 <strong>{formatWon(w.over)}</strong> 더 썼어요.
          </p>
          <p className="text-xs text-red-400 mt-1">
            이 패턴이면 1년에 <strong>{formatWon(w.annualSaving)}</strong> 줄일 수 있어요.
          </p>
        </div>
      ))}
    </div>
  )
}
