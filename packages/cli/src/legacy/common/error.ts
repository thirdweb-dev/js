/**
 * @internal
 */
export class UploadError extends Error {
  /** @internal */
  constructor(message: string) {
    super(`UPLOAD_FAILED: ${message}`);
  }
}

/**
 * @internal
 */
export class DuplicateFileNameError extends Error {
  /** @internal */
  constructor(fileName: string) {
    super(
      `DUPLICATE_FILE_NAME_ERROR: File name ${fileName} was passed for more than one file.`,
    );
  }
}

/**
 * Thrown when data fails to fetch from storage.
 * @internal
 */
export class FetchError extends Error {
  public innerError?: Error;

  /** @internal */
  constructor(message: string, innerError?: Error) {
    super(`FETCH_FAILED: ${message}`);
    this.innerError = innerError;
  }
}
