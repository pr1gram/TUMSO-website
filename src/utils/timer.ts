const CLOSE_TIMESTAMP = 1673413200000
export const isClosed = (byPass: boolean | undefined): boolean => {
  if (byPass === true) {
    return false
  }
  return new Date().getTime() >= CLOSE_TIMESTAMP
}
