export class FetchError extends Error {
  constructor(
    public res?: Response,
    message?: string,
  ) {
    super(message);
  }
}
