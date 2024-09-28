/**
 * Delay an async thread
 * @param ms Sleep time in millisecond
 * @internal
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
