import { prepareGatewayUrls } from "../../common/urls";
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
 * const storage = new ThirdwebStorage(undefined, downloader);
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
    // Replace recognized scheme with the highest priority gateway URL that hasn't already been attempted
    let resolvedUri;
    try {
      resolvedUri = replaceSchemeWithGatewayUrl(uri, gatewayUrls, attempts);
    } catch (err: any) {
      // If every gateway URL we know about for the designated scheme has been tried (via recursion) and failed, throw an error
      if (err.includes("[GATEWAY_URL_ERROR]")) {
        throw new Error(
          "[FAILED_TO_DOWNLOAD_ERROR] Unable to download from URI - all gateway URLs failed to respond.",
        );
      }

      throw err;
    }

    const res = await fetch(resolvedUri);

    // If request to the current gateway fails, recursively try the next one we know about
    if (!res.ok) {
      console.warn(
        `Request to ${resolvedUri} failed with status ${res.status} - ${res.statusText}`,
      );
      return this.download(uri, gatewayUrls, attempts + 1);
    }

    return res;
  }
}
