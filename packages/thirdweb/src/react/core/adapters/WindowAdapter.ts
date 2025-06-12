/**
 * WindowAdapter interface for platform-specific window/URL opening functionality.
 * This allows dependency inversion so core logic doesn't directly depend on platform APIs.
 */
export interface WindowAdapter {
  /**
   * Opens a URL in a new window/tab or appropriate platform mechanism.
   *
   * @param url - The URL to open
   * @returns Promise that resolves when the operation is initiated
   */
  open(url: string, title?: string, options?: string): Promise<void>;
}
