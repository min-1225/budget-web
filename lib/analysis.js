export function buildBaselines(rows) {
  const byCategory = {}

  for (const row of rows) {
    if (!byCategory[row.category]) byCategory[row.category] = {}
    const month = row.transacted_at.slice(0, 7)
    byCategory[row.category][month] =
      (byCategory[row.category][month] || 0) + row.amount
  }

  const baselines = {}
  for (const [cat, monthMap] of Object.entries(byCategory)) {
    const values = Object.values(monthMap)
    if (values.length === 0) continue
    const avg = values.reduce((s, v) => s + v, 0) / values.length
    const variance = values.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / values.length
    const stddev = Math.sqrt(variance)
    const threshold = stddev > 0 ? avg + 1.5 * stddev : avg * 1.3
    baselines[cat] = {
      avg: Math.round(avg),
      stddev: Math.round(stddev),
      threshold: Math.round(threshold),
    }
  }

  return baselines
}

export function detectOverspending(thisMonthTotals, baselines) {
  const warnings = []
  for (const [cat, spent] of Object.entries(thisMonthTotals)) {
    const baseline = baselines[cat]
    if (!baseline) continue
    if (spent > baseline.threshold) {
      const over = spent - Math.round(baseline.avg)
      warnings.push({
        category: cat,
        spent,
        threshold: baseline.threshold,
        avg: baseline.avg,
        over,
        annualSaving: over * 12,
      })
    }
  }
  return warnings
}

export function calcThisMonthTotals(rows) {
  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const totals = {}
  for (const row of rows) {
    if (row.transacted_at.slice(0, 7) !== thisMonth) continue
    if (row.type !== 'expense') continue
    totals[row.category] = (totals[row.category] || 0) + row.amount
  }
  return totals
}
