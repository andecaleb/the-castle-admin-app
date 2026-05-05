import { useEffect } from 'react'
import {
  ShieldCheck,
  ShoppingBag,
  UsersRound,
  WalletCards,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import ErrorPanel from '../components/common/ErrorPanel'
import LoadingPanel from '../components/common/LoadingPanel'
import StatusBadge from '../components/common/StatusBadge'
import {
  selectDashboardError,
  selectDashboardSource,
  selectDashboardState,
  selectDashboardStatus,
} from '../features/dashboard/dashboardSelectors'
import { fetchDashboardOverview } from '../features/dashboard/dashboardSlice'

const METRIC_ICON_MAP = {
  wallet: WalletCards,
  shopping: ShoppingBag,
  users: UsersRound,
  shield: ShieldCheck,
}

function DashboardPage() {
  const dispatch = useAppDispatch()
  const { hero, metrics, revenueSeries, tasks, recentBookings } =
    useAppSelector(selectDashboardState)
  const status = useAppSelector(selectDashboardStatus)
  const error = useAppSelector(selectDashboardError)
  const source = useAppSelector(selectDashboardSource)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDashboardOverview())
    }
  }, [dispatch, status])

  if (status === 'loading' && !hero) {
    return <LoadingPanel label="Loading dashboard" />
  }

  if (status === 'failed') {
    return <ErrorPanel message={error} onRetry={() => dispatch(fetchDashboardOverview())} />
  }

  return (
    <div className="d-grid gap-4 fade-in-up">
      <section className="hero-panel card position-relative">
        <div className="card-body p-4 p-lg-5 position-relative z-1">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span className="badge rounded-pill gold-pill">{hero?.badge}</span>
                <span className="source-pill">
                  {source === 'mock' ? 'Mock fallback active' : 'Connected API'}
                </span>
              </div>
              <h2 className="display-6 fw-bold mb-3">{hero?.title}</h2>
              <p className="text-white-50 mb-4 max-w-2xl">{hero?.description}</p>
              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-gold rounded-pill px-4" type="button">
                  New booking
                </button>
                <button className="btn btn-outline-light rounded-pill px-4" type="button">
                  Export report
                </button>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="row g-3">
                <div className="col-6">
                  <div className="rounded-4 p-3 bg-white bg-opacity-10">
                    <p className="mb-1 text-white-50">Occupancy</p>
                    <strong className="fs-3">{hero?.occupancy}</strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="rounded-4 p-3 bg-white bg-opacity-10">
                    <p className="mb-1 text-white-50">Today</p>
                    <strong className="fs-3">{hero?.arrivalsToday}</strong>
                  </div>
                </div>
                <div className="col-12">
                  <div className="rounded-4 p-3 bg-white bg-opacity-10">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-white-50">Monthly target</span>
                      <strong>{hero?.monthlyTarget}%</strong>
                    </div>
                    <div className="progress bg-black bg-opacity-25" style={{ height: 8 }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${hero?.monthlyTarget || 0}%`,
                          background: 'linear-gradient(90deg, #d4af37, #f47b20)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="row g-3 g-xl-4">
        {metrics.map((metric) => {
          const Icon = METRIC_ICON_MAP[metric.iconKey] || WalletCards

          return (
            <div className="col-sm-6 col-xl-3" key={metric.id}>
              <div className="metric-card card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className={`metric-icon ${metric.tone}`}>
                      <Icon size={21} />
                    </div>
                    <span
                      className={`small fw-bold ${
                        metric.change.includes('+') ? 'trend-up' : 'trend-warn'
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                  <p className="text-muted-soft mb-1 fw-semibold">{metric.label}</p>
                  <h3 className="mb-0 fw-bold">{metric.displayValue}</h3>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <section className="row g-3 g-xl-4">
        <div className="col-xl-8">
          <div className="work-card card h-100">
            <div className="card-body p-4">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                  <p className="mb-1 text-muted-soft fw-semibold">Performance</p>
                  <h2 className="h4 mb-0 fw-bold">Weekly revenue flow</h2>
                </div>
                <div className="btn-group" role="group" aria-label="Chart range">
                  <button className="btn btn-sm btn-dark" type="button">
                    Week
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" type="button">
                    Month
                  </button>
                </div>
              </div>

              <div className="chart-bar d-flex align-items-end gap-3">
                {revenueSeries.map((entry) => (
                  <div className="d-flex flex-column justify-content-end gap-2 w-100" key={entry.day}>
                    <div
                      className={`bar ${entry.muted ? 'muted' : ''}`}
                      style={{ height: `${entry.value}%` }}
                    />
                    <span className="chart-label">{entry.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="work-card card h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <p className="mb-1 text-muted-soft fw-semibold">Queue</p>
                  <h2 className="h4 mb-0 fw-bold">Daily tasks</h2>
                </div>
                <span className="badge rounded-pill text-bg-dark">{tasks.length} open</span>
              </div>

              <div className="d-grid gap-3">
                {tasks.map((task) => (
                  <div className="task-item" key={task.id}>
                    <div className="d-flex justify-content-between gap-3 mb-2">
                      <strong>{task.label}</strong>
                      <span className="small text-muted-soft">{task.time}</span>
                    </div>
                    <div className="progress" style={{ height: 7 }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${task.progress}%`,
                          background: 'linear-gradient(90deg, #d4af37, #f47b20)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="work-card card">
            <div className="card-body p-4">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                <div>
                  <p className="mb-1 text-muted-soft fw-semibold">Bookings</p>
                  <h2 className="h4 mb-0 fw-bold">Recent activity</h2>
                </div>
                <button className="btn btn-gold rounded-pill px-4" type="button">
                  View all
                </button>
              </div>

              <div className="table-responsive">
                <table className="table booking-table align-middle">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <div className="fw-bold">{booking.customer}</div>
                          <small className="text-muted-soft">{booking.subtext}</small>
                        </td>
                        <td>{booking.service}</td>
                        <td className="fw-bold">{booking.value}</td>
                        <td>
                          <StatusBadge value={booking.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
