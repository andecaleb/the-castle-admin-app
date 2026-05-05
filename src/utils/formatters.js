const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value || 0))
}

export function formatDate(value) {
  return dateFormatter.format(new Date(value))
}

export function formatDateRange(start, end) {
  const startLabel = formatDate(start)
  const endLabel = formatDate(end)

  if (startLabel === endLabel) {
    return startLabel
  }

  return `${startLabel} - ${endLabel}`
}
