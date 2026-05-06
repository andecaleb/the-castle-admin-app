import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import dashboardReducer from '../features/dashboard/dashboardSlice'
import bookingsReducer from '../features/bookings/bookingsSlice'
import customersReducer from '../features/customers/customersSlice'
import inventoryReducer from '../features/inventory/inventorySlice'
import hotelsReducer from '../features/hotels/hotelsSlice'
import reportsReducer from '../features/reports/reportsSlice'
import roomsReducer from '../features/rooms/roomsSlice'
import roomTypesReducer from '../features/roomTypes/roomTypesSlice'
import settingsReducer from '../features/settings/settingsSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  bookings: bookingsReducer,
  customers: customersReducer,
  hotels: hotelsReducer,
  inventory: inventoryReducer,
  reports: reportsReducer,
  rooms: roomsReducer,
  roomTypes: roomTypesReducer,
  settings: settingsReducer,
})

export default rootReducer
