import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { roomsService } from '../../data/services/rooms.service'
import { logout, sessionExpired } from '../auth/authSlice'

const initialState = {
  items: [],
  pagination: null,
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
  source: 'remote',
}

export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await roomsService.getRooms(params)
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load rooms.')
    }
  },
  {
    condition: (_, { getState }) => getState().rooms.status !== 'loading',
  },
)

export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (payload, { rejectWithValue }) => {
    try {
      return await roomsService.createRoom(payload)
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to create room.')
    }
  },
)

export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await roomsService.updateRoom(id, payload)
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to update room.')
    }
  },
)

export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async (id, { rejectWithValue }) => {
    try {
      await roomsService.deleteRoom(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to delete room.')
    }
  },
)

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    clearRoomsMutationState(state) {
      state.mutationStatus = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.pagination = action.payload.pagination
        state.source = action.payload.source
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load rooms.'
      })
      .addCase(createRoom.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(createRoom.fulfilled, (state) => {
        state.mutationStatus = 'succeeded'
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload || 'Unable to create room.'
      })
      .addCase(updateRoom.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(updateRoom.fulfilled, (state) => {
        state.mutationStatus = 'succeeded'
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload || 'Unable to update room.'
      })
      .addCase(deleteRoom.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(deleteRoom.fulfilled, (state) => {
        state.mutationStatus = 'succeeded'
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload || 'Unable to delete room.'
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState)
  },
})

export const { clearRoomsMutationState } = roomsSlice.actions
export default roomsSlice.reducer
