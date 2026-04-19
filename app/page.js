import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { buildBaselines, detectOverspending } from '@/lib/analysis'
import { signout } from '@/app/login/actions'
import EntryForm from '@/components/EntryForm'
import WarningCards from '@/components/WarningCards'
import AnnualSavingCard from '@/components/AnnualSavingCard'
import SeedButton from '@/components/SeedButton'
import MonthNav from '@/components/MonthNav'
import CategoryChart from '@/components/CategoryChart'
import TransactionList from '@/components/TransactionList'

function formatWon(n) {
  if (n === null) return '...'
  return (n < 0 ? '-' : '') + Math.abs(n).toLocaleString('ko-KR') + '원'
}

export default async function DashboardPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const params = await searchParams
  const selectedMonth = params.month || currentMonth

  const [year, mon] = selectedMonth.split('-').map(Number)
  const monthStart = new Date(year, mon - 1, 1).toISOString().split('T')[0]
  const monthEnd = new Date(year, mon, 0).toISOString().split('T')[0]

  const { data: monthData } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .gte('transacted_at', monthStart)
    .lte('transacted_at', monthEnd)
    .order('transacted_at', { ascending: false })

  const transactions = monthData || []
  const income = transactions.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0)
  const expense = transactions.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0)
  const balance = income - expense

  const categoryTotals = {}
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
  }

  const twoMonthsAgo = new Date(year, mon - 3, 1).toISOString().split('T')[0]
  const { data: prevData } = await supabase
    .from('expenses')
    .select('type, amount, category, transacted_at')
    .eq('user_id', user.id)
    .gte('transacted_at', twoMonthsAgo)
    .lt('transacted_at', monthStart)

  const prevRows = (prevData || []).filter(r => r.type === 'expense')
  const hasBaseline = prevRows.length > 0
  const baselines = hasBaseline ? buildBaselines(prevRows) : {}
  const warnings = hasBaseline ? detectOverspending(categoryTotals, baselines) : []

  const isCurrentMonth = selectedMonth === currentMonth

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">가계부</h1>
          <form action={signout}>
            <button type="submit" className="text-xs text-gray-400 hover:text-gray-600">
              로그아웃
            </button>
          </form>
        </div>

        <MonthNav month={selectedMonth} currentMonth={currentMonth} />

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">잔액</p>
          <p className={`text-4xl font-bold ${balance < 0 ? 'text-red-500' : 'text-gray-900'}`}>
            {formatWon(balance)}
          </p>
          <div className="flex gap-4 mt-2 text-xs text-gray-400">
            <span>수입 +{formatWon(income)}</span>
            <span>지출 -{formatWon(expense)}</span>
          </div>
        </div>

        <AnnualSavingCard warnings={warnings} />

        <WarningCards warnings={warnings} hasBaseline={hasBaseline} />

        <CategoryChart totals={categoryTotals} />

        <TransactionList transactions={transactions} />

        {isCurrentMonth && <EntryForm />}

        {isCurrentMonth && <SeedButton />}
      </div>
    </div>
  )
}
