import { apiNetwork, API_ROUTES, resolveApiRequest } from '../api'

function mapReportsResponse(payload) {
  return {
    range: payload?.range || {
      from: null,
      to: null,
    },
    summary: {
      revenue: Number(payload?.summary?.revenue || 0),
      occupancyRate: Number(payload?.summary?.occupancy_rate || 0),
      bookings: Number(payload?.summary?.bookings || 0),
      pendingBookings: Number(payload?.summary?.pending_bookings || 0),
      customers: Number(payload?.summary?.customers || 0),
    },
    bookingTrends: (payload?.booking_trends || []).map((item) => ({
      date: item.date,
      bookings: Number(item.bookings || 0),
      revenue: Number(item.revenue || 0),
    })),
    revenueByProvider: (payload?.revenue_by_provider || []).map((item) => ({
      provider: item.provider,
      totalAmount: Number(item.total_amount || 0),
    })),
    customerInsights: (payload?.customer_insights || []).map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email || 'No email',
      phone: item.phone || 'No phone',
      bookingsCount: Number(item.bookings_count || 0),
      lifetimeValue: Number(item.lifetime_value || 0),
    })),
  }
}

export const reportsService = {
  async getOverview(params = {}) {
    const response = await resolveApiRequest({
      request: () => apiNetwork.get(API_ROUTES.reports.overview, { params }),
      transform: mapReportsResponse,
    })

    return {
      ...response.data,
      source: response.source,
    }
  },
}
