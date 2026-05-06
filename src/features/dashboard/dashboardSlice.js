import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { dashboardService } from '../../data/services/dashboard.service'
import { logout, sessionExpired } from '../auth/authSlice'

const initialState = {
  hero: null,
  metrics: [],
  revenueSeries: [],
  tasks: [],
  recentBookings: [],
  status: 'idle',
  error: null,
  source: 'remote',
}

export const fetchDashboardOverview = createAsyncThunk(
  'dashboard/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getOverview()
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load dashboard overview.')
    }
  },
  {
    condition: (_, { getState }) => getState().dashboard.status !== 'loading',
  },
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.hero = action.payload.hero
        state.metrics = action.payload.metrics
        state.revenueSeries = action.payload.revenueSeries
        state.tasks = action.payload.tasks
        state.recentBookings = action.payload.recentBookings
        state.source = action.payload.source
      })
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load dashboard overview.'
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState)
  },
})

export default dashboardSlice.reducer
