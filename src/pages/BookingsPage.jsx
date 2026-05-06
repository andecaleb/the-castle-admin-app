import { startTransition, useDeferredValue, useEffect } from 'react'
import { CalendarRange, LayoutDashboard, RefreshCw, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import ErrorPanel from '../components/common/ErrorPanel'
import LoadingPanel from '../components/common/LoadingPanel'
import StatusBadge from '../components/common/StatusBadge'
import {
  selectBookingStatuses,
  selectBookingSummary,
  selectBookingsError,
  selectBookingsFilters,
  selectBookingsState,
  selectBookingsSource,
  selectBookingsStatus,
  selectVisibleBookings,
} from '../features/bookings/bookingsSelectors'
import {
  fetchBookings,
  setSearchTerm,
  setSortBy,
  setStatusFilter,
} from '../features/bookings/bookingsSlice'
import { formatCurrency, formatDateRange } from '../utils/formatters'

function BookingsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const filters = useAppSelector(selectBookingsFilters)
  const bookingStatus = useAppSelector(selectBookingsStatus)
  const error = useAppSelector(selectBookingsError)
  const source = useAppSelector(selectBookingsSource)
  const { pagination } = useAppSelector(selectBookingsState)
  const summary = useAppSelector(selectBookingSummary)
  const statusOptions = useAppSelector(selectBookingStatuses)
  const deferredSearch = useDeferredValue(filters.searchTerm)
  const bookings = useAppSelector((state) => selectVisibleBookings(state, deferredSearch))

  useEffect(() => {
    if (bookingStatus === 'idle') {
      dispatch(fetchBookings())
    }
  }, [bookingStatus, dispatch])

  const handleSearchChange = (event) => {
    const { value } = event.target

    startTransition(() => {
      dispatch(setSearchTerm(value))
    })
  }

  if (bookingStatus === 'loading' && bookings.length === 0) {
    return <LoadingPanel label="Loading bookings" />
  }

  if (bookingStatus === 'failed') {
    return <ErrorPanel message={error} onRetry={() => dispatch(fetchBookings())} />
  }

  return (
    <div className="d-grid gap-4 fade-in-up">
      <section className="row g-3">
        <div className="col-md-4">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Total bookings</p>
              <h2 className="summary-value">{summary.total}</h2>
              <p className="summary-subtext">All active reservation records.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Confirmed stays</p>
              <h2 className="summary-value">{summary.confirmed}</h2>
              <p className="summary-subtext">Guests cleared and ready to arrive.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Booked revenue</p>
              <h2 className="summary-value">
                {formatCurrency(summary.totalRevenue, summary.currency)}
              </h2>
              <p className="summary-subtext">
                Source: {source === 'mock' ? 'local fallback data' : 'connected API'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="work-card card">
        <div className="card-body p-4">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="mb-1 text-muted-soft fw-semibold">Reservation queue</p>
                <h2 className="h4 mb-0 fw-bold">Booking ledger</h2>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-ghost-dark rounded-pill px-3"
                  onClick={() => dispatch(fetchBookings())}
                  type="button"
                >
                  <RefreshCw size={16} />
                  <span className="ms-2">Refresh</span>
                </button>
                <button
                  className="btn btn-gold rounded-pill px-3"
                  onClick={() => navigate('/')}
                  type="button"
                >
                  <LayoutDashboard size={16} />
                  <span className="ms-2">Back to dashboard</span>
                </button>
              </div>
            </div>

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
              <small className="text-muted-soft">
                {pagination?.total || bookings.length} booking records loaded for this view.
              </small>
              <small className="text-muted-soft">
                {summary.pending} pending • {summary.confirmed} confirmed
              </small>
            </div>

            <div className="toolbar-grid">
              <label className="table-search-control">
                <Search size={18} className="text-muted-soft" />
                <input
                  onChange={handleSearchChange}
                  placeholder="Search guest, email, service, or source"
                  type="search"
                  value={filters.searchTerm}
                />
              </label>

              <select
                className="table-filter-select"
                onChange={(event) => dispatch(setStatusFilter(event.target.value))}
                value={filters.status}
              >
                {statusOptions.map((option) => (
                  <option key={option.label} value={option.label}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>

              <select
                className="table-filter-select"
                onChange={(event) => dispatch(setSortBy(event.target.value))}
                value={filters.sortBy}
              >
                <option value="checkin-asc">Check-in: earliest</option>
                <option value="checkin-desc">Check-in: latest</option>
                <option value="amount-desc">Amount: high to low</option>
                <option value="amount-asc">Amount: low to high</option>
              </select>
            </div>

            <div className="table-responsive">
              <table className="table booking-table align-middle">
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Guest</th>
                    <th>Stay</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <div className="fw-bold">{booking.id}</div>
                        <small className="text-muted-soft">{booking.source}</small>
                      </td>
                      <td>
                        <div className="fw-bold">{booking.guestName}</div>
                        <small className="text-muted-soft">{booking.email}</small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2 fw-semibold">
                          <CalendarRange size={16} className="text-orange" />
                          <span>{formatDateRange(booking.checkIn, booking.checkOut)}</span>
                        </div>
                        <small className="text-muted-soft">
                          {booking.service} | {booking.guests} guests
                        </small>
                      </td>
                      <td className="fw-bold">
                        {formatCurrency(booking.total, booking.currency)}
                      </td>
                      <td>
                        <StatusBadge value={booking.paymentStatus} />
                      </td>
                      <td>
                        <StatusBadge value={booking.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {bookings.length === 0 ? (
              <div className="empty-state">
                <p className="mb-1 fw-bold">No bookings match these filters</p>
                <p className="mb-0 text-muted-soft">
                  Try widening the search or switching the status view.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}

export default BookingsPage
