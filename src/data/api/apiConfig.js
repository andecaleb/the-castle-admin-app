const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 15000),
  enableFallback: import.meta.env.VITE_ENABLE_API_FALLBACK !== 'false',
}

export default API_CONFIG
