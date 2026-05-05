import { Bell, Clock3 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { FALLBACK_PAGE_META, NAV_ITEMS } from '../../config/navigation'

function AppHeader() {
  const location = useLocation()
  const currentPage =
    NAV_ITEMS.find((item) => item.path === location.pathname) || FALLBACK_PAGE_META

  return (
    <header className="topbar sticky-top px-3 px-lg-4 py-3">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <p className="mb-1 text-muted-soft fw-semibold">{currentPage.eyebrow}</p>
          <h1 className="h3 mb-1 fw-bold">{currentPage.title}</h1>
          <p className="mb-0 text-muted-soft">{currentPage.description}</p>
        </div>

        <div className="topbar-actions d-flex flex-wrap align-items-center gap-3">
          <div className="sync-pill">
            <Clock3 size={16} />
            <span>Auto sync enabled</span>
          </div>
          <button className="btn btn-ghost-dark rounded-pill" type="button">
            <Bell size={18} />
          </button>
          <div className="avatar">TC</div>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
