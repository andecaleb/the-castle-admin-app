import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { customersService } from '../../data/services/customers.service'
import { logout, sessionExpired } from '../auth/authSlice'

const initialState = {
  items: [],
  summary: {
    totalCustomers: 0,
    activeCustomers: 0,
    lifetimeRevenue: 0,
    newThisMonth: 0,
  },
  pagination: null,
  status: 'idle',
  error: null,
  source: 'remote',
  filters: {
    searchTerm: '',
    sortBy: 'value-desc',
  },
}

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      return await customersService.getCustomers()
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load customers.')
    }
  },
  {
    condition: (_, { getState }) => getState().customers.status !== 'loading',
  },
)

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomerSearchTerm(state, action) {
      state.filters.searchTerm = action.payload
    },
    setCustomerSortBy(state, action) {
      state.filters.sortBy = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.summary = action.payload.summary
        state.pagination = action.payload.pagination
        state.source = action.payload.source
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load customers.'
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState)
  },
})

export const { setCustomerSearchTerm, setCustomerSortBy } = customersSlice.actions
export default customersSlice.reducer
