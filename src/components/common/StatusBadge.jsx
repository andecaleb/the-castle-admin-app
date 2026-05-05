const STATUS_CLASS_MAP = {
  confirmed: 'is-confirmed',
  pending: 'is-pending',
  cancelled: 'is-cancelled',
  checked_in: 'is-active',
  paid: 'is-confirmed',
  partial: 'is-pending',
}

function StatusBadge({ value }) {
  const normalizedValue = String(value || '').trim().toLowerCase().replace(/\s+/g, '_')
  const className = STATUS_CLASS_MAP[normalizedValue] || 'is-neutral'
  const label = String(value || 'Unknown').replace(/_/g, ' ')

  return <span className={`status-badge ${className}`}>{label}</span>
}

export default StatusBadge
