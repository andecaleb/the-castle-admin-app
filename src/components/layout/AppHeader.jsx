import { Bell, Clock3, LogOut } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { FALLBACK_PAGE_META, NAV_ITEMS } from '../../config/navigation'
import { selectAuthUser, selectLogoutStatus } from '../../features/auth/authSelectors'
import { logout } from '../../features/auth/authSlice'

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() || '')
    .join('')
}

function AppHeader() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const user = useAppSelector(selectAuthUser)
  const logoutStatus = useAppSelector(selectLogoutStatus)
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
          <button
            className="btn btn-ghost-dark rounded-pill px-3"
            disabled={logoutStatus === 'loading'}
            onClick={() => dispatch(logout())}
            type="button"
          >
            <LogOut size={16} />
            <span className="ms-2">
              {logoutStatus === 'loading' ? 'Signing out...' : 'Sign out'}
            </span>
          </button>
          <div className="d-flex align-items-center gap-2">
            <div className="avatar">{getInitials(user?.name || 'Castle Admin')}</div>
            <div className="d-none d-sm-block">
              <p className="mb-0 fw-bold small">{user?.name || 'Admin user'}</p>
              <small className="text-muted-soft text-capitalize">{user?.role || 'Admin'}</small>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
