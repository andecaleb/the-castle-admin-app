import { createSelector } from '@reduxjs/toolkit'

export const selectInventoryState = (state) => state.inventory
export const selectInventoryItems = (state) => state.inventory.items
export const selectInventorySummary = (state) => state.inventory.summary
export const selectInventoryStatus = (state) => state.inventory.status
export const selectInventoryError = (state) => state.inventory.error
export const selectInventorySource = (state) => state.inventory.source
export const selectInventoryFilters = (state) => state.inventory.filters
export const selectInventoryFiltersData = (state) => state.inventory.filtersData

export const selectVisibleInventory = createSelector(
  [
    selectInventoryItems,
    (state) => state.inventory.filters.searchTerm,
    (state) => state.inventory.filters.hotelId,
    (state) => state.inventory.filters.roomType,
  ],
  (items, searchTerm, hotelId, roomType) => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return items.filter((room) => {
      const matchesHotel = hotelId === 'all' ? true : String(room.hotelId) === String(hotelId)
      const matchesRoomType =
        roomType === 'all' ? true : String(room.roomTypeId) === String(roomType)
      const haystack = [room.roomName, room.hotelName, room.hotelCity, room.roomTypeName, room.type]
        .join(' ')
        .toLowerCase()
      const matchesSearch =
        normalizedSearch.length === 0 || haystack.includes(normalizedSearch)

      return matchesHotel && matchesRoomType && matchesSearch
    })
  },
)
