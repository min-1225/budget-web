'use client'

import { useState } from 'react'
import { seedData } from '@/app/actions'

export default function SeedButton() {
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSeed() {
    setPending(true)
    const result = await seedData()
    setPending(false)
    if (result?.ok) setMessage(`✅ ${result.count}개 데이터 삽입 완료!`)
    else setMessage(result?.error || '오류 발생')
  }

  return (
    <div className="text-center">
      <button
        onClick={handleSeed}
        disabled={pending}
        className="text-xs text-gray-400 hover:text-gray-600 underline disabled:opacity-50"
      >
        {pending ? '삽입 중...' : '데모 데이터 넣기 (60일치)'}
      </button>
      {message && <p className="text-xs text-gray-500 mt-1">{message}</p>}
    </div>
  )
}
