import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import dashboardReducer from '../features/dashboard/dashboardSlice'
import bookingsReducer from '../features/bookings/bookingsSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  bookings: bookingsReducer,
})

export default rootReducer
