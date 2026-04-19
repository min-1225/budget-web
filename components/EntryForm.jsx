'use client'

import { useState } from 'react'
import { addEntry } from '@/app/actions'
import { EXPENSE_CATEGORIES, CATEGORY_EMOJI } from '@/lib/categories'

export default function EntryForm() {
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('식사')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setPending(true)
    setError('')
    const formData = new FormData(e.target)
    formData.set('type', type)
    formData.set('category', category)
    const result = await addEntry(formData)
    setPending(false)
    if (result?.error) {
      setError(result.error)
    } else {
      e.target.reset()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex rounded-lg overflow-hidden border">
        {['expense', 'income'].map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`flex-1 py-2 text-sm font-medium ${
              type === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
            }`}
          >
            {t === 'expense' ? '지출' : '수입'}
          </button>
        ))}
      </div>

      {type === 'expense' && (
        <div className="flex gap-2 flex-wrap">
          {EXPENSE_CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm border ${
                category === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-gray-600 border-gray-300'
              }`}
            >
              {CATEGORY_EMOJI[cat]} {cat}
            </button>
          ))}
        </div>
      )}

      <input
        name="amount"
        type="number"
        placeholder="금액 (원)"
        required
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="date"
        type="date"
        defaultValue={new Date().toISOString().split('T')[0]}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="note"
        type="text"
        placeholder="메모 (선택)"
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? '저장 중...' : '기록하기'}
      </button>
    </form>
  )
}
