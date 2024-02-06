/**
 * Error class that is thrown for storage related errors
 */
export class StorageError extends Error {
  /**
   * Create a new StorageError
   * @param message - The error message
   * @example
   * ```ts
   * throw new StorageError("This is an error message");
   * ```
   */
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}
