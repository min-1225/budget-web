'use client'

import { useState } from 'react'
import { deleteEntry } from '@/app/actions'
import { CATEGORY_EMOJI } from '@/lib/categories'

function formatWon(n) {
  return n.toLocaleString('ko-KR') + '원'
}

export default function TransactionList({ transactions }) {
  const [deletingId, setDeletingId] = useState(null)

  async function handleDelete(id) {
    setDeletingId(id)
    await deleteEntry(id)
    setDeletingId(null)
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 text-center text-sm text-gray-400">
        이 달의 기록이 없어요.
      </div>
    )
  }

  const grouped = {}
  for (const t of transactions) {
    if (!grouped[t.transacted_at]) grouped[t.transacted_at] = []
    grouped[t.transacted_at].push(t)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <h2 className="px-5 py-3 text-sm font-semibold text-gray-700 border-b">내역</h2>
      {Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, items]) => (
          <div key={date}>
            <div className="px-5 py-2 bg-gray-50 text-xs text-gray-400">{date}</div>
            {items.map(item => (
              <div key={item.id} className="flex items-center px-5 py-3 border-b last:border-0">
                <span className="text-lg mr-3">
                  {item.type === 'income' ? '💰' : (CATEGORY_EMOJI[item.category] || '📦')}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    {item.type === 'income' ? '수입' : item.category}
                  </p>
                  {item.note && (
                    <p className="text-xs text-gray-400 truncate">{item.note}</p>
                  )}
                </div>
                <span className={`text-sm font-semibold mr-3 ${
                  item.type === 'income' ? 'text-blue-600' : 'text-gray-800'
                }`}>
                  {item.type === 'income' ? '+' : '-'}{formatWon(item.amount)}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="text-gray-300 hover:text-red-400 text-sm disabled:opacity-50 transition-colors"
                >
                  {deletingId === item.id ? '…' : '✕'}
                </button>
              </div>
            ))}
          </div>
        ))}
    </div>
  )
}
