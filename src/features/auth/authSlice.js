import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { clearStoredAuthToken, getStoredAuthToken, persistAuthToken } from '../../data/auth/authToken'
import { authService } from '../../data/services/auth.service'

const initialState = {
  status: 'idle',
  loginStatus: 'idle',
  logoutStatus: 'idle',
  user: null,
  error: null,
}

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    const token = getStoredAuthToken()

    if (!token) {
      return {
        authenticated: false,
        user: null,
      }
    }

    try {
      const user = await authService.getProfile()

      return {
        authenticated: true,
        user,
      }
    } catch (error) {
      clearStoredAuthToken()

      return {
        authenticated: false,
        user: null,
        error: error.message || 'Your session has expired.',
      }
    }
  },
  {
    condition: (_, { getState }) => getState().auth.status === 'idle',
  },
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login({
        ...credentials,
        device_name: 'castle-admin-web',
      })

      if (response.token) {
        persistAuthToken(response.token)
      }

      return response
    } catch (error) {
      clearStoredAuthToken()

      return rejectWithValue(error.message || 'Unable to sign in right now.')
    }
  },
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
    } catch (error) {
      if (error.status && error.status !== 401) {
        return rejectWithValue(error.message || 'Unable to sign out right now.')
      }
    } finally {
      clearStoredAuthToken()
    }

    return true
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
    sessionExpired(state, action) {
      clearStoredAuthToken()
      state.status = 'unauthenticated'
      state.loginStatus = 'idle'
      state.logoutStatus = 'idle'
      state.user = null
      state.error = action.payload?.message || 'Your session has expired.'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.status = 'checking'
        state.logoutStatus = 'idle'
        state.error = null
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.status = action.payload.authenticated ? 'authenticated' : 'unauthenticated'
        state.user = action.payload.user
        state.error = action.payload.error || null
      })
      .addCase(login.pending, (state) => {
        state.loginStatus = 'loading'
        state.logoutStatus = 'idle'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.loginStatus = 'succeeded'
        state.user = action.payload.user
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.loginStatus = 'failed'
        state.user = null
        state.error = action.payload || 'Unable to sign in right now.'
      })
      .addCase(logout.pending, (state) => {
        state.logoutStatus = 'loading'
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'unauthenticated'
        state.loginStatus = 'idle'
        state.logoutStatus = 'succeeded'
        state.user = null
        state.error = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.logoutStatus = 'failed'
        state.user = null
        state.error = action.payload || 'Unable to sign out right now.'
      })
  },
})

export const { clearAuthError, sessionExpired } = authSlice.actions
export default authSlice.reducer
