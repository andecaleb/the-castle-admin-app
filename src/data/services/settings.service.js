import { apiNetwork, API_ROUTES, resolveApiRequest } from '../api'

function mapSettingsResponse(payload) {
  const data = payload?.data || {}

  return {
    profile: data.profile || {
      name: '',
      email: '',
      phone: '',
      role: 'admin',
      last_login_at: null,
    },
    preferences: data.preferences || {
      theme: 'gold',
      notifications: {
        email: true,
        sms: false,
        reminders: true,
      },
      dashboard: {
        auto_sync: true,
        compact_nav: false,
        weekly_reports: true,
      },
      revenue: {
        default_range: '30d',
      },
    },
    environment: data.environment || {
      app_name: 'Castle API',
      app_url: '',
      timezone: '',
      currency: 'NGN',
    },
  }
}

export const settingsService = {
  async getSettings() {
    const response = await resolveApiRequest({
      request: () => apiNetwork.get(API_ROUTES.settings.show),
      transform: mapSettingsResponse,
    })

    return {
      ...response.data,
      source: response.source,
    }
  },

  async updateSettings(payload) {
    const response = await resolveApiRequest({
      request: () => apiNetwork.put(API_ROUTES.settings.update, payload),
      transform: (data) => ({
        message: data?.message || 'Settings updated successfully.',
        ...mapSettingsResponse(data),
      }),
    })

    return {
      ...response.data,
      source: response.source,
    }
  },
}
