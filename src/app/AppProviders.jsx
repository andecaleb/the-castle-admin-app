import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { apiNetwork } from '../data/api'
import { initializeAuth, sessionExpired } from '../features/auth/authSlice'
import { useAppDispatch } from './hooks'
import store from './store'

function SessionBridge({ children }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  useEffect(() => {
    apiNetwork.setUnauthorizedHandler((error) => {
      dispatch(sessionExpired(error))
    })

    return () => {
      apiNetwork.setUnauthorizedHandler(null)
    }
  }, [dispatch])

  return children
}

function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <SessionBridge>{children}</SessionBridge>
      </BrowserRouter>
    </Provider>
  )
}

export default AppProviders
