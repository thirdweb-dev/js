/**
 * Attempts to execute a function that returns a promise and retries if the function throws an error.
 *
 * @param {Function} fn - A function that returns a promise to be executed.
 * @param {Object} options - Configuration options for the retry behavior.
 * @param {number} [options.retries=1] - The number of times to retry the function before failing.
 * @param {number} [options.delay=0] - The base delay in milliseconds between retries.
 * @param {boolean} [options.backoff=false] - When true, applies exponential backoff with jitter to the delay between attempts.
 * @param {Function} [options.shouldRetry] - Predicate that decides whether a thrown error is retryable. When it returns false, the error is rethrown immediately without further retries.
 * @returns {Promise<void>} The result of the function execution if successful.
 */

export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    backoff?: boolean;
    shouldRetry?: (error: unknown) => boolean;
  },
): Promise<T> {
  const retries = options.retries ?? 1;
  const delay = options.delay ?? 0;
  const backoff = options.backoff ?? false;
  const shouldRetry = options.shouldRetry;
  let lastError: Error | null = null;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      // Bail out immediately on non-retryable errors (e.g. aborts, HTTP responses).
      if (shouldRetry && !shouldRetry(error)) {
        throw error;
      }
      // Don't sleep after the final attempt.
      const isLastAttempt = i === retries - 1;
      if (!isLastAttempt && delay > 0) {
        // Exponential backoff with full jitter to avoid thundering-herd retries.
        const waitMs = backoff
          ? Math.round(delay * 2 ** i * (0.5 + Math.random() * 0.5))
          : delay;
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }
  }
  throw lastError;
}
