import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { bookingsService } from '../../data/services/bookings.service'
import { logout, sessionExpired } from '../auth/authSlice'

const initialState = {
  items: [],
  pagination: null,
  status: 'idle',
  error: null,
  source: 'remote',
  filters: {
    searchTerm: '',
    status: 'All',
    sortBy: 'checkin-asc',
  },
}

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      return await bookingsService.getBookings()
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load bookings.')
    }
  },
  {
    condition: (_, { getState }) => getState().bookings.status !== 'loading',
  },
)

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.filters.searchTerm = action.payload
    },
    setStatusFilter(state, action) {
      state.filters.status = action.payload
    },
    setSortBy(state, action) {
      state.filters.sortBy = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.pagination = action.payload.pagination
        state.source = action.payload.source
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load bookings.'
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState)
  },
})

export const { setSearchTerm, setStatusFilter, setSortBy } = bookingsSlice.actions
export default bookingsSlice.reducer
