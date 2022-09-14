import { DEFAULT_GATEWAY_URLS } from "../../common/urls";
import {
  replaceObjectSchemesWithGatewayUrls,
  replaceSchemeWithGatewayUrl,
} from "../../common/utils";
import { GatewayUrls, IStorageDownloader, Json } from "../../types";

export class StorageDownloader implements IStorageDownloader {
  public gatewayUrls: GatewayUrls;

  constructor(gatewayUrls?: GatewayUrls) {
    this.gatewayUrls = this.prepareGatewayUrls(gatewayUrls);
  }

  async download(uri: string, attempts = 0): Promise<Json> {
    // Replace recognized scheme with the highest priority gateway URL that hasn't already been attempted
    let resolvedUri;
    try {
      resolvedUri = replaceSchemeWithGatewayUrl(
        uri,
        this.gatewayUrls,
        attempts,
      );
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
      return this.download(uri, attempts + 1);
    }

    const text = await res.text();

    // Handle both JSON and standard text data types
    try {
      // If we get a JSON object, recursively replace any schemes with gatewayUrls
      const json = JSON.parse(text);
      return replaceObjectSchemesWithGatewayUrls(json, this.gatewayUrls);
    } catch {
      return text;
    }
  }

  private prepareGatewayUrls(gatewayUrls?: GatewayUrls): GatewayUrls {
    const allGatewayUrls = {
      ...gatewayUrls,
      ...DEFAULT_GATEWAY_URLS,
    };

    for (const key of Object.keys(DEFAULT_GATEWAY_URLS)) {
      if (gatewayUrls && gatewayUrls[key]) {
        allGatewayUrls[key] = [
          ...gatewayUrls[key],
          ...DEFAULT_GATEWAY_URLS[key],
        ];
      }
    }

    return allGatewayUrls;
  }
}
