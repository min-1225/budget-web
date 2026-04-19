'use client'

import { useRouter } from 'next/navigation'

export default function MonthNav({ month, currentMonth }) {
  const router = useRouter()

  function navigate(delta) {
    const [year, mon] = month.split('-').map(Number)
    const d = new Date(year, mon - 1 + delta, 1)
    const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    router.push(`/?month=${next}`)
  }

  const label = new Date(month + '-02').toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  })

  const isCurrentMonth = month === currentMonth

  return (
    <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-3 shadow-sm">
      <button
        onClick={() => navigate(-1)}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 font-bold"
      >
        ←
      </button>
      <span className="text-sm font-semibold text-gray-800">{label}</span>
      <button
        onClick={() => navigate(1)}
        disabled={isCurrentMonth}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 font-bold disabled:opacity-20 disabled:cursor-not-allowed"
      >
        →
      </button>
    </div>
  )
}
