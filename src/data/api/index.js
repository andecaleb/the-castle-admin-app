import ApiNetwork from './ApiNetwork'
import API_CONFIG from './apiConfig'
import { getStoredAuthToken } from '../auth/authToken'

export { API_ROUTES } from './apiRoutes'
export { normalizeApiError } from './normalizeApiError'
export { resolveApiRequest } from './resolveApiRequest'

export const apiNetwork = new ApiNetwork(API_CONFIG)
apiNetwork.setAuthTokenProvider(getStoredAuthToken)
