import { combineReducers } from '@reduxjs/toolkit'
import dashboardReducer from '../features/dashboard/dashboardSlice'
import bookingsReducer from '../features/bookings/bookingsSlice'

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  bookings: bookingsReducer,
})

export default rootReducer
