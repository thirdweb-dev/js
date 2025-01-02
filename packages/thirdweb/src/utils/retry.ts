/**
 * Attempts to execute a function that returns a promise and retries if the function throws an error.
 *
 * @param {Function} fn - A function that returns a promise to be executed.
 * @param {Object} options - Configuration options for the retry behavior.
 * @param {number} [options.retries=1] - The number of times to retry the function before failing.
 * @param {number} [options.delay=0] - The delay in milliseconds between retries.
 * @returns {Promise<void>} The result of the function execution if successful.
 */

export async function retry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; delay?: number },
): Promise<T> {
  const retries = options.retries ?? 1;
  const delay = options.delay ?? 0;
  let lastError: Error | null = null;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}
