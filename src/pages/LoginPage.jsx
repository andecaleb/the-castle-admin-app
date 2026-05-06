import { useEffect, useMemo, useState } from 'react'
import { LockKeyhole, PhoneCall, ShieldCheck } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { clearAuthError, login } from '../features/auth/authSlice'
import {
  selectAuthError,
  selectAuthStatus,
  selectLoginStatus,
} from '../features/auth/authSelectors'

const INITIAL_FORM = {
  login: 'admin@castle.test',
  password: 'password123',
}

function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const authStatus = useAppSelector(selectAuthStatus)
  const loginStatus = useAppSelector(selectLoginStatus)
  const error = useAppSelector(selectAuthError)
  const [formState, setFormState] = useState(INITIAL_FORM)
  const destination = useMemo(() => location.state?.from?.pathname || '/', [location.state])

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate(destination, { replace: true })
    }
  }, [authStatus, destination, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearAuthError())
    }
  }, [dispatch])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }))

    if (error) {
      dispatch(clearAuthError())
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await dispatch(login(formState))
  }

  return (
    <div className="login-shell">
      <div className="container py-4 py-lg-5">
        <div className="row g-4 align-items-stretch justify-content-center">
          <div className="col-xl-10">
            <div className="row g-4">
              <div className="col-lg-6">
                <section className="login-showcase h-100">
                  <span className="badge rounded-pill gold-pill mb-3">Castle network</span>
                  <h1 className="display-6 fw-bold mb-3">
                    Stay close to bookings, rooms, guests, and revenue.
                  </h1>
                  <p className="text-white-50 mb-4">
                    Sign in with your admin account to work against the live Laravel API.
                  </p>

                  <div className="d-grid gap-3">
                    <div className="login-signal">
                      <ShieldCheck size={18} />
                      <div>
                        <strong>Protected session</strong>
                        <p className="mb-0 text-white-50">
                          Token-based access backed by the backend auth flow.
                        </p>
                      </div>
                    </div>

                    <div className="login-signal">
                      <PhoneCall size={18} />
                      <div>
                        <strong>Email or phone login</strong>
                        <p className="mb-0 text-white-50">
                          The API accepts the same credential field for either path.
                        </p>
                      </div>
                    </div>

                    <div className="login-signal">
                      <LockKeyhole size={18} />
                      <div>
                        <strong>Admin-first access</strong>
                        <p className="mb-0 text-white-50">
                          Dashboard, bookings, and reports stay behind authenticated routes.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="col-lg-6">
                <section className="auth-card h-100">
                  <div className="mb-4">
                    <p className="mb-1 text-muted-soft fw-semibold">Welcome back</p>
                    <h2 className="h3 mb-2 fw-bold">Admin sign in</h2>
                    <p className="mb-0 text-muted-soft">
                      Use your email address or phone number to continue.
                    </p>
                  </div>

                  <form className="d-grid gap-3" onSubmit={handleSubmit}>
                    <label className="auth-field">
                      <span className="auth-field-label">Email or phone</span>
                      <input
                        autoComplete="username"
                        className="form-control form-control-lg"
                        name="login"
                        onChange={handleChange}
                        placeholder="admin@castle.test"
                        required
                        type="text"
                        value={formState.login}
                      />
                    </label>

                    <label className="auth-field">
                      <span className="auth-field-label">Password</span>
                      <input
                        autoComplete="current-password"
                        className="form-control form-control-lg"
                        name="password"
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        type="password"
                        value={formState.password}
                      />
                    </label>

                    {error ? (
                      <div className="auth-alert" role="alert">
                        {error}
                      </div>
                    ) : null}

                    <button
                      className="btn btn-gold btn-lg rounded-pill mt-2"
                      disabled={loginStatus === 'loading'}
                      type="submit"
                    >
                      {loginStatus === 'loading' ? 'Signing in...' : 'Sign in'}
                    </button>
                  </form>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
