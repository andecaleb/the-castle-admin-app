import { apiNetwork, API_ROUTES, resolveApiRequest } from '../api'
import { bookingsMock } from '../mocks/bookings.mock'

function toTitleCase(value = '') {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(' ')
}

function mapPaymentStatus(value) {
  const normalizedValue = String(value || '').toLowerCase()

  if (normalizedValue === 'completed') {
    return 'Paid'
  }

  if (normalizedValue === 'pending') {
    return 'Pending'
  }

  if (normalizedValue === 'failed') {
    return 'Failed'
  }

  return toTitleCase(normalizedValue || 'Unknown')
}

function mapBookingItem(booking) {
  return {
    id: booking?.booking_reference || booking?.id,
    guestName: booking?.user?.name || 'Guest',
    email: booking?.user?.email || 'No email',
    service: booking?.room?.name || booking?.hotel?.name || 'Room booking',
    guests: Number(booking?.guest_count || 0),
    checkIn: booking?.check_in_date,
    checkOut: booking?.check_out_date,
    total: Number(booking?.amounts?.total_amount || 0),
    currency: booking?.amounts?.currency || 'NGN',
    paymentStatus: mapPaymentStatus(booking?.payment_status),
    status: toTitleCase(booking?.status || 'Unknown'),
    source: toTitleCase(booking?.source || 'Direct'),
  }
}

function mapBookingsResponse(payload) {
  const rawItems = payload?.items || payload?.data || payload || []
  const items = rawItems.map(mapBookingItem)

  return {
    items,
    pagination: payload?.pagination || {
      total: payload?.meta?.total || items.length,
      page: payload?.meta?.current_page || 1,
      perPage: payload?.meta?.per_page || items.length,
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
