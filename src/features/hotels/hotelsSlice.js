import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { hotelsService } from '../../data/services/hotels.service'
import { logout, sessionExpired } from '../auth/authSlice'

const initialState = {
  items: [],
  pagination: null,
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
  source: 'remote',
}

export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await hotelsService.getHotels(params)
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load hotels.')
    }
  },
  {
    condition: (_, { getState }) => getState().hotels.status !== 'loading',
  },
)

export const createHotel = createAsyncThunk(
  'hotels/createHotel',
  async (payload, { rejectWithValue }) => {
    try {
      return await hotelsService.createHotel(payload)
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to create hotel.')
    }
  },
)

export const updateHotel = createAsyncThunk(
  'hotels/updateHotel',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await hotelsService.updateHotel(id, payload)
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to update hotel.')
    }
  },
)

export const deleteHotel = createAsyncThunk(
  'hotels/deleteHotel',
  async (id, { rejectWithValue }) => {
    try {
      await hotelsService.deleteHotel(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to delete hotel.')
    }
  },
)

const hotelsSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    clearHotelsMutationState(state) {
      state.mutationStatus = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.pagination = action.payload.pagination
        state.source = action.payload.source
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load hotels.'
      })
      .addCase(createHotel.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(createHotel.fulfilled, (state) => {
        state.mutationStatus = 'succeeded'
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload || 'Unable to create hotel.'
      })
      .addCase(updateHotel.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(updateHotel.fulfilled, (state) => {
        state.mutationStatus = 'succeeded'
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload || 'Unable to update hotel.'
      })
      .addCase(deleteHotel.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(deleteHotel.fulfilled, (state) => {
        state.mutationStatus = 'succeeded'
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload || 'Unable to delete hotel.'
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState)
  },
})

export const { clearHotelsMutationState } = hotelsSlice.actions
export default hotelsSlice.reducer
