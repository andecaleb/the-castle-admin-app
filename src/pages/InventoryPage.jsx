import { startTransition, useDeferredValue, useEffect } from 'react'
import { PackageCheck, RefreshCw, Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import ErrorPanel from '../components/common/ErrorPanel'
import LoadingPanel from '../components/common/LoadingPanel'
import StatusBadge from '../components/common/StatusBadge'
import {
  selectInventoryError,
  selectInventoryFilters,
  selectInventoryFiltersData,
  selectInventorySource,
  selectInventoryState,
  selectInventoryStatus,
  selectInventorySummary,
  selectVisibleInventory,
} from '../features/inventory/inventorySelectors'
import {
  fetchInventory,
  setInventoryHotelFilter,
  setInventoryRoomTypeFilter,
  setInventorySearchTerm,
} from '../features/inventory/inventorySlice'
import { formatCurrency } from '../utils/formatters'

function InventoryPage() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectInventoryFilters)
  const filtersData = useAppSelector(selectInventoryFiltersData)
  const inventoryStatus = useAppSelector(selectInventoryStatus)
  const error = useAppSelector(selectInventoryError)
  const source = useAppSelector(selectInventorySource)
  const summary = useAppSelector(selectInventorySummary)
  const { pagination } = useAppSelector(selectInventoryState)
  const deferredSearch = useDeferredValue(filters.searchTerm)
  const rooms = useAppSelector((state) => selectVisibleInventory(state, deferredSearch))

  useEffect(() => {
    if (inventoryStatus === 'idle') {
      dispatch(fetchInventory())
    }
  }, [dispatch, inventoryStatus])

  const handleSearchChange = (event) => {
    const { value } = event.target

    startTransition(() => {
      dispatch(setInventorySearchTerm(value))
    })
  }

  if (inventoryStatus === 'loading' && rooms.length === 0) {
    return <LoadingPanel label="Loading inventory" />
  }

  if (inventoryStatus === 'failed') {
    return <ErrorPanel message={error} onRetry={() => dispatch(fetchInventory())} />
  }

  return (
    <div className="d-grid gap-4 fade-in-up">
      <section className="row g-3">
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Active hotels</p>
              <h2 className="summary-value">{summary.activeHotels}</h2>
              <p className="summary-subtext">Properties currently visible in inventory.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Active rooms</p>
              <h2 className="summary-value">{summary.activeRooms}</h2>
              <p className="summary-subtext">Sellable room types available to operations.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Available units</p>
              <h2 className="summary-value">{summary.availableUnits}</h2>
              <p className="summary-subtext">
                Source: {source === 'mock' ? 'local fallback data' : 'connected API'}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Occupancy</p>
              <h2 className="summary-value">{summary.occupancyRate}%</h2>
              <p className="summary-subtext">{summary.reservedUnits} units reserved today.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="work-card card">
        <div className="card-body p-4">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="mb-1 text-muted-soft fw-semibold">Room operations</p>
                <h2 className="h4 mb-0 fw-bold">Inventory board</h2>
              </div>

              <button
                className="btn btn-ghost-dark rounded-pill px-3"
                onClick={() => dispatch(fetchInventory())}
                type="button"
              >
                <RefreshCw size={16} />
                <span className="ms-2">Refresh</span>
              </button>
            </div>

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
              <small className="text-muted-soft">
                {pagination?.total || rooms.length} inventory rows loaded.
              </small>
              <small className="text-muted-soft">
                Total capacity today: {summary.totalUnits} units.
              </small>
            </div>

            <div className="filter-grid-wide">
              <label className="table-search-control">
                <Search size={18} className="text-muted-soft" />
                <input
                  onChange={handleSearchChange}
                  placeholder="Search room, hotel, or city"
                  type="search"
                  value={filters.searchTerm}
                />
              </label>

              <select
                className="table-filter-select"
                onChange={(event) => dispatch(setInventoryHotelFilter(event.target.value))}
                value={filters.hotelId}
              >
                <option value="all">All hotels</option>
                {filtersData.hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>

              <select
                className="table-filter-select"
                onChange={(event) => dispatch(setInventoryRoomTypeFilter(event.target.value))}
                value={filters.roomType}
              >
                <option value="all">All room types</option>
                {filtersData.roomTypes.map((roomType) => (
                  <option key={roomType} value={roomType}>
                    {roomType}
                  </option>
                ))}
              </select>

              <div className="table-search-control">
                <PackageCheck size={18} className="text-muted-soft" />
                <span className="fw-semibold">{summary.availableUnits} units open</span>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table booking-table align-middle">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Hotel</th>
                    <th>Type</th>
                    <th>Rate</th>
                    <th>Units</th>
                    <th>Occupancy</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td>
                        <div className="fw-bold">{room.roomName}</div>
                        <small className="text-muted-soft">ID #{room.id}</small>
                      </td>
                      <td>
                        <div>{room.hotelName}</div>
                        <small className="text-muted-soft">{room.hotelCity}</small>
                      </td>
                      <td className="text-capitalize">{room.type}</td>
                      <td className="fw-bold">{formatCurrency(room.basePrice, room.currency)}</td>
                      <td>
                        <div>{room.availableToday} available</div>
                        <small className="text-muted-soft">{room.totalUnits} total units</small>
                      </td>
                      <td>
                        <div className="fw-bold">{room.occupancyRate}%</div>
                        <small className="text-muted-soft">{room.reservedToday} reserved today</small>
                      </td>
                      <td>
                        <StatusBadge value={room.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rooms.length === 0 ? (
              <div className="empty-state">
                <p className="mb-1 fw-bold">No inventory matches this view</p>
                <p className="mb-0 text-muted-soft">
                  Try clearing the filters or refreshing the inventory board.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}

export default InventoryPage
