import {
  Bell,
  CalendarDays,
  Crown,
  LayoutDashboard,
  LineChart,
  PackageCheck,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  UsersRound,
  WalletCards,
} from 'lucide-react'
import './App.css'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Bookings', icon: CalendarDays },
  { label: 'Customers', icon: UsersRound },
  { label: 'Inventory', icon: PackageCheck },
  { label: 'Reports', icon: LineChart },
  { label: 'Settings', icon: Settings },
]

const metrics = [
  {
    label: 'Revenue',
    value: '$128.4k',
    change: '+18.2%',
    tone: '',
    icon: WalletCards,
  },
  {
    label: 'Orders',
    value: '1,482',
    change: '+9.6%',
    tone: 'orange',
    icon: ShoppingBag,
  },
  {
    label: 'Clients',
    value: '824',
    change: '+12.1%',
    tone: 'grey',
    icon: UsersRound,
  },
  {
    label: 'Security',
    value: '99.9%',
    change: 'Stable',
    tone: 'dark',
    icon: ShieldCheck,
  },
]

const bookings = [
  {
    customer: 'Ava Thompson',
    item: 'Royal Suite',
    value: '$1,420',
    status: 'Confirmed',
    color: '#16a34a',
  },
  {
    customer: 'Liam Carter',
    item: 'Gold Hall',
    value: '$3,180',
    status: 'Pending',
    color: '#f47b20',
  },
  {
    customer: 'Mia Brooks',
    item: 'Private Dining',
    value: '$760',
    status: 'Confirmed',
    color: '#16a34a',
  },
]

const tasks = [
  { label: 'Approve supplier invoice', time: '10:30 AM', progress: 86 },
  { label: 'Review VIP arrivals', time: '1:00 PM', progress: 64 },
  { label: 'Update monthly forecast', time: '4:45 PM', progress: 42 },
]

const chart = [64, 42, 78, 55, 88, 68, 94]

function App() {
  return (
    <div className="admin-shell d-flex">
      <aside className="sidebar p-4 d-flex flex-column gap-4">
        <div className="d-flex align-items-center gap-3">
          <div className="brand-mark">
            <Crown size={24} strokeWidth={2.4} />
          </div>
          <div>
            <p className="mb-0 fw-bold fs-5">Castle Admin</p>
            <small className="text-white-50">Control center</small>
          </div>
        </div>

        <nav className="sidebar-nav d-grid gap-2">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <a
                className={`nav-button d-flex align-items-center gap-3 text-decoration-none ${
                  item.active ? 'active' : ''
                }`}
                href="/"
                key={item.label}
              >
                <Icon size={19} />
                <span className="fw-semibold">{item.label}</span>
              </a>
            )
          })}
        </nav>

        <div className="mt-auto rounded-4 p-3 bg-white bg-opacity-10">
          <p className="mb-1 fw-bold">Gold tier</p>
          <small className="text-white-50">
            24 properties synced across the network.
          </small>
        </div>
      </aside>

      <main className="main-panel flex-grow-1">
        <header className="topbar sticky-top px-3 px-lg-4 py-3">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <p className="mb-1 text-muted-soft fw-semibold">Overview</p>
              <h1 className="h3 mb-0 fw-bold">Admin Dashboard</h1>
            </div>

            <div className="topbar-actions d-flex flex-wrap align-items-center gap-3">
              <div className="search-control input-group">
                <span className="input-group-text border-0 bg-transparent ps-3">
                  <Search size={18} className="text-muted-soft" />
                </span>
                <input
                  className="form-control border-0 bg-transparent"
                  placeholder="Search records"
                  type="search"
                />
              </div>
              <button className="btn btn-ghost-dark rounded-pill" type="button">
                <Bell size={18} />
              </button>
              <div className="avatar">TC</div>
            </div>
          </div>
        </header>

        <div className="container-fluid p-3 p-lg-4">
          <section className="hero-panel card position-relative mb-4">
            <div className="card-body p-4 p-lg-5 position-relative z-1">
              <div className="row align-items-center g-4">
                <div className="col-lg-7">
                  <span className="badge rounded-pill gold-pill mb-3">
                    Live operations
                  </span>
                  <h2 className="display-6 fw-bold mb-3">
                    Keep every castle operation sharp, simple, and profitable.
                  </h2>
                  <p className="text-white-50 mb-4 max-w-2xl">
                    Monitor bookings, revenue, guests, and daily work from one
                    calm command surface.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <button className="btn btn-gold rounded-pill px-4" type="button">
                      New booking
                    </button>
                    <button
                      className="btn btn-outline-light rounded-pill px-4"
                      type="button"
                    >
                      Export report
                    </button>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="rounded-4 p-3 bg-white bg-opacity-10">
                        <p className="mb-1 text-white-50">Occupancy</p>
                        <strong className="fs-3">82%</strong>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="rounded-4 p-3 bg-white bg-opacity-10">
                        <p className="mb-1 text-white-50">Today</p>
                        <strong className="fs-3">46</strong>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="rounded-4 p-3 bg-white bg-opacity-10">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-white-50">Monthly target</span>
                          <strong>74%</strong>
                        </div>
                        <div className="progress bg-black bg-opacity-25" style={{ height: 8 }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: '74%',
                              background:
                                'linear-gradient(90deg, #d4af37, #f47b20)',
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

          <section className="row g-3 g-xl-4 mb-4">
            {metrics.map((metric) => {
              const Icon = metric.icon

              return (
                <div className="col-sm-6 col-xl-3" key={metric.label}>
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
                      <p className="text-muted-soft mb-1 fw-semibold">
                        {metric.label}
                      </p>
                      <h3 className="mb-0 fw-bold">{metric.value}</h3>
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
                      <p className="mb-1 text-muted-soft fw-semibold">
                        Performance
                      </p>
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
                    {chart.map((height, index) => (
                      <div
                        className={`bar ${index === 1 || index === 3 ? 'muted' : ''}`}
                        key={height}
                        style={{ height: `${height}%` }}
                      />
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
                    <span className="badge rounded-pill text-bg-dark">3 open</span>
                  </div>

                  <div className="d-grid gap-3">
                    {tasks.map((task) => (
                      <div className="task-item" key={task.label}>
                        <div className="d-flex justify-content-between gap-3 mb-2">
                          <strong>{task.label}</strong>
                          <span className="small text-muted-soft">{task.time}</span>
                        </div>
                        <div className="progress" style={{ height: 7 }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${task.progress}%`,
                              background:
                                'linear-gradient(90deg, #d4af37, #f47b20)',
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
                        {bookings.map((booking) => (
                          <tr key={booking.customer}>
                            <td>
                              <div className="fw-bold">{booking.customer}</div>
                              <small className="text-muted-soft">Castle member</small>
                            </td>
                            <td>{booking.item}</td>
                            <td className="fw-bold">{booking.value}</td>
                            <td>
                              <span className="d-inline-flex align-items-center gap-2 fw-semibold">
                                <span
                                  className="status-dot"
                                  style={{ background: booking.color }}
                                />
                                {booking.status}
                              </span>
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
      </main>
    </div>
  )
}

export default App
