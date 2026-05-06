import API_CONFIG from '../api/apiConfig'

export function getStoredAuthToken() {
  if (API_CONFIG.authToken) {
    return API_CONFIG.authToken
  }

  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(API_CONFIG.tokenStorageKey)
}

export function persistAuthToken(token) {
  if (typeof window === 'undefined' || !token || API_CONFIG.authToken) {
    return
  }

  window.localStorage.setItem(API_CONFIG.tokenStorageKey, token)
}

export function clearStoredAuthToken() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(API_CONFIG.tokenStorageKey)
}
