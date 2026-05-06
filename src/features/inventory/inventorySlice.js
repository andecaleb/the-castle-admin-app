import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { inventoryService } from '../../data/services/inventory.service'
import { logout, sessionExpired } from '../auth/authSlice'

const initialState = {
  items: [],
  summary: {
    activeHotels: 0,
    activeRooms: 0,
    totalUnits: 0,
    reservedUnits: 0,
    availableUnits: 0,
    occupancyRate: 0,
  },
  filtersData: {
    hotels: [],
    roomTypes: [],
  },
  pagination: null,
  status: 'idle',
  error: null,
  source: 'remote',
  filters: {
    searchTerm: '',
    hotelId: 'all',
    roomType: 'all',
  },
}

export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (_, { rejectWithValue }) => {
    try {
      return await inventoryService.getInventory()
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load inventory.')
    }
  },
  {
    condition: (_, { getState }) => getState().inventory.status !== 'loading',
  },
)

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventorySearchTerm(state, action) {
      state.filters.searchTerm = action.payload
    },
    setInventoryHotelFilter(state, action) {
      state.filters.hotelId = action.payload
    },
    setInventoryRoomTypeFilter(state, action) {
      state.filters.roomType = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.summary = action.payload.summary
        state.filtersData = action.payload.filtersData
        state.pagination = action.payload.pagination
        state.source = action.payload.source
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load inventory.'
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState)
  },
})

export const {
  setInventorySearchTerm,
  setInventoryHotelFilter,
  setInventoryRoomTypeFilter,
} = inventorySlice.actions
export default inventorySlice.reducer
