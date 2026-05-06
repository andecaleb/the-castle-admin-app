import axios from 'axios'
import { normalizeApiError } from './normalizeApiError'

class ApiNetwork {
  constructor(config) {
    this.authTokenProvider = null
    this.unauthorizedHandler = null
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    this.setupInterceptors()
  }

  setAuthTokenProvider(provider) {
    this.authTokenProvider = provider
  }

  setUnauthorizedHandler(handler) {
    this.unauthorizedHandler = handler
  }

  setupInterceptors() {
    this.client.interceptors.request.use((requestConfig) => {
      const token = this.authTokenProvider?.()

      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`
      }

      return requestConfig
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const normalizedError = normalizeApiError(error)

        if (normalizedError.status === 401) {
          this.unauthorizedHandler?.(normalizedError)
        }

        return Promise.reject(normalizedError)
      },
    )
  }

  request(config) {
    return this.client.request(config).then((response) => response.data)
  }

  get(url, config = {}) {
    return this.request({ ...config, method: 'get', url })
  }

  post(url, data, config = {}) {
    return this.request({ ...config, method: 'post', url, data })
  }

  put(url, data, config = {}) {
    return this.request({ ...config, method: 'put', url, data })
  }

  patch(url, data, config = {}) {
    return this.request({ ...config, method: 'patch', url, data })
  }

  delete(url, config = {}) {
    return this.request({ ...config, method: 'delete', url })
  }
}

export default ApiNetwork
