export const selectAuthState = (state) => state.auth
export const selectAuthStatus = (state) => state.auth.status
export const selectAuthUser = (state) => state.auth.user
export const selectAuthError = (state) => state.auth.error
export const selectLoginStatus = (state) => state.auth.loginStatus
export const selectLogoutStatus = (state) => state.auth.logoutStatus
export const selectIsAuthenticated = (state) => state.auth.status === 'authenticated'
