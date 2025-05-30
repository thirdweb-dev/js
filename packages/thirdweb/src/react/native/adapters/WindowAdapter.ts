import { Linking } from "react-native";
import type { WindowAdapter } from "../../core/adapters/WindowAdapter.js";

/**
 * React Native implementation of WindowAdapter using Linking.openURL.
 * Opens URLs in the default browser or appropriate app.
 */
export class NativeWindowAdapter implements WindowAdapter {
  /**
   * Opens a URL using React Native's Linking API.
   *
   * @param url - The URL to open
   * @returns Promise that resolves when the operation is initiated
   */
  async open(url: string): Promise<void> {
    try {
      // Check if the URL can be opened
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        throw new Error(`Cannot open URL: ${url}`);
      }

      // Open the URL
      await Linking.openURL(url);
    } catch (error) {
      console.warn("Failed to open URL:", error);
      throw new Error(`Failed to open URL: ${url}`);
    }
  }
}

/**
 * Default instance of the Native WindowAdapter.
 */
export const nativeWindowAdapter = new NativeWindowAdapter();
