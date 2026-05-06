export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
  },
  customers: {
    collection: '/customers',
  },
  profile: {
    show: '/profile',
    update: '/profile',
  },
  dashboard: {
    overview: '/dashboard/overview',
  },
  bookings: {
    collection: '/bookings',
  },
  hotels: {
    collection: '/hotels',
    detail: (hotelId) => `/hotels/${hotelId}`,
  },
  inventory: {
    overview: '/inventory',
  },
  roomTypes: {
    collection: '/room-types',
    detail: (roomTypeId) => `/room-types/${roomTypeId}`,
  },
  rooms: {
    collection: '/rooms',
    detail: (roomId) => `/rooms/${roomId}`,
  },
  reports: {
    overview: '/reports/overview',
  },
  settings: {
    show: '/settings',
    update: '/settings',
  },
}
