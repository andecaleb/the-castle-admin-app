import { NavLink } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { BRAND_ICON, NAV_ITEMS } from '../../config/navigation'
import { selectAuthUser } from '../../features/auth/authSelectors'

function AppSidebar() {
  const BrandIcon = BRAND_ICON
  const user = useAppSelector(selectAuthUser)

  return (
    <aside className="sidebar p-4 d-flex flex-column gap-4">
      <div className="d-flex align-items-center gap-3">
        <div className="brand-mark">
          <BrandIcon size={24} strokeWidth={2.4} />
        </div>
        <div>
          <p className="mb-0 fw-bold fs-5">Castle Admin</p>
          <small className="text-white-50">Control center</small>
        </div>
      </div>

      <nav className="sidebar-nav d-grid gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon

          if (item.disabled) {
            return (
              <div className="nav-button is-disabled d-flex align-items-center gap-3" key={item.label}>
                <Icon size={19} />
                <span className="fw-semibold">{item.label}</span>
              </div>
            )
          }

          return (
            <NavLink
              className={({ isActive }) =>
                `nav-button d-flex align-items-center gap-3 text-decoration-none ${
                  isActive ? 'active' : ''
                }`
              }
              end={item.path === '/'}
              key={item.label}
              to={item.path}
            >
              <Icon size={19} />
              <span className="fw-semibold">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto rounded-4 p-3 bg-white bg-opacity-10">
        <p className="mb-1 fw-bold">{user?.name || 'Castle Admin'}</p>
        <small className="text-white-50">
          {user?.email || user?.phone || 'Live admin session'}
        </small>
      </div>
    </aside>
  )
}

export default AppSidebar
