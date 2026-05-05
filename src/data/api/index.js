import ApiNetwork from './ApiNetwork'
import API_CONFIG from './apiConfig'

export { API_ROUTES } from './apiRoutes'
export { normalizeApiError } from './normalizeApiError'
export { resolveApiRequest } from './resolveApiRequest'

export const apiNetwork = new ApiNetwork(API_CONFIG)
