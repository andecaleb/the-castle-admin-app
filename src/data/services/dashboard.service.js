import { apiNetwork, API_ROUTES, resolveApiRequest } from '../api'
import { dashboardOverviewMock } from '../mocks/dashboard.mock'

function mapDashboardResponse(payload) {
  const data = payload?.data || payload || {}

  return {
    hero: data.hero || dashboardOverviewMock.hero,
    metrics: Array.isArray(data.metrics) ? data.metrics : dashboardOverviewMock.metrics,
    revenueSeries: Array.isArray(data.revenueSeries)
      ? data.revenueSeries
      : dashboardOverviewMock.revenueSeries,
    tasks: Array.isArray(data.tasks) ? data.tasks : dashboardOverviewMock.tasks,
    recentBookings: Array.isArray(data.recentBookings)
      ? data.recentBookings
      : dashboardOverviewMock.recentBookings,
  }
}

export const dashboardService = {
  async getOverview() {
    const response = await resolveApiRequest({
      request: () => apiNetwork.get(API_ROUTES.dashboard.overview),
      fallback: () => dashboardOverviewMock,
      transform: mapDashboardResponse,
    })

    return {
      ...response.data,
      source: response.source,
    }
  },
}
