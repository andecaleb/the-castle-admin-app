import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import LoadingPanel from '../common/LoadingPanel'
import { selectAuthStatus } from '../../features/auth/authSelectors'

function RequireAuth() {
  const status = useAppSelector(selectAuthStatus)
  const location = useLocation()

  if (status === 'idle' || status === 'checking') {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center p-4">
        <div className="w-100" style={{ maxWidth: 560 }}>
          <LoadingPanel label="Restoring your workspace" />
        </div>
      </div>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return <Outlet />
}

export default RequireAuth
