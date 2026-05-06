import { apiNetwork, API_ROUTES, resolveApiRequest } from '../api'

function mapHotelItem(item) {
  return {
    id: item.id,
    name: item.name || 'Hotel',
    description: item.description || '',
    street: item.location?.street || '',
    city: item.location?.city || '',
    state: item.location?.state || '',
    country: item.location?.country || '',
    featuredImageUrl: item.featured_image_url || '',
    baseCurrency: item.base_currency || 'NGN',
    ratingAverage: Number(item.rating_average || 0),
    reviewCount: Number(item.review_count || 0),
    popularityScore: Number(item.popularity_score || 0),
    roomsCount: Number(item.rooms_count || 0),
    startingPrice: Number(item.starting_price || 0),
    isActive: Boolean(item.is_active),
    checkInTime: item.check_in_time || '',
    checkOutTime: item.check_out_time || '',
  }
}

function mapHotelResource(payload) {
  return mapHotelItem(payload?.data || payload)
}

function mapHotelsResponse(payload) {
  const items = (payload?.data || []).map(mapHotelItem)

  return {
    items,
    pagination: {
      total: payload?.meta?.total || items.length,
      page: payload?.meta?.current_page || 1,
      perPage: payload?.meta?.per_page || items.length,
    },
  }
}

export const hotelsService = {
  async getHotels(params = {}) {
    const response = await resolveApiRequest({
      request: () =>
        apiNetwork.get(API_ROUTES.hotels.collection, {
          params: {
            per_page: 100,
            include_inactive: true,
            ...params,
          },
        }),
      transform: mapHotelsResponse,
    })

    return {
      ...response.data,
      source: response.source,
    }
  },

  async createHotel(payload) {
    return apiNetwork.post(API_ROUTES.hotels.collection, payload).then(mapHotelResource)
  },

  async updateHotel(hotelId, payload) {
    return apiNetwork.put(API_ROUTES.hotels.detail(hotelId), payload).then(mapHotelResource)
  },

  async deleteHotel(hotelId) {
    return apiNetwork.delete(API_ROUTES.hotels.detail(hotelId))
  },
}
