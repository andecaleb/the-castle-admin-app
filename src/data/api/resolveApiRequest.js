import API_CONFIG from './apiConfig'
import { normalizeApiError } from './normalizeApiError'

const FALLBACK_STATUSES = new Set([404, 502, 503, 504])

function shouldUseFallback(error) {
  const status = error?.status || error?.response?.status || null
  const isNetworkFailure = status === null

  return API_CONFIG.enableFallback && (isNetworkFailure || FALLBACK_STATUSES.has(status))
}

export async function resolveApiRequest({ request, fallback, transform = (data) => data }) {
  try {
    const payload = await request()

    return {
      data: transform(payload),
      source: 'remote',
    }
  } catch (error) {
    if (!fallback || !shouldUseFallback(error)) {
      throw normalizeApiError(error)
    }

    const fallbackPayload = await Promise.resolve(fallback())

    return {
      data: transform(fallbackPayload),
      source: 'mock',
    }
  }
}
