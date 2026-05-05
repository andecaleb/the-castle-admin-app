export function normalizeApiError(error) {
  return {
    message:
      error?.response?.data?.message ||
      error?.message ||
      'Unexpected error while contacting the server.',
    status: error?.response?.status || error?.status || null,
    details: error?.response?.data || error?.details || null,
  }
}
