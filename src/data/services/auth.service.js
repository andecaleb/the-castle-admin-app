import { apiNetwork, API_ROUTES } from '../api'

function mapUser(payload) {
  return payload?.data || payload?.user || payload || null
}

export const authService = {
  async login(credentials) {
    const payload = await apiNetwork.post(API_ROUTES.auth.login, credentials)

    return {
      message: payload?.message || 'Login successful.',
      token: payload?.token || null,
      user: mapUser(payload?.user),
    }
  },

  async logout() {
    return apiNetwork.post(API_ROUTES.auth.logout)
  },

  async getProfile() {
    const payload = await apiNetwork.get(API_ROUTES.profile.show)

    return mapUser(payload)
  },
}
