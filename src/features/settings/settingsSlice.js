import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { settingsService } from '../../data/services/settings.service'
import { logout, sessionExpired } from '../auth/authSlice'

const initialState = {
  data: null,
  status: 'idle',
  saveStatus: 'idle',
  error: null,
  source: 'remote',
  successMessage: null,
}

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      return await settingsService.getSettings()
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load settings.')
    }
  },
  {
    condition: (_, { getState }) => getState().settings.status !== 'loading',
  },
)

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (payload, { rejectWithValue }) => {
    try {
      return await settingsService.updateSettings(payload)
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to save settings.')
    }
  },
)

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearSettingsSuccess(state) {
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
        state.source = action.payload.source
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load settings.'
      })
      .addCase(updateSettings.pending, (state) => {
        state.saveStatus = 'loading'
        state.error = null
        state.successMessage = null
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded'
        state.data = action.payload
        state.source = action.payload.source
        state.successMessage = action.payload.message
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.saveStatus = 'failed'
        state.error = action.payload || 'Unable to save settings.'
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState)
  },
})

export const { clearSettingsSuccess } = settingsSlice.actions
export default settingsSlice.reducer
