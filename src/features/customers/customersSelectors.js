import { createSelector } from '@reduxjs/toolkit'

export const selectCustomersState = (state) => state.customers
export const selectCustomersItems = (state) => state.customers.items
export const selectCustomersSummary = (state) => state.customers.summary
export const selectCustomersStatus = (state) => state.customers.status
export const selectCustomersError = (state) => state.customers.error
export const selectCustomersSource = (state) => state.customers.source
export const selectCustomersFilters = (state) => state.customers.filters

export const selectVisibleCustomers = createSelector(
  [
    selectCustomersItems,
    (state) => state.customers.filters.searchTerm,
    (state) => state.customers.filters.sortBy,
  ],
  (items, searchTerm, sortBy) => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const filteredItems = items.filter((customer) => {
      const haystack = [
        customer.name,
        customer.email,
        customer.phone,
      ]
        .join(' ')
        .toLowerCase()

      return normalizedSearch.length === 0 || haystack.includes(normalizedSearch)
    })

    const sortedItems = [...filteredItems]

    if (sortBy === 'value-desc') {
      sortedItems.sort((left, right) => right.bookingsTotalAmount - left.bookingsTotalAmount)
    }

    if (sortBy === 'bookings-desc') {
      sortedItems.sort((left, right) => right.bookingsCount - left.bookingsCount)
    }

    if (sortBy === 'name-asc') {
      sortedItems.sort((left, right) => left.name.localeCompare(right.name))
    }

    return sortedItems
  },
)
