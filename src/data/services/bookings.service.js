import { apiNetwork, API_ROUTES, resolveApiRequest } from '../api'
import { bookingsMock } from '../mocks/bookings.mock'

function mapBookingsResponse(payload) {
  const items = payload?.items || payload?.data || payload || []

  return {
    items,
    pagination: payload?.pagination || {
      total: items.length,
      page: 1,
      perPage: items.length,
    },
  }
}

export const bookingsService = {
  async getBookings(params = {}) {
    const response = await resolveApiRequest({
      request: () =>
        apiNetwork.get(API_ROUTES.bookings.collection, {
          params,
        }),
      fallback: () => ({
        items: bookingsMock,
        pagination: {
          total: bookingsMock.length,
          page: 1,
          perPage: bookingsMock.length,
        },
      }),
      transform: mapBookingsResponse,
    })

    return {
      ...response.data,
      source: response.source,
    }
  },
}
