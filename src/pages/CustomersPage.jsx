import { startTransition, useDeferredValue, useEffect } from 'react'
import { RefreshCw, Search, UsersRound } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import ErrorPanel from '../components/common/ErrorPanel'
import LoadingPanel from '../components/common/LoadingPanel'
import {
  selectCustomersError,
  selectCustomersFilters,
  selectCustomersSource,
  selectCustomersState,
  selectCustomersStatus,
  selectCustomersSummary,
  selectVisibleCustomers,
} from '../features/customers/customersSelectors'
import {
  fetchCustomers,
  setCustomerSearchTerm,
  setCustomerSortBy,
} from '../features/customers/customersSlice'
import { formatCurrency, formatDate } from '../utils/formatters'

function CustomersPage() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectCustomersFilters)
  const customersStatus = useAppSelector(selectCustomersStatus)
  const error = useAppSelector(selectCustomersError)
  const source = useAppSelector(selectCustomersSource)
  const summary = useAppSelector(selectCustomersSummary)
  const { pagination } = useAppSelector(selectCustomersState)
  const deferredSearch = useDeferredValue(filters.searchTerm)
  const customers = useAppSelector((state) => selectVisibleCustomers(state, deferredSearch))

  useEffect(() => {
    if (customersStatus === 'idle') {
      dispatch(fetchCustomers())
    }
  }, [customersStatus, dispatch])

  const handleSearchChange = (event) => {
    const { value } = event.target

    startTransition(() => {
      dispatch(setCustomerSearchTerm(value))
    })
  }

  if (customersStatus === 'loading' && customers.length === 0) {
    return <LoadingPanel label="Loading customers" />
  }

  if (customersStatus === 'failed') {
    return <ErrorPanel message={error} onRetry={() => dispatch(fetchCustomers())} />
  }

  return (
    <div className="d-grid gap-4 fade-in-up">
      <section className="row g-3">
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Total customers</p>
              <h2 className="summary-value">{summary.totalCustomers}</h2>
              <p className="summary-subtext">Guest records available to the admin team.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Active customers</p>
              <h2 className="summary-value">{summary.activeCustomers}</h2>
              <p className="summary-subtext">Guests with at least one booking on file.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Lifetime revenue</p>
              <h2 className="summary-value">{formatCurrency(summary.lifetimeRevenue, 'NGN')}</h2>
              <p className="summary-subtext">
                Source: {source === 'mock' ? 'local fallback data' : 'connected API'}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">New this month</p>
              <h2 className="summary-value">{summary.newThisMonth}</h2>
              <p className="summary-subtext">Recently added guest profiles this month.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="work-card card">
        <div className="card-body p-4">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="mb-1 text-muted-soft fw-semibold">Guest relationships</p>
                <h2 className="h4 mb-0 fw-bold">Customer ledger</h2>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-ghost-dark rounded-pill px-3"
                  onClick={() => dispatch(fetchCustomers())}
                  type="button"
                >
                  <RefreshCw size={16} />
                  <span className="ms-2">Refresh</span>
                </button>
              </div>
            </div>

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
              <small className="text-muted-soft">
                {pagination?.total || customers.length} customer records loaded.
              </small>
              <small className="text-muted-soft">
                Ranked by revenue, bookings, or name depending on your view.
              </small>
            </div>

            <div className="toolbar-grid">
              <label className="table-search-control">
                <Search size={18} className="text-muted-soft" />
                <input
                  onChange={handleSearchChange}
                  placeholder="Search customer name, email, or phone"
                  type="search"
                  value={filters.searchTerm}
                />
              </label>

              <div className="table-search-control">
                <UsersRound size={18} className="text-muted-soft" />
                <span className="fw-semibold">{summary.activeCustomers} active guests</span>
              </div>

              <select
                className="table-filter-select"
                onChange={(event) => dispatch(setCustomerSortBy(event.target.value))}
                value={filters.sortBy}
              >
                <option value="value-desc">Revenue: high to low</option>
                <option value="bookings-desc">Bookings: high to low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            <div className="table-responsive">
              <table className="table booking-table align-middle">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Bookings</th>
                    <th>Lifetime value</th>
                    <th>Last booking</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="fw-bold">{customer.name}</div>
                        <small className="text-muted-soft">Joined {formatDate(customer.createdAt)}</small>
                      </td>
                      <td>
                        <div>{customer.email}</div>
                        <small className="text-muted-soft">{customer.phone}</small>
                      </td>
                      <td className="fw-bold">{customer.bookingsCount}</td>
                      <td className="fw-bold">
                        {formatCurrency(customer.bookingsTotalAmount, 'NGN')}
                      </td>
                      <td>
                        {customer.lastBookingAt ? (
                          <span>{formatDate(customer.lastBookingAt)}</span>
                        ) : (
                          <span className="text-muted-soft">No bookings yet</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {customers.length === 0 ? (
              <div className="empty-state">
                <p className="mb-1 fw-bold">No customers match this view</p>
                <p className="mb-0 text-muted-soft">
                  Try clearing the search or refreshing the customer ledger.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}

export default CustomersPage
