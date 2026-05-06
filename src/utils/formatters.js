const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const currencyFormatters = new Map()

function getCurrencyFormatter(currency = 'NGN') {
  const normalizedCurrency = currency || 'NGN'

  if (!currencyFormatters.has(normalizedCurrency)) {
    currencyFormatters.set(
      normalizedCurrency,
      new Intl.NumberFormat(normalizedCurrency === 'NGN' ? 'en-NG' : 'en-US', {
        style: 'currency',
        currency: normalizedCurrency,
        maximumFractionDigits: 0,
      }),
    )
  }

  return currencyFormatters.get(normalizedCurrency)
}

export function formatCurrency(value, currency = 'NGN') {
  return getCurrencyFormatter(currency).format(Number(value || 0))
}

export function formatDate(value) {
  if (!value) {
    return 'TBD'
  }

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
