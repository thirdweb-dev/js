import { replaceSchemeWithGatewayUrl } from "../../common/utils";
import { GatewayUrls, IStorageDownloader } from "../../types";
import fetch from "cross-fetch";

/**
 * Default downloader used - handles downloading from all schemes specified in the gateway URLs configuration.
 *
 * @example
 * ```jsx
 * // Can instantiate the downloader with the default gateway URLs
 * const downloader = new StorageDownloader();
 * const storage = new ThirdwebStorage({ downloader });
 * ```
 *
 * @public
 */
export class StorageDownloader implements IStorageDownloader {
  async download(
    uri: string,
    gatewayUrls: GatewayUrls,
    attempts = 0,
  ): Promise<Response> {

    if (attempts > 3) {
      throw new Error(
        "[FAILED_TO_DOWNLOAD_ERROR] Failed to download from URI - too many attempts failed.",
      );
    }

    // Replace recognized scheme with the highest priority gateway URL that hasn't already been attempted
    const resolvedUri = replaceSchemeWithGatewayUrl(uri, gatewayUrls, attempts);
    // If every gateway URL we know about for the designated scheme has been tried (via recursion) and failed, throw an error
    if (!resolvedUri) {
      throw new Error(
        "[FAILED_TO_DOWNLOAD_ERROR] Unable to download from URI - all gateway URLs failed to respond.",
      );
    } else if (attempts > 0) {
      console.warn(
        `Retrying download with backup gateway URL: ${resolvedUri}`,
      );
    }

    const resOrErr =
      await fetch(resolvedUri)
        .catch(err => err)

    if (resOrErr.ok) {
      return resOrErr
    }

    if (resOrErr instanceof Response) {
      if (resOrErr.status === 403) {
        // Don't retry if the content is blacklisted
        console.error(
          `Request to ${resolvedUri} failed with status 403 - Forbidden. This content is probably blacklisted. Search VirusTotal for this URL: ${resolvedUri} `
        );
        return resOrErr
      }

      console.warn(
        `Request to ${resolvedUri} failed with status ${resOrErr.status} - ${resOrErr.statusText}`,
      );

      // Only retry if we see 408 or >= 500 that are likely to be resolved by trying another gateway
      if (resOrErr.status !== 408 && resOrErr.status < 500) {
        return resOrErr
      }
    } else {
      console.warn(
        `Request to ${resolvedUri} failed with error`, resOrErr
      );
    }

    // Since the current gateway failed, recursively try the next one we know about
    return this.download(uri, gatewayUrls, attempts + 1);
  }
}
