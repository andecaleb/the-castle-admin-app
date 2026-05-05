import { Outlet } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import AppSidebar from '../components/layout/AppSidebar'

function AdminLayout() {
  return (
    <div className="admin-shell d-flex">
      <AppSidebar />

      <main className="main-panel flex-grow-1">
        <AppHeader />
        <div className="container-fluid p-3 p-lg-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
