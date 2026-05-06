import { useEffect } from 'react'
import { BarChart3, RefreshCw } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import ErrorPanel from '../components/common/ErrorPanel'
import LoadingPanel from '../components/common/LoadingPanel'
import {
  selectReportsError,
  selectReportsSource,
  selectReportsState,
  selectReportsStatus,
} from '../features/reports/reportsSelectors'
import { fetchReportsOverview } from '../features/reports/reportsSlice'
import { formatCurrency, formatDate } from '../utils/formatters'

function ReportsPage() {
  const dispatch = useAppDispatch()
  const { range, summary, bookingTrends, revenueByProvider, customerInsights } =
    useAppSelector(selectReportsState)
  const status = useAppSelector(selectReportsStatus)
  const error = useAppSelector(selectReportsError)
  const source = useAppSelector(selectReportsSource)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchReportsOverview())
    }
  }, [dispatch, status])

  if (status === 'loading' && bookingTrends.length === 0) {
    return <LoadingPanel label="Loading reports" />
  }

  if (status === 'failed') {
    return <ErrorPanel message={error} onRetry={() => dispatch(fetchReportsOverview())} />
  }

  return (
    <div className="d-grid gap-4 fade-in-up">
      <section className="row g-3">
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Revenue</p>
              <h2 className="summary-value">{formatCurrency(summary.revenue, 'NGN')}</h2>
              <p className="summary-subtext">Completed payment value in the selected window.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Bookings</p>
              <h2 className="summary-value">{summary.bookings}</h2>
              <p className="summary-subtext">{summary.pendingBookings} still pending.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Customers</p>
              <h2 className="summary-value">{summary.customers}</h2>
              <p className="summary-subtext">Tracked guest accounts in the platform.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Occupancy</p>
              <h2 className="summary-value">{summary.occupancyRate}%</h2>
              <p className="summary-subtext">
                Source: {source === 'mock' ? 'local fallback data' : 'connected API'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="work-card card">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <div>
              <p className="mb-1 text-muted-soft fw-semibold">Performance window</p>
              <h2 className="h4 mb-0 fw-bold">
                {range.from && range.to
                  ? `${formatDate(range.from)} to ${formatDate(range.to)}`
                  : 'Current reporting period'}
              </h2>
            </div>

            <button
              className="btn btn-ghost-dark rounded-pill px-3"
              onClick={() => dispatch(fetchReportsOverview())}
              type="button"
            >
              <RefreshCw size={16} />
              <span className="ms-2">Refresh</span>
            </button>
          </div>

          <div className="row g-3">
            <div className="col-xl-7">
              <div className="table-responsive">
                <table className="table booking-table align-middle">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Bookings</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingTrends.map((entry) => (
                      <tr key={entry.date}>
                        <td>{formatDate(entry.date)}</td>
                        <td className="fw-bold">{entry.bookings}</td>
                        <td className="fw-bold">{formatCurrency(entry.revenue, 'NGN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {bookingTrends.length === 0 ? (
                <div className="empty-state empty-state-compact mt-3">
                  <p className="mb-1 fw-bold">No booking trend data yet</p>
                  <p className="mb-0 text-muted-soft">
                    Completed bookings in the selected range will show up here.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="col-xl-5">
              <div className="d-grid gap-3">
                {revenueByProvider.map((provider) => (
                  <div className="preference-tile" key={provider.provider}>
                    <div className="d-flex align-items-center justify-content-between gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <BarChart3 size={18} className="text-orange" />
                        <strong className="text-capitalize">{provider.provider}</strong>
                      </div>
                      <span className="fw-bold">
                        {formatCurrency(provider.totalAmount, 'NGN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="work-card card">
        <div className="card-body p-4">
          <div className="mb-3">
            <p className="mb-1 text-muted-soft fw-semibold">Top customers</p>
            <h2 className="h4 mb-0 fw-bold">Customer insights</h2>
          </div>

          <div className="table-responsive">
            <table className="table booking-table align-middle">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Bookings</th>
                  <th>Lifetime value</th>
                </tr>
              </thead>
              <tbody>
                {customerInsights.map((customer) => (
                  <tr key={customer.id}>
                    <td className="fw-bold">{customer.name}</td>
                    <td>
                      <div>{customer.email}</div>
                      <small className="text-muted-soft">{customer.phone}</small>
                    </td>
                    <td className="fw-bold">{customer.bookingsCount}</td>
                    <td className="fw-bold">{formatCurrency(customer.lifetimeValue, 'NGN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {customerInsights.length === 0 ? (
            <div className="empty-state empty-state-compact">
              <p className="mb-1 fw-bold">No customer insight data yet</p>
              <p className="mb-0 text-muted-soft">
                Once guests start booking, the most valuable relationships will surface here.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}

export default ReportsPage
