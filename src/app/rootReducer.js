import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import dashboardReducer from '../features/dashboard/dashboardSlice'
import bookingsReducer from '../features/bookings/bookingsSlice'
import customersReducer from '../features/customers/customersSlice'
import inventoryReducer from '../features/inventory/inventorySlice'
import reportsReducer from '../features/reports/reportsSlice'
import settingsReducer from '../features/settings/settingsSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  bookings: bookingsReducer,
  customers: customersReducer,
  inventory: inventoryReducer,
  reports: reportsReducer,
  settings: settingsReducer,
})

export default rootReducer
