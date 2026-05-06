import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import ErrorPanel from '../components/common/ErrorPanel'
import LoadingPanel from '../components/common/LoadingPanel'
import { initializeAuth } from '../features/auth/authSlice'
import {
  clearSettingsSuccess,
  fetchSettings,
  updateSettings,
} from '../features/settings/settingsSlice'
import {
  selectSettingsError,
  selectSettingsSaveStatus,
  selectSettingsSource,
  selectSettingsState,
  selectSettingsStatus,
  selectSettingsSuccessMessage,
} from '../features/settings/settingsSelectors'
import { formatDate } from '../utils/formatters'

function SettingsPage() {
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectSettingsState)
  const status = useAppSelector(selectSettingsStatus)
  const saveStatus = useAppSelector(selectSettingsSaveStatus)
  const error = useAppSelector(selectSettingsError)
  const source = useAppSelector(selectSettingsSource)
  const successMessage = useAppSelector(selectSettingsSuccessMessage)
  const [draftState, setDraftState] = useState(null)
  const formState = draftState || data

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSettings())
    }
  }, [dispatch, status])

  const updateProfileField = (field, value) => {
    setDraftState((currentState) => ({
      ...(currentState || data),
      profile: {
        ...(currentState || data).profile,
        [field]: value,
      },
    }))

    if (successMessage) {
      dispatch(clearSettingsSuccess())
    }
  }

  const updatePreferenceField = (section, field, value) => {
    setDraftState((currentState) => ({
      ...(currentState || data),
      preferences: {
        ...(currentState || data).preferences,
        [section]: {
          ...(currentState || data).preferences[section],
          [field]: value,
        },
      },
    }))

    if (successMessage) {
      dispatch(clearSettingsSuccess())
    }
  }

  const updateTheme = (value) => {
    setDraftState((currentState) => ({
      ...(currentState || data),
      preferences: {
        ...(currentState || data).preferences,
        theme: value,
      },
    }))

    if (successMessage) {
      dispatch(clearSettingsSuccess())
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const resultAction = await dispatch(
      updateSettings({
        name: formState.profile.name,
        email: formState.profile.email,
        phone: formState.profile.phone,
        preferences: formState.preferences,
      }),
    )

    if (updateSettings.fulfilled.match(resultAction)) {
      setDraftState(null)
      dispatch(initializeAuth(true))
    }
  }

  if (status === 'loading' && !formState) {
    return <LoadingPanel label="Loading settings" />
  }

  if (status === 'failed') {
    return <ErrorPanel message={error} onRetry={() => dispatch(fetchSettings())} />
  }

  if (!formState) {
    return <LoadingPanel label="Preparing settings" />
  }

  return (
    <div className="d-grid gap-4 fade-in-up">
      <section className="work-card card">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <p className="mb-1 text-muted-soft fw-semibold">Environment</p>
              <h2 className="h4 mb-0 fw-bold">{formState.environment.app_name}</h2>
            </div>

            <div className="d-flex flex-column align-items-start align-items-md-end">
              <small className="text-muted-soft">
                Source: {source === 'mock' ? 'local fallback data' : 'connected API'}
              </small>
              <small className="text-muted-soft">Timezone: {formState.environment.timezone}</small>
            </div>
          </div>

          <form className="d-grid gap-4" onSubmit={handleSubmit}>
            <div className="settings-form-grid">
              <div className="preference-tile">
                <p className="mb-3 fw-bold">Profile</p>
                <div className="d-grid gap-3">
                  <label className="auth-field">
                    <span className="auth-field-label">Full name</span>
                    <input
                      className="form-control"
                      onChange={(event) => updateProfileField('name', event.target.value)}
                      type="text"
                      value={formState.profile.name}
                    />
                  </label>
                  <label className="auth-field">
                    <span className="auth-field-label">Email address</span>
                    <input
                      className="form-control"
                      onChange={(event) => updateProfileField('email', event.target.value)}
                      type="email"
                      value={formState.profile.email || ''}
                    />
                  </label>
                  <label className="auth-field">
                    <span className="auth-field-label">Phone number</span>
                    <input
                      className="form-control"
                      onChange={(event) => updateProfileField('phone', event.target.value)}
                      type="text"
                      value={formState.profile.phone || ''}
                    />
                  </label>
                  <small className="text-muted-soft">
                    Last login:{' '}
                    {formState.profile.last_login_at
                      ? formatDate(formState.profile.last_login_at)
                      : 'Not available'}
                  </small>
                </div>
              </div>

              <div className="preference-tile">
                <p className="mb-3 fw-bold">Theme and defaults</p>
                <div className="d-grid gap-3">
                  <label className="auth-field">
                    <span className="auth-field-label">Theme</span>
                    <select
                      className="table-filter-select"
                      onChange={(event) => updateTheme(event.target.value)}
                      value={formState.preferences.theme}
                    >
                      <option value="gold">Gold</option>
                      <option value="orange">Orange</option>
                      <option value="dark">Dark</option>
                    </select>
                  </label>

                  <label className="auth-field">
                    <span className="auth-field-label">Revenue default range</span>
                    <select
                      className="table-filter-select"
                      onChange={(event) =>
                        updatePreferenceField('revenue', 'default_range', event.target.value)
                      }
                      value={formState.preferences.revenue.default_range}
                    >
                      <option value="7d">7 days</option>
                      <option value="30d">30 days</option>
                      <option value="90d">90 days</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            <div className="settings-form-grid">
              <div className="preference-tile">
                <p className="mb-3 fw-bold">Notifications</p>
                <div className="d-grid gap-3">
                  <div className="form-check form-switch">
                    <input
                      checked={formState.preferences.notifications.email}
                      className="form-check-input"
                      id="email-notifications"
                      onChange={(event) =>
                        updatePreferenceField('notifications', 'email', event.target.checked)
                      }
                      type="checkbox"
                    />
                    <label className="form-check-label" htmlFor="email-notifications">
                      Email notifications
                    </label>
                  </div>

                  <div className="form-check form-switch">
                    <input
                      checked={formState.preferences.notifications.sms}
                      className="form-check-input"
                      id="sms-notifications"
                      onChange={(event) =>
                        updatePreferenceField('notifications', 'sms', event.target.checked)
                      }
                      type="checkbox"
                    />
                    <label className="form-check-label" htmlFor="sms-notifications">
                      SMS notifications
                    </label>
                  </div>

                  <div className="form-check form-switch">
                    <input
                      checked={formState.preferences.notifications.reminders}
                      className="form-check-input"
                      id="checkin-reminders"
                      onChange={(event) =>
                        updatePreferenceField('notifications', 'reminders', event.target.checked)
                      }
                      type="checkbox"
                    />
                    <label className="form-check-label" htmlFor="checkin-reminders">
                      Check-in reminders
                    </label>
                  </div>
                </div>
              </div>

              <div className="preference-tile">
                <p className="mb-3 fw-bold">Dashboard behavior</p>
                <div className="d-grid gap-3">
                  <div className="form-check form-switch">
                    <input
                      checked={formState.preferences.dashboard.auto_sync}
                      className="form-check-input"
                      id="dashboard-auto-sync"
                      onChange={(event) =>
                        updatePreferenceField('dashboard', 'auto_sync', event.target.checked)
                      }
                      type="checkbox"
                    />
                    <label className="form-check-label" htmlFor="dashboard-auto-sync">
                      Auto sync dashboard panels
                    </label>
                  </div>

                  <div className="form-check form-switch">
                    <input
                      checked={formState.preferences.dashboard.compact_nav}
                      className="form-check-input"
                      id="compact-nav"
                      onChange={(event) =>
                        updatePreferenceField('dashboard', 'compact_nav', event.target.checked)
                      }
                      type="checkbox"
                    />
                    <label className="form-check-label" htmlFor="compact-nav">
                      Compact navigation behavior
                    </label>
                  </div>

                  <div className="form-check form-switch">
                    <input
                      checked={formState.preferences.dashboard.weekly_reports}
                      className="form-check-input"
                      id="weekly-reports"
                      onChange={(event) =>
                        updatePreferenceField('dashboard', 'weekly_reports', event.target.checked)
                      }
                      type="checkbox"
                    />
                    <label className="form-check-label" htmlFor="weekly-reports">
                      Weekly report reminders
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {successMessage ? (
              <div className="auth-success" role="status">
                {successMessage}
              </div>
            ) : null}

            {saveStatus === 'failed' && error ? (
              <div className="auth-alert" role="alert">
                {error}
              </div>
            ) : null}

            <div className="d-flex flex-wrap justify-content-end gap-2">
              <button
                className="btn btn-gold rounded-pill px-4"
                disabled={saveStatus === 'loading'}
                type="submit"
              >
                <Save size={16} />
                <span className="ms-2">
                  {saveStatus === 'loading' ? 'Saving...' : 'Save settings'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default SettingsPage
