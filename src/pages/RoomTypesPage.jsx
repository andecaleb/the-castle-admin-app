import { useEffect, useMemo, useState } from 'react'
import { Layers3, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import ErrorPanel from '../components/common/ErrorPanel'
import LoadingPanel from '../components/common/LoadingPanel'
import StatusBadge from '../components/common/StatusBadge'
import {
  selectRoomTypesError,
  selectRoomTypesItems,
  selectRoomTypesMutationStatus,
  selectRoomTypesSource,
  selectRoomTypesState,
  selectRoomTypesStatus,
} from '../features/roomTypes/roomTypesSelectors'
import {
  clearRoomTypesMutationState,
  createRoomType,
  deleteRoomType,
  fetchRoomTypes,
  updateRoomType,
} from '../features/roomTypes/roomTypesSlice'

const INITIAL_ROOM_TYPE_FORM = {
  name: '',
  slug: '',
  description: '',
  sortOrder: 0,
  isActive: true,
}

function getRoomTypeFormState(roomType = INITIAL_ROOM_TYPE_FORM) {
  return {
    name: roomType.name || '',
    slug: roomType.slug || '',
    description: roomType.description || '',
    sortOrder: roomType.sortOrder || 0,
    isActive: roomType.isActive ?? true,
  }
}

function RoomTypesPage() {
  const dispatch = useAppDispatch()
  const { pagination } = useAppSelector(selectRoomTypesState)
  const roomTypes = useAppSelector(selectRoomTypesItems)
  const status = useAppSelector(selectRoomTypesStatus)
  const mutationStatus = useAppSelector(selectRoomTypesMutationStatus)
  const error = useAppSelector(selectRoomTypesError)
  const source = useAppSelector(selectRoomTypesSource)
  const [editingRoomTypeId, setEditingRoomTypeId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formState, setFormState] = useState(INITIAL_ROOM_TYPE_FORM)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRoomTypes())
    }
  }, [dispatch, status])

  const visibleRoomTypes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return roomTypes.filter((roomType) => {
      const haystack = [roomType.name, roomType.slug, roomType.description]
        .join(' ')
        .toLowerCase()

      return normalizedSearch.length === 0 || haystack.includes(normalizedSearch)
    })
  }, [roomTypes, searchTerm])

  const summary = useMemo(() => {
    return {
      active: roomTypes.filter((roomType) => roomType.isActive).length,
      assignedRooms: roomTypes.reduce((sum, roomType) => sum + roomType.roomsCount, 0),
    }
  }, [roomTypes])

  const resetForm = () => {
    setEditingRoomTypeId(null)
    setFormState(INITIAL_ROOM_TYPE_FORM)
    dispatch(clearRoomTypesMutationState())
  }

  const handleEdit = (roomType) => {
    setEditingRoomTypeId(roomType.id)
    setFormState(getRoomTypeFormState(roomType))
    dispatch(clearRoomTypesMutationState())
  }

  const handleFieldChange = (field, value) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }))

    if (mutationStatus !== 'idle') {
      dispatch(clearRoomTypesMutationState())
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      name: formState.name,
      slug: formState.slug || undefined,
      description: formState.description,
      sort_order: Number(formState.sortOrder || 0),
      is_active: formState.isActive,
    }

    const action = editingRoomTypeId
      ? updateRoomType({ id: editingRoomTypeId, payload })
      : createRoomType(payload)

    const resultAction = await dispatch(action)

    if (createRoomType.fulfilled.match(resultAction) || updateRoomType.fulfilled.match(resultAction)) {
      resetForm()
      dispatch(fetchRoomTypes())
    }
  }

  const handleDelete = async (roomType) => {
    const confirmed = window.confirm(`Delete ${roomType.name}?`)

    if (!confirmed) {
      return
    }

    const resultAction = await dispatch(deleteRoomType(roomType.id))

    if (deleteRoomType.fulfilled.match(resultAction)) {
      if (editingRoomTypeId === roomType.id) {
        resetForm()
      }

      dispatch(fetchRoomTypes())
    }
  }

  if (status === 'loading' && roomTypes.length === 0) {
    return <LoadingPanel label="Loading room types" />
  }

  if (status === 'failed' && roomTypes.length === 0) {
    return <ErrorPanel message={error} onRetry={() => dispatch(fetchRoomTypes())} />
  }

  return (
    <div className="d-grid gap-4 fade-in-up">
      <section className="row g-3">
        <div className="col-md-4">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Room types</p>
              <h2 className="summary-value">{pagination?.total || roomTypes.length}</h2>
              <p className="summary-subtext">Catalog entries used to differentiate accommodation.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Active types</p>
              <h2 className="summary-value">{summary.active}</h2>
              <p className="summary-subtext">Available to room editors and guest-facing channels.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="summary-card card h-100">
            <div className="card-body">
              <p className="summary-label">Assigned rooms</p>
              <h2 className="summary-value">{summary.assignedRooms}</h2>
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
                <p className="mb-1 text-muted-soft fw-semibold">Catalog management</p>
                <h2 className="h4 mb-0 fw-bold">Room type registry</h2>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-ghost-dark rounded-pill px-3"
                  onClick={() => dispatch(fetchRoomTypes())}
                  type="button"
                >
                  <RefreshCw size={16} />
                  <span className="ms-2">Refresh</span>
                </button>
                <button className="btn btn-gold rounded-pill px-3" onClick={resetForm} type="button">
                  <Plus size={16} />
                  <span className="ms-2">New room type</span>
                </button>
              </div>
            </div>

            <div className="toolbar-grid">
              <label className="table-search-control">
                <Layers3 size={18} className="text-muted-soft" />
                <input
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search room type name or slug"
                  type="search"
                  value={searchTerm}
                />
              </label>

              <div className="table-search-control">
                <span className="fw-semibold">{summary.active} active room types</span>
              </div>

              <div className="table-search-control">
                <span className="fw-semibold">{visibleRoomTypes.length} room types in this view</span>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table booking-table align-middle">
                <thead>
                  <tr>
                    <th>Room type</th>
                    <th>Slug</th>
                    <th>Rooms</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRoomTypes.map((roomType) => (
                    <tr key={roomType.id}>
                      <td>
                        <div className="fw-bold">{roomType.name}</div>
                        <small className="text-muted-soft">
                          {roomType.description || 'No description yet'}
                        </small>
                      </td>
                      <td>{roomType.slug}</td>
                      <td className="fw-bold">{roomType.roomsCount}</td>
                      <td>
                        <StatusBadge value={roomType.isActive ? 'active' : 'inactive'} />
                      </td>
                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-sm btn-ghost-dark rounded-pill px-3"
                            onClick={() => handleEdit(roomType)}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            onClick={() => handleDelete(roomType)}
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

            {visibleRoomTypes.length === 0 ? (
              <div className="empty-state">
                <p className="mb-1 fw-bold">No room types match this view</p>
                <p className="mb-0 text-muted-soft">
                  Try clearing the search or defining the next category.
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
              {editingRoomTypeId ? 'Update room type' : 'Create room type'}
            </h2>
          </div>

          <form className="d-grid gap-4" onSubmit={handleSubmit}>
            <div className="management-form-grid">
              <label className="auth-field">
                <span className="auth-field-label">Name</span>
                <input
                  className="form-control"
                  onChange={(event) => handleFieldChange('name', event.target.value)}
                  required
                  type="text"
                  value={formState.name}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field-label">Slug</span>
                <input
                  className="form-control"
                  onChange={(event) => handleFieldChange('slug', event.target.value)}
                  type="text"
                  value={formState.slug}
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
                <span className="auth-field-label">Sort order</span>
                <input
                  className="form-control"
                  min="0"
                  onChange={(event) => handleFieldChange('sortOrder', event.target.value)}
                  type="number"
                  value={formState.sortOrder}
                />
              </label>
            </div>

            <div className="form-check form-switch">
              <input
                checked={formState.isActive}
                className="form-check-input"
                id="room-type-active"
                onChange={(event) => handleFieldChange('isActive', event.target.checked)}
                type="checkbox"
              />
              <label className="form-check-label" htmlFor="room-type-active">
                Room type is active
              </label>
            </div>

            {mutationStatus === 'succeeded' ? (
              <div className="auth-success" role="status">
                Room type saved successfully.
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
                  : editingRoomTypeId
                    ? 'Update room type'
                    : 'Create room type'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default RoomTypesPage
