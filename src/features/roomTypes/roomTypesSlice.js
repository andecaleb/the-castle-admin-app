import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { roomTypesService } from '../../data/services/roomTypes.service'
import { logout, sessionExpired } from '../auth/authSlice'

const initialState = {
  items: [],
  pagination: null,
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
  source: 'remote',
}

export const fetchRoomTypes = createAsyncThunk(
  'roomTypes/fetchRoomTypes',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await roomTypesService.getRoomTypes(params)
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load room types.')
    }
  },
  {
    condition: (_, { getState }) => getState().roomTypes.status !== 'loading',
  },
)

export const createRoomType = createAsyncThunk(
  'roomTypes/createRoomType',
  async (payload, { rejectWithValue }) => {
    try {
      return await roomTypesService.createRoomType(payload)
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to create room type.')
    }
  },
)

export const updateRoomType = createAsyncThunk(
  'roomTypes/updateRoomType',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await roomTypesService.updateRoomType(id, payload)
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to update room type.')
    }
  },
)

export const deleteRoomType = createAsyncThunk(
  'roomTypes/deleteRoomType',
  async (id, { rejectWithValue }) => {
    try {
      await roomTypesService.deleteRoomType(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to delete room type.')
    }
  },
)

const roomTypesSlice = createSlice({
  name: 'roomTypes',
  initialState,
  reducers: {
    clearRoomTypesMutationState(state) {
      state.mutationStatus = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomTypes.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchRoomTypes.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.pagination = action.payload.pagination
        state.source = action.payload.source
      })
      .addCase(fetchRoomTypes.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load room types.'
      })
      .addCase(createRoomType.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(createRoomType.fulfilled, (state) => {
        state.mutationStatus = 'succeeded'
      })
      .addCase(createRoomType.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload || 'Unable to create room type.'
      })
      .addCase(updateRoomType.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(updateRoomType.fulfilled, (state) => {
        state.mutationStatus = 'succeeded'
      })
      .addCase(updateRoomType.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload || 'Unable to update room type.'
      })
      .addCase(deleteRoomType.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(deleteRoomType.fulfilled, (state) => {
        state.mutationStatus = 'succeeded'
      })
      .addCase(deleteRoomType.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload || 'Unable to delete room type.'
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState)
  },
})

export const { clearRoomTypesMutationState } = roomTypesSlice.actions
export default roomTypesSlice.reducer
