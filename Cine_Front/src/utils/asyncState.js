export function getAsyncState({ isLoading, error, data }) {
  if (isLoading) return 'loading'
  if (error) return 'error'
  if (data == null || (Array.isArray(data) && data.length === 0)) return 'empty'
  return 'success'
}
