import { Navigate, Route, Routes } from 'react-router-dom'
import PublicOnlyRoute from '../components/auth/PublicOnlyRoute'
import RequireAuth from '../components/auth/RequireAuth'
import AdminLayout from '../layouts/AdminLayout'
import DashboardPage from '../pages/DashboardPage'
import BookingsPage from '../pages/BookingsPage'
import CustomersPage from '../pages/CustomersPage'
import InventoryPage from '../pages/InventoryPage'
import LoginPage from '../pages/LoginPage'
import ReportsPage from '../pages/ReportsPage'
import SettingsPage from '../pages/SettingsPage'

function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default AppRouter
