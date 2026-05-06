import { apiNetwork, API_ROUTES, resolveApiRequest } from '../api'

function mapRoomTypeItem(item) {
  return {
    id: item.id,
    name: item.name || 'Room type',
    slug: item.slug || '',
    description: item.description || '',
    sortOrder: Number(item.sort_order || 0),
    isActive: Boolean(item.is_active),
    roomsCount: Number(item.rooms_count || 0),
  }
}

function mapRoomTypeResource(payload) {
  return mapRoomTypeItem(payload?.data || payload)
}

function mapRoomTypesResponse(payload) {
  const items = (payload?.data || []).map(mapRoomTypeItem)

  return {
    items,
    pagination: {
      total: payload?.meta?.total || items.length,
      page: payload?.meta?.current_page || 1,
      perPage: payload?.meta?.per_page || items.length,
    },
  }
}

export const roomTypesService = {
  async getRoomTypes(params = {}) {
    const response = await resolveApiRequest({
      request: () =>
        apiNetwork.get(API_ROUTES.roomTypes.collection, {
          params: {
            per_page: 100,
            include_inactive: true,
            ...params,
          },
        }),
      transform: mapRoomTypesResponse,
    })

    return {
      ...response.data,
      source: response.source,
    }
  },

  async createRoomType(payload) {
    return apiNetwork.post(API_ROUTES.roomTypes.collection, payload).then(mapRoomTypeResource)
  },

  async updateRoomType(roomTypeId, payload) {
    return apiNetwork.put(API_ROUTES.roomTypes.detail(roomTypeId), payload).then(mapRoomTypeResource)
  },

  async deleteRoomType(roomTypeId) {
    return apiNetwork.delete(API_ROUTES.roomTypes.detail(roomTypeId))
  },
}
