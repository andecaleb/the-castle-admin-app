import { createSelector } from '@reduxjs/toolkit'

export const selectBookingsState = (state) => state.bookings
export const selectBookingsItems = (state) => state.bookings.items
export const selectBookingsStatus = (state) => state.bookings.status
export const selectBookingsError = (state) => state.bookings.error
export const selectBookingsSource = (state) => state.bookings.source
export const selectBookingsFilters = (state) => state.bookings.filters

export const selectBookingSummary = createSelector([selectBookingsItems], (items) => {
  const totalRevenue = items.reduce((sum, booking) => sum + Number(booking.total || 0), 0)
  const confirmed = items.filter((booking) => booking.status === 'Confirmed').length
  const pending = items.filter((booking) => booking.status === 'Pending').length
  const currency = items[0]?.currency || 'NGN'

  return {
    total: items.length,
    confirmed,
    pending,
    totalRevenue,
    currency,
  }
})

export const selectBookingStatuses = createSelector([selectBookingsItems], (items) => {
  const counts = items.reduce(
    (accumulator, booking) => {
      const key = booking.status || 'Unknown'
      accumulator[key] = (accumulator[key] || 0) + 1
      return accumulator
    },
    { All: items.length },
  )

  return Object.entries(counts).map(([label, count]) => ({ label, count }))
})

export const selectVisibleBookings = createSelector(
  [
    selectBookingsItems,
    (state) => state.bookings.filters.status,
    (state) => state.bookings.filters.sortBy,
    (_, searchTerm) => searchTerm,
  ],
  (items, statusFilter, sortBy, searchTerm) => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const filteredItems = items.filter((booking) => {
      const matchesStatus =
        statusFilter === 'All' ? true : booking.status === statusFilter

      const haystack = [
        booking.id,
        booking.guestName,
        booking.email,
        booking.service,
        booking.source,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        normalizedSearch.length === 0 || haystack.includes(normalizedSearch)

      return matchesStatus && matchesSearch
    })

    const sortedItems = [...filteredItems]

    if (sortBy === 'amount-desc') {
      sortedItems.sort((left, right) => right.total - left.total)
    }

    if (sortBy === 'amount-asc') {
      sortedItems.sort((left, right) => left.total - right.total)
    }

    if (sortBy === 'checkin-asc') {
      sortedItems.sort(
        (left, right) => new Date(left.checkIn).getTime() - new Date(right.checkIn).getTime(),
      )
    }

    if (sortBy === 'checkin-desc') {
      sortedItems.sort(
        (left, right) => new Date(right.checkIn).getTime() - new Date(left.checkIn).getTime(),
      )
    }

    return sortedItems
  },
)
