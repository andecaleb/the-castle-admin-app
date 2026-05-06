import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { reportsService } from '../../data/services/reports.service'
import { logout, sessionExpired } from '../auth/authSlice'

const initialState = {
  range: {
    from: null,
    to: null,
  },
  summary: {
    revenue: 0,
    occupancyRate: 0,
    bookings: 0,
    pendingBookings: 0,
    customers: 0,
  },
  bookingTrends: [],
  revenueByProvider: [],
  customerInsights: [],
  status: 'idle',
  error: null,
  source: 'remote',
}

export const fetchReportsOverview = createAsyncThunk(
  'reports/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      return await reportsService.getOverview()
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load reports.')
    }
  },
  {
    condition: (_, { getState }) => getState().reports.status !== 'loading',
  },
)

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportsOverview.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchReportsOverview.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.range = action.payload.range
        state.summary = action.payload.summary
        state.bookingTrends = action.payload.bookingTrends
        state.revenueByProvider = action.payload.revenueByProvider
        state.customerInsights = action.payload.customerInsights
        state.source = action.payload.source
      })
      .addCase(fetchReportsOverview.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load reports.'
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState)
  },
})

export default reportsSlice.reducer
