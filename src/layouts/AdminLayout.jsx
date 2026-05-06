import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import AppSidebar from '../components/layout/AppSidebar'

function AdminLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(max-width: 991.98px)')

    if (!mediaQuery.matches) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = isMobileSidebarOpen ? 'hidden' : previousOverflow

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileSidebarOpen])

  return (
    <div className="admin-shell d-flex">
      <AppSidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        onCloseSidebar={() => setIsMobileSidebarOpen(false)}
      />

      <main className="main-panel flex-grow-1">
        <AppHeader
          isMobileSidebarOpen={isMobileSidebarOpen}
          onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        />
        <div className="container-fluid p-3 p-lg-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
