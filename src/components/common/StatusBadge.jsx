const STATUS_CLASS_MAP = {
  confirmed: 'is-confirmed',
  pending: 'is-pending',
  cancelled: 'is-cancelled',
  active: 'is-active',
  checked_in: 'is-active',
  paid: 'is-confirmed',
  completed: 'is-confirmed',
  partial: 'is-pending',
  failed: 'is-cancelled',
  refunded: 'is-neutral',
  available: 'is-confirmed',
  low: 'is-pending',
  sold_out: 'is-cancelled',
  inactive: 'is-neutral',
  closed: 'is-neutral',
}

function StatusBadge({ value }) {
  const normalizedValue = String(value || '').trim().toLowerCase().replace(/\s+/g, '_')
  const className = STATUS_CLASS_MAP[normalizedValue] || 'is-neutral'
  const label = String(value || 'Unknown').replace(/_/g, ' ')

  return <span className={`status-badge ${className}`}>{label}</span>
}

export default StatusBadge
