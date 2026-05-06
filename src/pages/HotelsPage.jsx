import { useEffect, useMemo, useState } from 'react'
import { Building2, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import ErrorPanel from '../components/common/ErrorPanel'
import LoadingPanel from '../components/common/LoadingPanel'
import StatusBadge from '../components/common/StatusBadge'
import {
  selectHotelsError,
  selectHotelsItems,
  selectHotelsMutationStatus,
  selectHotelsSource,
  selectHotelsState,
  selectHotelsStatus,
} from '../features/hotels/hotelsSelectors'
import {
  clearHotelsMutationState,
  createHotel,
  deleteHotel,
  fetchHotels,
  updateHotel,
} from '../features/hotels/hotelsSlice'
import { formatCurrency } from '../utils/formatters'

const INITIAL_HOTEL_FORM = {
  name: '',
  description: '',
  street: '',
  city: '',
  state: '',
  country: 'Nigeria',
  featuredImageUrl: '',
  baseCurrency: 'NGN',
  checkInTime: '14:00',
  checkOutTime: '12:00',
  isActive: true,
}

function getHotelFormState(hotel = INITIAL_HOTEL_FORM) {
  return {
    name: hotel.name || '',
    description: hotel.description || '',
    street: hotel.street || '',
    city: hotel.city || '',
    state: hotel.state || '',
    country: hotel.country || 'Nigeria',
    featuredImageUrl: hotel.featuredImageUrl || '',
    baseCurrency: hotel.baseCurrency || 'NGN',
    checkInTime: hotel.checkInTime || '14:00',
    checkOutTime: hotel.checkOutTime || '12:00',
    isActive: hotel.isActive ?? true,
  }
}

function HotelsPage() {
  const dispatch = useAppDispatch()
  const { pagination } = useAppSelector(selectHotelsState)
  const hotels = useAppSelector(selectHotelsItems)
  const status = useAppSelector(selectHotelsStatus)
  const mutationStatus = useAppSelector(selectHotelsMutationStatus)
  const error = useAppSelector(selectHotelsError)
  const source = useAppSelector(selectHotelsSource)
  const [editingHotelId, setEditingHotelId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formState, setFormState] = useState(INITIAL_HOTEL_FORM)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHotels())
    }
  }, [dispatch, status])

  const visibleHotels = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return hotels.filter((hotel) => {
      const haystack = [hotel.name, hotel.city, hotel.state, hotel.country]
        .join(' ')
        .toLowerCase()

      return normalizedSearch.length === 0 || haystack.includes(normalizedSearch)
    })
  }, [hotels, searchTerm])

  const summary = useMemo(() => {
    const activeHotels = hotels.filter((hotel) => hotel.isActive).length
    const totalRooms = hotels.reduce((sum, hotel) => sum + hotel.roomsCount, 0)
    const startingPriceAverage =
      hotels.length > 0
        ? hotels.reduce((sum, hotel) => sum + hotel.startingPrice, 0) / hotels.length
        : 0

    return {
      activeHotels,
      totalRooms,
      startingPriceAverage,
    }
  }, [hotels])

  const resetForm = () => {
    setEditingHotelId(null)
    setFormState(INITIAL_HOTEL_FORM)
    dispatch(clearHotelsMutationState())
  }

  const handleEdit = (hotel) => {
    setEditingHotelId(hotel.id)
    setFormState(getHotelFormState(hotel))
    dispatch(clearHotelsMutationState())
  }

  const handleFieldChange = (field, value) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }))

    if (mutationStatus !== 'idle') {
      dispatch(clearHotelsMutationState())
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      name: formState.name,
      description: formState.description,
      street: formState.street,
      city: formState.city,
      state: formState.state,
      country: formState.country,
      featured_image_url: formState.featuredImageUrl,
      base_currency: formState.baseCurrency,
      check_in_time: formState.checkInTime,
      check_out_time: formState.checkOutTime,
      is_active: formState.isActive,
    }

    const action = editingHotelId
      ? updateHotel({ id: editingHotelId, payload })
      : createHotel(payload)

    const resultAction = await dispatch(action)

    if (createHotel.fulfilled.match(resultAction) || updateHotel.fulfilled.match(resultAction)) {
      resetForm()
      dispatch(fetchHotels())
    }
  }

  const handleDelete = async (hotel) => {
    const confirmed = window.confirm(`Delete ${hotel.name}?`)

    if (!confirmed) {
      return
    }

    const resultAction = await dispatch(deleteHotel(hotel.id))

    if (deleteHotel.fulfilled.match(resultAction)) {
      if (editingHotelId === hotel.id) {
        resetForm()
      }

      dispatch(fetchHotels())
    }
  }

  if (status === 'loading' && hotels.length === 0) {
    return <LoadingPanel label="Loading hotels" />
  }

  if (status === 'failed' && hotels.length === 0) {
    return <ErrorPanel message={error} onRetry={() => dispatch(fetchHotels())} />
  }

  return (
    <div className="d-grid gap-4 fade-in-up">
      <section className="row g-3">
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Hotels</p>
              <h2 className="summary-value">{pagination?.total || hotels.length}</h2>
              <p className="summary-subtext">Properties currently tracked in operations.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Active properties</p>
              <h2 className="summary-value">{summary.activeHotels}</h2>
              <p className="summary-subtext">Visible to guests and downstream systems.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Managed rooms</p>
              <h2 className="summary-value">{summary.totalRooms}</h2>
              <p className="summary-subtext">Room records assigned across all hotels.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Average starting rate</p>
              <h2 className="summary-value">{formatCurrency(summary.startingPriceAverage, 'NGN')}</h2>
              <p className="summary-subtext">
                Source: {source === 'mock' ? 'local fallback data' : 'connected API'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="work-card card">
        <div className="card-body p-4">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="mb-1 text-muted-soft fw-semibold">Property management</p>
                <h2 className="h4 mb-0 fw-bold">Hotels registry</h2>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-ghost-dark rounded-pill px-3"
                  onClick={() => dispatch(fetchHotels())}
                  type="button"
                >
                  <RefreshCw size={16} />
                  <span className="ms-2">Refresh</span>
                </button>
                <button className="btn btn-gold rounded-pill px-3" onClick={resetForm} type="button">
                  <Plus size={16} />
                  <span className="ms-2">New hotel</span>
                </button>
              </div>
            </div>

            <div className="toolbar-grid">
              <label className="table-search-control">
                <Building2 size={18} className="text-muted-soft" />
                <input
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search hotel name or location"
                  type="search"
                  value={searchTerm}
                />
              </label>

              <div className="table-search-control">
                <span className="fw-semibold">{summary.activeHotels} active properties</span>
              </div>

              <div className="table-search-control">
                <span className="fw-semibold">{visibleHotels.length} hotels in this view</span>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table booking-table align-middle">
                <thead>
                  <tr>
                    <th>Hotel</th>
                    <th>Location</th>
                    <th>Rooms</th>
                    <th>Starting rate</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleHotels.map((hotel) => (
                    <tr key={hotel.id}>
                      <td>
                        <div className="fw-bold">{hotel.name}</div>
                        <small className="text-muted-soft">{hotel.description || 'No description yet'}</small>
                      </td>
                      <td>
                        <div>{hotel.city}</div>
                        <small className="text-muted-soft">
                          {[hotel.state, hotel.country].filter(Boolean).join(', ')}
                        </small>
                      </td>
                      <td className="fw-bold">{hotel.roomsCount}</td>
                      <td className="fw-bold">{formatCurrency(hotel.startingPrice, hotel.baseCurrency)}</td>
                      <td>
                        <StatusBadge value={hotel.isActive ? 'active' : 'inactive'} />
                      </td>
                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-sm btn-ghost-dark rounded-pill px-3"
                            onClick={() => handleEdit(hotel)}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            onClick={() => handleDelete(hotel)}
                            type="button"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visibleHotels.length === 0 ? (
              <div className="empty-state">
                <p className="mb-1 fw-bold">No hotels match this view</p>
                <p className="mb-0 text-muted-soft">
                  Try clearing the search or adding the next property.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="work-card card">
        <div className="card-body p-4">
          <div className="mb-4">
            <p className="mb-1 text-muted-soft fw-semibold">Editor</p>
            <h2 className="h4 mb-0 fw-bold">
              {editingHotelId ? 'Update hotel' : 'Create hotel'}
            </h2>
          </div>

          <form className="d-grid gap-4" onSubmit={handleSubmit}>
            <div className="management-form-grid">
              <label className="auth-field">
                <span className="auth-field-label">Hotel name</span>
                <input
                  className="form-control"
                  onChange={(event) => handleFieldChange('name', event.target.value)}
                  required
                  type="text"
                  value={formState.name}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field-label">Featured image URL</span>
                <input
                  className="form-control"
                  onChange={(event) => handleFieldChange('featuredImageUrl', event.target.value)}
                  type="text"
                  value={formState.featuredImageUrl}
                />
              </label>

              <label className="auth-field management-form-span">
                <span className="auth-field-label">Description</span>
                <textarea
                  className="form-control"
                  onChange={(event) => handleFieldChange('description', event.target.value)}
                  rows={4}
                  value={formState.description}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field-label">Street</span>
                <input
                  className="form-control"
                  onChange={(event) => handleFieldChange('street', event.target.value)}
                  type="text"
                  value={formState.street}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field-label">City</span>
                <input
                  className="form-control"
                  onChange={(event) => handleFieldChange('city', event.target.value)}
                  required
                  type="text"
                  value={formState.city}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field-label">State</span>
                <input
                  className="form-control"
                  onChange={(event) => handleFieldChange('state', event.target.value)}
                  type="text"
                  value={formState.state}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field-label">Country</span>
                <input
                  className="form-control"
                  onChange={(event) => handleFieldChange('country', event.target.value)}
                  required
                  type="text"
                  value={formState.country}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field-label">Currency</span>
                <input
                  className="form-control"
                  maxLength={3}
                  onChange={(event) => handleFieldChange('baseCurrency', event.target.value.toUpperCase())}
                  required
                  type="text"
                  value={formState.baseCurrency}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field-label">Check-in time</span>
                <input
                  className="form-control"
                  onChange={(event) => handleFieldChange('checkInTime', event.target.value)}
                  type="text"
                  value={formState.checkInTime}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field-label">Check-out time</span>
                <input
                  className="form-control"
                  onChange={(event) => handleFieldChange('checkOutTime', event.target.value)}
                  type="text"
                  value={formState.checkOutTime}
                />
              </label>
            </div>

            <div className="form-check form-switch">
              <input
                checked={formState.isActive}
                className="form-check-input"
                id="hotel-active"
                onChange={(event) => handleFieldChange('isActive', event.target.checked)}
                type="checkbox"
              />
              <label className="form-check-label" htmlFor="hotel-active">
                Hotel is active
              </label>
            </div>

            {mutationStatus === 'succeeded' ? (
              <div className="auth-success" role="status">
                Hotel saved successfully.
              </div>
            ) : null}

            {mutationStatus === 'failed' && error ? (
              <div className="auth-alert" role="alert">
                {error}
              </div>
            ) : null}

            <div className="d-flex flex-wrap justify-content-end gap-2">
              <button className="btn btn-ghost-dark rounded-pill px-4" onClick={resetForm} type="button">
                Reset
              </button>
              <button
                className="btn btn-gold rounded-pill px-4"
                disabled={mutationStatus === 'loading'}
                type="submit"
              >
                {mutationStatus === 'loading'
                  ? 'Saving...'
                  : editingHotelId
                    ? 'Update hotel'
                    : 'Create hotel'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default HotelsPage
