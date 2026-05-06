import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import LoadingPanel from '../common/LoadingPanel'
import { selectAuthStatus } from '../../features/auth/authSelectors'

function PublicOnlyRoute() {
  const status = useAppSelector(selectAuthStatus)

  if (status === 'idle' || status === 'checking') {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center p-4">
        <div className="w-100" style={{ maxWidth: 560 }}>
          <LoadingPanel label="Preparing your sign-in" />
        </div>
      </div>
    )
  }

  if (status === 'authenticated') {
    return <Navigate replace to="/" />
  }

  return <Outlet />
}

export default PublicOnlyRoute
