import { useEffect, useMemo, useState } from 'react'
import { BedDouble, ImagePlus, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import ErrorPanel from '../components/common/ErrorPanel'
import LoadingPanel from '../components/common/LoadingPanel'
import StatusBadge from '../components/common/StatusBadge'
import { selectHotelsError, selectHotelsItems, selectHotelsStatus } from '../features/hotels/hotelsSelectors'
import { fetchHotels } from '../features/hotels/hotelsSlice'
import {
  selectRoomsError,
  selectRoomsItems,
  selectRoomsMutationStatus,
  selectRoomsSource,
  selectRoomsState,
  selectRoomsStatus,
} from '../features/rooms/roomsSelectors'
import {
  clearRoomsMutationState,
  createRoom,
  deleteRoom,
  fetchRooms,
  updateRoom,
} from '../features/rooms/roomsSlice'
import {
  selectRoomTypesError,
  selectRoomTypesItems,
  selectRoomTypesStatus,
} from '../features/roomTypes/roomTypesSelectors'
import { fetchRoomTypes } from '../features/roomTypes/roomTypesSlice'
import { formatCurrency } from '../utils/formatters'

const INITIAL_ROOM_FORM = {
  hotelId: '',
  roomTypeId: '',
  name: '',
  description: '',
  basePrice: '',
  maxGuests: '1',
  sizeSqm: '',
  bedConfiguration: '',
  totalUnits: '1',
  isActive: true,
  imageUrls: '',
}

function getRoomFormState(room = INITIAL_ROOM_FORM) {
  return {
    hotelId: room.hotelId ? String(room.hotelId) : '',
    roomTypeId: room.roomTypeId ? String(room.roomTypeId) : '',
    name: room.name || '',
    description: room.description || '',
    basePrice: room.basePrice ? String(room.basePrice) : '',
    maxGuests: room.maxGuests ? String(room.maxGuests) : '1',
    sizeSqm: room.sizeSqm ? String(room.sizeSqm) : '',
    bedConfiguration: room.bedConfiguration || '',
    totalUnits: room.totalUnits ? String(room.totalUnits) : '1',
    isActive: room.isActive ?? true,
    imageUrls: (room.images || []).map((image) => image.imageUrl).join('\n'),
  }
}

function RoomsPage() {
  const dispatch = useAppDispatch()
  const { pagination } = useAppSelector(selectRoomsState)
  const rooms = useAppSelector(selectRoomsItems)
  const roomsStatus = useAppSelector(selectRoomsStatus)
  const mutationStatus = useAppSelector(selectRoomsMutationStatus)
  const roomsError = useAppSelector(selectRoomsError)
  const source = useAppSelector(selectRoomsSource)
  const hotels = useAppSelector(selectHotelsItems)
  const hotelsStatus = useAppSelector(selectHotelsStatus)
  const hotelsError = useAppSelector(selectHotelsError)
  const roomTypes = useAppSelector(selectRoomTypesItems)
  const roomTypesStatus = useAppSelector(selectRoomTypesStatus)
  const roomTypesError = useAppSelector(selectRoomTypesError)
  const [editingRoomId, setEditingRoomId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHotelId, setSelectedHotelId] = useState('all')
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState('all')
  const [formState, setFormState] = useState(INITIAL_ROOM_FORM)

  useEffect(() => {
    if (roomsStatus === 'idle') {
      dispatch(fetchRooms())
    }

    if (hotelsStatus === 'idle') {
      dispatch(fetchHotels())
    }

    if (roomTypesStatus === 'idle') {
      dispatch(fetchRoomTypes())
    }
  }, [dispatch, hotelsStatus, roomTypesStatus, roomsStatus])

  const visibleRooms = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return rooms.filter((room) => {
      const matchesHotel =
        selectedHotelId === 'all' ? true : String(room.hotelId) === String(selectedHotelId)
      const matchesRoomType =
        selectedRoomTypeId === 'all'
          ? true
          : String(room.roomTypeId) === String(selectedRoomTypeId)
      const haystack = [
        room.name,
        room.hotelName,
        room.roomTypeName,
        room.description,
        room.bedConfiguration,
      ]
        .join(' ')
        .toLowerCase()
      const matchesSearch =
        normalizedSearch.length === 0 || haystack.includes(normalizedSearch)

      return matchesHotel && matchesRoomType && matchesSearch
    })
  }, [rooms, searchTerm, selectedHotelId, selectedRoomTypeId])

  const summary = useMemo(() => {
    const activeRooms = rooms.filter((room) => room.isActive).length
    const totalUnits = rooms.reduce((sum, room) => sum + room.totalUnits, 0)
    const averageRate =
      rooms.length > 0
        ? rooms.reduce((sum, room) => sum + room.basePrice, 0) / rooms.length
        : 0

    return {
      activeRooms,
      totalUnits,
      averageRate,
    }
  }, [rooms])

  const resetForm = () => {
    setEditingRoomId(null)
    setFormState(INITIAL_ROOM_FORM)
    dispatch(clearRoomsMutationState())
  }

  const handleEdit = (room) => {
    setEditingRoomId(room.id)
    setFormState(getRoomFormState(room))
    dispatch(clearRoomsMutationState())
  }

  const handleFieldChange = (field, value) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }))

    if (mutationStatus !== 'idle') {
      dispatch(clearRoomsMutationState())
    }
  }

  const buildImagesPayload = () =>
    formState.imageUrls
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean)
      .map((imageUrl, index) => ({
        image_url: imageUrl,
        alt_text: `${formState.name || 'Room'} image ${index + 1}`,
        is_primary: index === 0,
        sort_order: index,
      }))

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      hotel_id: Number(formState.hotelId),
      room_type_id: Number(formState.roomTypeId),
      name: formState.name,
      description: formState.description,
      base_price: Number(formState.basePrice || 0),
      max_guests: Number(formState.maxGuests || 1),
      size_sqm: formState.sizeSqm ? Number(formState.sizeSqm) : null,
      bed_configuration: formState.bedConfiguration,
      total_units: Number(formState.totalUnits || 1),
      is_active: formState.isActive,
      images: buildImagesPayload(),
    }

    const action = editingRoomId
      ? updateRoom({ id: editingRoomId, payload })
      : createRoom(payload)

    const resultAction = await dispatch(action)

    if (createRoom.fulfilled.match(resultAction) || updateRoom.fulfilled.match(resultAction)) {
      resetForm()
      dispatch(fetchRooms())
    }
  }

  const handleDelete = async (room) => {
    const confirmed = window.confirm(`Delete ${room.name}?`)

    if (!confirmed) {
      return
    }

    const resultAction = await dispatch(deleteRoom(room.id))

    if (deleteRoom.fulfilled.match(resultAction)) {
      if (editingRoomId === room.id) {
        resetForm()
      }

      dispatch(fetchRooms())
    }
  }

  const combinedError = roomsError || hotelsError || roomTypesError
  const isBootLoading =
    (roomsStatus === 'loading' && rooms.length === 0) ||
    (hotelsStatus === 'loading' && hotels.length === 0) ||
    (roomTypesStatus === 'loading' && roomTypes.length === 0)
  const isBootFailed =
    (roomsStatus === 'failed' && rooms.length === 0) ||
    (hotelsStatus === 'failed' && hotels.length === 0) ||
    (roomTypesStatus === 'failed' && roomTypes.length === 0)

  if (isBootLoading) {
    return <LoadingPanel label="Loading rooms" />
  }

  if (isBootFailed) {
    return <ErrorPanel message={combinedError} onRetry={() => {
      dispatch(fetchRooms())
      dispatch(fetchHotels())
      dispatch(fetchRoomTypes())
    }} />
  }

  return (
    <div className="d-grid gap-4 fade-in-up">
      <section className="row g-3">
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Rooms</p>
              <h2 className="summary-value">{pagination?.total || rooms.length}</h2>
              <p className="summary-subtext">Sellable room records managed across hotels.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Active rooms</p>
              <h2 className="summary-value">{summary.activeRooms}</h2>
              <p className="summary-subtext">Available for inventory and booking workflows.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Total units</p>
              <h2 className="summary-value">{summary.totalUnits}</h2>
              <p className="summary-subtext">Capacity managed at the room-record level.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Average nightly rate</p>
              <h2 className="summary-value">{formatCurrency(summary.averageRate, 'NGN')}</h2>
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
                <p className="mb-1 text-muted-soft fw-semibold">Room management</p>
                <h2 className="h4 mb-0 fw-bold">Rooms registry</h2>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-ghost-dark rounded-pill px-3"
                  onClick={() => dispatch(fetchRooms())}
                  type="button"
                >
                  <RefreshCw size={16} />
                  <span className="ms-2">Refresh</span>
                </button>
                <button className="btn btn-gold rounded-pill px-3" onClick={resetForm} type="button">
                  <Plus size={16} />
                  <span className="ms-2">New room</span>
                </button>
              </div>
            </div>

            <div className="filter-grid-wide">
              <label className="table-search-control">
                <BedDouble size={18} className="text-muted-soft" />
                <input
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search room, hotel, or room type"
                  type="search"
                  value={searchTerm}
                />
              </label>

              <select
                className="table-filter-select"
                onChange={(event) => setSelectedHotelId(event.target.value)}
                value={selectedHotelId}
              >
                <option value="all">All hotels</option>
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>

              <select
                className="table-filter-select"
                onChange={(event) => setSelectedRoomTypeId(event.target.value)}
                value={selectedRoomTypeId}
              >
                <option value="all">All room types</option>
                {roomTypes.map((roomType) => (
                  <option key={roomType.id} value={roomType.id}>
                    {roomType.name}
                  </option>
                ))}
              </select>

              <div className="table-search-control">
                <span className="fw-semibold">{visibleRooms.length} rooms in this view</span>
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
                    <th>Capacity</th>
                    <th>Images</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRooms.map((room) => (
                    <tr key={room.id}>
                      <td>
                        <div className="fw-bold">{room.name}</div>
                        <small className="text-muted-soft">{room.description || 'No description yet'}</small>
                      </td>
                      <td>
                        <div>{room.hotelName}</div>
                        <small className="text-muted-soft">{room.hotelCity}</small>
                      </td>
                      <td>
                        <div className="fw-semibold">{room.roomTypeName}</div>
                        <small className="text-muted-soft">{room.bedConfiguration}</small>
                      </td>
                      <td className="fw-bold">{formatCurrency(room.basePrice, 'NGN')}</td>
                      <td>
                        <div>{room.totalUnits} units</div>
                        <small className="text-muted-soft">{room.maxGuests} guests max</small>
                      </td>
                      <td>
                        <div className="room-image-strip">
                          {room.images.slice(0, 3).map((image) => (
                            <img
                              alt={image.altText || room.name}
                              className="room-image-thumb"
                              key={image.id || image.imageUrl}
                              src={image.imageUrl}
                            />
                          ))}
                          {room.images.length === 0 ? (
                            <span className="text-muted-soft small">No images</span>
                          ) : null}
                        </div>
                      </td>
                      <td>
                        <StatusBadge value={room.isActive ? 'active' : 'inactive'} />
                      </td>
                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-sm btn-ghost-dark rounded-pill px-3"
                            onClick={() => handleEdit(room)}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            onClick={() => handleDelete(room)}
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

            {visibleRooms.length === 0 ? (
              <div className="empty-state">
                <p className="mb-1 fw-bold">No rooms match this view</p>
                <p className="mb-0 text-muted-soft">
                  Try clearing the filters or adding the next room record.
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
              {editingRoomId ? 'Update room' : 'Create room'}
            </h2>
          </div>

          <form className="d-grid gap-4" onSubmit={handleSubmit}>
            <div className="management-form-grid">
              <label className="auth-field">
                <span className="auth-field-label">Hotel</span>
                <select
                  className="table-filter-select"
                  onChange={(event) => handleFieldChange('hotelId', event.target.value)}
                  required
                  value={formState.hotelId}
                >
                  <option value="">Select hotel</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="auth-field">
                <span className="auth-field-label">Room type</span>
                <select
                  className="table-filter-select"
                  onChange={(event) => handleFieldChange('roomTypeId', event.target.value)}
                  required
                  value={formState.roomTypeId}
                >
                  <option value="">Select room type</option>
                  {roomTypes.map((roomType) => (
                    <option key={roomType.id} value={roomType.id}>
                      {roomType.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="auth-field">
                <span className="auth-field-label">Room name</span>
                <input
                  className="form-control"
                  onChange={(event) => handleFieldChange('name', event.target.value)}
                  required
                  type="text"
                  value={formState.name}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field-label">Nightly rate</span>
                <input
                  className="form-control"
                  min="0"
                  onChange={(event) => handleFieldChange('basePrice', event.target.value)}
                  required
                  type="number"
                  value={formState.basePrice}
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
                <span className="auth-field-label">Maximum guests</span>
                <input
                  className="form-control"
                  min="1"
                  onChange={(event) => handleFieldChange('maxGuests', event.target.value)}
                  required
                  type="number"
                  value={formState.maxGuests}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field-label">Size (sqm)</span>
                <input
                  className="form-control"
                  min="1"
                  onChange={(event) => handleFieldChange('sizeSqm', event.target.value)}
                  type="number"
                  value={formState.sizeSqm}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field-label">Bed configuration</span>
                <input
                  className="form-control"
                  onChange={(event) => handleFieldChange('bedConfiguration', event.target.value)}
                  type="text"
                  value={formState.bedConfiguration}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field-label">Total units</span>
                <input
                  className="form-control"
                  min="1"
                  onChange={(event) => handleFieldChange('totalUnits', event.target.value)}
                  required
                  type="number"
                  value={formState.totalUnits}
                />
              </label>

              <label className="auth-field management-form-span">
                <span className="auth-field-label">Image URLs</span>
                <textarea
                  className="form-control"
                  onChange={(event) => handleFieldChange('imageUrls', event.target.value)}
                  placeholder="One image URL per line"
                  rows={5}
                  value={formState.imageUrls}
                />
                <small className="text-muted-soft">The first image becomes the primary room image.</small>
              </label>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-3">
              <div className="form-check form-switch">
                <input
                  checked={formState.isActive}
                  className="form-check-input"
                  id="room-active"
                  onChange={(event) => handleFieldChange('isActive', event.target.checked)}
                  type="checkbox"
                />
                <label className="form-check-label" htmlFor="room-active">
                  Room is active
                </label>
              </div>

              <div className="editor-tip">
                <ImagePlus size={16} />
                <span>Gallery images are saved directly to the room record.</span>
              </div>
            </div>

            {mutationStatus === 'succeeded' ? (
              <div className="auth-success" role="status">
                Room saved successfully.
              </div>
            ) : null}

            {mutationStatus === 'failed' && roomsError ? (
              <div className="auth-alert" role="alert">
                {roomsError}
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
                  : editingRoomId
                    ? 'Update room'
                    : 'Create room'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default RoomsPage
