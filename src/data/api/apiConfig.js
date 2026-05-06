const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 15000),
  enableFallback: import.meta.env.VITE_ENABLE_API_FALLBACK !== 'false',
  authToken: import.meta.env.VITE_API_TOKEN || '',
  tokenStorageKey: import.meta.env.VITE_API_TOKEN_STORAGE_KEY || 'castle_admin_token',
}

export default API_CONFIG
