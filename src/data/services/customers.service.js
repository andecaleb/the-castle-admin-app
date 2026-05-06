import { apiNetwork, API_ROUTES, resolveApiRequest } from '../api'

function mapCustomerItem(item) {
  return {
    id: item.id,
    name: item.name || 'Guest',
    email: item.email || 'No email',
    phone: item.phone || 'No phone',
    bookingsCount: Number(item.bookings_count || 0),
    bookingsTotalAmount: Number(item.bookings_total_amount || 0),
    lastBookingAt: item.last_booking_at,
    createdAt: item.created_at,
  }
}

function mapCustomersResponse(payload) {
  const items = (payload?.data || []).map(mapCustomerItem)

  return {
    summary: {
      totalCustomers: Number(payload?.summary?.total_customers || 0),
      activeCustomers: Number(payload?.summary?.active_customers || 0),
      lifetimeRevenue: Number(payload?.summary?.lifetime_revenue || 0),
      newThisMonth: Number(payload?.summary?.new_this_month || 0),
    },
    items,
    pagination: {
      total: payload?.meta?.total || items.length,
      page: payload?.meta?.current_page || 1,
      perPage: payload?.meta?.per_page || items.length,
    },
  }
}

export const customersService = {
  async getCustomers(params = {}) {
    const response = await resolveApiRequest({
      request: () =>
        apiNetwork.get(API_ROUTES.customers.collection, {
          params: {
            per_page: 100,
            ...params,
          },
        }),
      transform: mapCustomersResponse,
    })

    return {
      ...response.data,
      source: response.source,
    }
  },
}
