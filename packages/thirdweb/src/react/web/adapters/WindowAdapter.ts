import type { WindowAdapter } from "../../core/adapters/WindowAdapter.js";

/**
 * Web implementation of WindowAdapter using the browser's window.open API.
 * Opens URLs in a new tab/window.
 */
export class WebWindowAdapter implements WindowAdapter {
  /**
   * Opens a URL in a new browser tab/window.
   *
   * @param url - The URL to open
   * @returns Promise that resolves when the operation is initiated
   */
  async open(url: string): Promise<void> {
    // Use window.open to open URL in new tab
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/**
 * Default instance of the Web WindowAdapter.
 */
export const webWindowAdapter = new WebWindowAdapter();
