import { apiNetwork, API_ROUTES, resolveApiRequest } from '../api'

function mapRoomItem(item) {
  return {
    id: item.id,
    hotelId: item.hotel_id,
    hotelName: item.hotel?.name || 'Hotel',
    hotelCity: item.hotel?.city || '',
    roomTypeId: item.room_type_id,
    roomTypeName: item.room_type?.name || item.type || 'Room type',
    roomTypeSlug: item.room_type?.slug || item.type || '',
    name: item.name || 'Room',
    slug: item.slug || '',
    description: item.description || '',
    basePrice: Number(item.base_price || 0),
    maxGuests: Number(item.max_guests || 0),
    sizeSqm: Number(item.size_sqm || 0),
    bedConfiguration: item.bed_configuration || '',
    totalUnits: Number(item.total_units || 0),
    ratingAverage: Number(item.rating_average || 0),
    isActive: Boolean(item.is_active),
    primaryImageUrl: item.primary_image_url || '',
    amenities: (item.amenities || []).map((amenity) => amenity.name),
    images: (item.images || []).map((image) => ({
      id: image.id,
      imageUrl: image.image_url,
      altText: image.alt_text || '',
      isPrimary: Boolean(image.is_primary),
      sortOrder: Number(image.sort_order || 0),
    })),
  }
}

function mapRoomResource(payload) {
  return mapRoomItem(payload?.data || payload)
}

function mapRoomsResponse(payload) {
  const items = (payload?.data || []).map(mapRoomItem)

  return {
    items,
    pagination: {
      total: payload?.meta?.total || items.length,
      page: payload?.meta?.current_page || 1,
      perPage: payload?.meta?.per_page || items.length,
    },
  }
}

export const roomsService = {
  async getRooms(params = {}) {
    const response = await resolveApiRequest({
      request: () =>
        apiNetwork.get(API_ROUTES.rooms.collection, {
          params: {
            per_page: 100,
            include_inactive: true,
            ...params,
          },
        }),
      transform: mapRoomsResponse,
    })

    return {
      ...response.data,
      source: response.source,
    }
  },

  async createRoom(payload) {
    return apiNetwork.post(API_ROUTES.rooms.collection, payload).then(mapRoomResource)
  },

  async updateRoom(roomId, payload) {
    return apiNetwork.put(API_ROUTES.rooms.detail(roomId), payload).then(mapRoomResource)
  },

  async deleteRoom(roomId) {
    return apiNetwork.delete(API_ROUTES.rooms.detail(roomId))
  },
}
