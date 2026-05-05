import { apiNetwork, API_ROUTES, resolveApiRequest } from '../api'
import { dashboardOverviewMock } from '../mocks/dashboard.mock'

function mapDashboardResponse(payload) {
  return {
    hero: payload?.hero || dashboardOverviewMock.hero,
    metrics: payload?.metrics || dashboardOverviewMock.metrics,
    revenueSeries: payload?.revenueSeries || dashboardOverviewMock.revenueSeries,
    tasks: payload?.tasks || dashboardOverviewMock.tasks,
    recentBookings: payload?.recentBookings || dashboardOverviewMock.recentBookings,
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
