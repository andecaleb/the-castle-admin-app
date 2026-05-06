import { apiNetwork, API_ROUTES, resolveApiRequest } from '../api'

function mapInventoryItem(item) {
  return {
    id: item.id,
    roomName: item.room_name,
    hotelName: item?.hotel?.name || 'Hotel',
    hotelId: item?.hotel?.id || null,
    hotelCity: item?.hotel?.city || 'N/A',
    type: item?.room_type?.slug || item.type,
    roomTypeId: item?.room_type?.id || null,
    roomTypeName: item?.room_type?.name || item.type,
    basePrice: Number(item.base_price || 0),
    currency: item.currency || 'NGN',
    totalUnits: Number(item.total_units || 0),
    reservedToday: Number(item.reserved_today || 0),
    availableToday: Number(item.available_today || 0),
    occupancyRate: Number(item.occupancy_rate || 0),
    status: item.status || 'available',
    isActive: Boolean(item.is_active),
    imageUrl: item.primary_image_url,
  }
}

function mapInventoryResponse(payload) {
  const items = (payload?.data || []).map(mapInventoryItem)

  return {
    summary: {
      activeHotels: Number(payload?.summary?.active_hotels || 0),
      activeRooms: Number(payload?.summary?.active_rooms || 0),
      totalUnits: Number(payload?.summary?.total_units || 0),
      reservedUnits: Number(payload?.summary?.reserved_units || 0),
      availableUnits: Number(payload?.summary?.available_units || 0),
      occupancyRate: Number(payload?.summary?.occupancy_rate || 0),
    },
    filtersData: {
      hotels: payload?.filters?.hotels || [],
      roomTypes: payload?.filters?.room_types || [],
    },
    items,
    pagination: {
      total: payload?.meta?.total || items.length,
      page: payload?.meta?.current_page || 1,
      perPage: payload?.meta?.per_page || items.length,
    },
  }
}

export const inventoryService = {
  async getInventory(params = {}) {
    const response = await resolveApiRequest({
      request: () =>
        apiNetwork.get(API_ROUTES.inventory.overview, {
          params: {
            per_page: 100,
            ...params,
          },
        }),
      transform: mapInventoryResponse,
    })

    return {
      ...response.data,
      source: response.source,
    }
  },
}
