'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addEntry(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인 필요' }

  const type = formData.get('type')
  const amount = Number(formData.get('amount'))
  const category = type === 'income' ? 'income' : formData.get('category')
  const note = formData.get('note') || null
  const transacted_at = formData.get('date')

  if (!amount || amount <= 0) return { error: '금액을 확인해주세요.' }

  const { error } = await supabase.from('expenses').insert({
    user_id: user.id,
    type,
    amount: Math.round(amount),
    category,
    note,
    transacted_at,
  })

  if (error) return { error: error.message }
  revalidatePath('/')
  return { ok: true }
}

export async function seedData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인 필요' }

  const categories = ['식사', '카페', '교통', '쇼핑', '기타']
  const avgByCategory = { 식사: 15000, 카페: 6000, 교통: 4000, 쇼핑: 30000, 기타: 8000 }
  const rows = []
  const today = new Date()

  for (let dayOffset = 60; dayOffset >= 1; dayOffset--) {
    const d = new Date(today)
    d.setDate(d.getDate() - dayOffset)
    const dateStr = d.toISOString().split('T')[0]

    const count = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < count; i++) {
      const cat = categories[Math.floor(Math.random() * categories.length)]
      const avg = avgByCategory[cat]
      const isRecent = dayOffset <= 30
      const multiplier = isRecent && (cat === '카페' || cat === '쇼핑')
        ? 1.8 + Math.random() * 0.5
        : 0.7 + Math.random() * 0.6
      const amount = Math.round(avg * multiplier / 100) * 100

      rows.push({
        user_id: user.id,
        type: 'expense',
        amount,
        category: cat,
        note: null,
        transacted_at: dateStr,
      })
    }

    if (d.getDate() === 1) {
      rows.push({
        user_id: user.id,
        type: 'income',
        amount: 3000000,
        category: 'income',
        note: '월급',
        transacted_at: dateStr,
      })
    }
  }

  const { error } = await supabase.from('expenses').insert(rows)
  if (error) return { error: error.message }
  revalidatePath('/')
  return { ok: true, count: rows.length }
}

export async function deleteEntry(id) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인 필요' }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/')
  return { ok: true }
}
