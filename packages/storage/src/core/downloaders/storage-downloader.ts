import { isTwGatewayUrl } from "../../common/urls";
import { isBrowser, replaceSchemeWithGatewayUrl } from "../../common/utils";
import pkg from "../../../package.json";
import {
  GatewayUrls,
  IStorageDownloader,
  IpfsDownloaderOptions,
  SingleDownloadOptions,
} from "../../types/download";

/**
 * Default downloader used - handles downloading from all schemes specified in the gateway URLs configuration.
 *
 * @example
 * ```jsx
 * // Can instantiate the downloader with the default gateway URLs
 * const downloader = new StorageDownloader();
 *
 * // client id if used in client-side applications
 * const clientId = "your-client-id";
 * const storage = new ThirdwebStorage({ clientId, downloader });
 *
 * // secret key if used in server-side applications
 * const secretKey = "your-secret-key";
 * const storage = new ThirdwebStorage({ secretKey, downloader });
 * ```
 *
 * @public
 */
export class StorageDownloader implements IStorageDownloader {
  DEFAULT_TIMEOUT_IN_SECONDS = 60;
  DEFAULT_MAX_RETRIES = 3;

  private secretKey?: string;
  private clientId?: string;
  private defaultTimeout: number;

  constructor(options: IpfsDownloaderOptions) {
    this.secretKey = options.secretKey;
    this.clientId = options.clientId;
    this.defaultTimeout =
      options.timeoutInSeconds || this.DEFAULT_TIMEOUT_IN_SECONDS;
  }

  async download(
    uri: string,
    gatewayUrls: GatewayUrls,
    options?: SingleDownloadOptions,
    attempts = 0,
  ): Promise<Response> {
    const maxRetries = options?.maxRetries || this.DEFAULT_MAX_RETRIES;
    if (attempts > maxRetries) {
      console.error(
        "[FAILED_TO_DOWNLOAD_ERROR] Failed to download from URI - too many attempts failed.",
      );
      // return a 404 response to avoid retrying
      return new Response(
        JSON.stringify({
          error: "Not Found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Replace recognized scheme with the highest priority gateway URL that hasn't already been attempted
    let resolvedUri = replaceSchemeWithGatewayUrl(
      uri,
      gatewayUrls,
      attempts,
      this.clientId,
    );
    // If every gateway URL we know about for the designated scheme has been tried (via recursion) and failed, throw an error
    if (!resolvedUri) {
      console.error(
        "[FAILED_TO_DOWNLOAD_ERROR] Unable to download from URI - all gateway URLs failed to respond.",
      );
      return new Response(
        JSON.stringify({
          error: "Not Found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    } else if (attempts > 0) {
      console.warn(`Retrying download with backup gateway URL: ${resolvedUri}`);
    }

    let headers: HeadersInit = {};
    if (isTwGatewayUrl(resolvedUri)) {
      const bundleId =
        typeof globalThis !== "undefined" && "APP_BUNDLE_ID" in globalThis
          ? ((globalThis as any).APP_BUNDLE_ID as string)
          : undefined;
      if (this.secretKey) {
        headers = { "x-secret-key": this.secretKey };
      } else if (this.clientId) {
        if (!resolvedUri.includes("bundleId")) {
          resolvedUri = resolvedUri + (bundleId ? `?bundleId=${bundleId}` : "");
        }
        headers["x-client-Id"] = this.clientId;
      }
      // if we have a authorization token on global context then add that to the headers
      if (
        typeof globalThis !== "undefined" &&
        "TW_AUTH_TOKEN" in globalThis &&
        typeof (globalThis as any).TW_AUTH_TOKEN === "string"
      ) {
        headers = {
          ...headers,
          authorization: `Bearer ${
            (globalThis as any).TW_AUTH_TOKEN as string
          }`,
        };
      }

      if (
        typeof globalThis !== "undefined" &&
        "TW_CLI_AUTH_TOKEN" in globalThis &&
        typeof (globalThis as any).TW_CLI_AUTH_TOKEN === "string"
      ) {
        headers = {
          ...headers,
          authorization: `Bearer ${
            (globalThis as any).TW_CLI_AUTH_TOKEN as string
          }`,
        };
        headers["x-authorize-wallet"] = "true";
      }

      headers["x-sdk-version"] = pkg.version;
      headers["x-sdk-name"] = pkg.name;
      headers["x-sdk-platform"] = bundleId
        ? "react-native"
        : isBrowser()
        ? (window as any).bridge !== undefined
          ? "webGL"
          : "browser"
        : "node";
    }

    if (isTooManyRequests(resolvedUri)) {
      // skip the request if we're getting too many request error from the gateway
      return this.download(uri, gatewayUrls, options, attempts + 1);
    }

    const controller = new AbortController();
    const timeoutInSeconds = options?.timeoutInSeconds || this.defaultTimeout;
    const timeout = setTimeout(
      () => controller.abort(),
      timeoutInSeconds * 1000,
    );
    const resOrErr: Response | Error = await fetch(resolvedUri, {
      headers,
      signal: controller.signal,
    }).catch((err) => err);
    // if we get here clear the timeout
    if (timeout) {
      clearTimeout(timeout);
    }

    if (!("status" in resOrErr)) {
      // early exit if we don't have a status code
      throw new Error(
        `Request timed out after ${timeoutInSeconds} seconds. ${
          isTwGatewayUrl(resolvedUri)
            ? "You can update the timeoutInSeconds option to increase the timeout."
            : "You're using a public IPFS gateway, pass in a clientId or secretKey for a reliable IPFS gateway."
        }`,
      );
    }

    // if the request is good we can skip everything else
    if (resOrErr.ok) {
      return resOrErr;
    }

    if (resOrErr.status === 429) {
      // track that we got a too many requests error
      tooManyRequestsBackOff(resolvedUri, resOrErr);
      // Since the current gateway failed, recursively try the next one we know about
      return this.download(uri, gatewayUrls, options, attempts + 1);
    }

    if (resOrErr.status === 410) {
      // Don't retry if the content is blocklisted
      console.error(
        `Request to ${resolvedUri} failed because this content seems to be blocklisted. Search VirusTotal for this URL to confirm: ${resolvedUri} `,
      );
      return resOrErr;
    }

    console.warn(
      `Request to ${resolvedUri} failed with status ${resOrErr.status} - ${resOrErr.statusText}`,
    );

    // if the status is 404 and we're using a thirdweb gateway url, return the response as is
    if (resOrErr.status === 404 && isTwGatewayUrl(resolvedUri)) {
      return resOrErr;
    }

    // these are the only errors that we want to retry, everything else we should just return the error as is
    // 408 - Request Timeout
    // 429 - Too Many Requests
    // 5xx - Server Errors
    if (
      resOrErr.status !== 408 &&
      resOrErr.status !== 429 &&
      resOrErr.status < 500
    ) {
      return resOrErr;
    }

    // Since the current gateway failed, recursively try the next one we know about
    return this.download(uri, gatewayUrls, options, attempts + 1);
  }
}

const TOO_MANY_REQUESTS_TRACKER = new Map<string, true>();

function isTooManyRequests(gatewayUrl: string) {
  return TOO_MANY_REQUESTS_TRACKER.has(gatewayUrl);
}

const TIMEOUT_MAP = new Map<string, any>();

function tooManyRequestsBackOff(gatewayUrl: string, response: Response) {
  // if we already have a timeout for this gateway url, clear it
  if (TIMEOUT_MAP.has(gatewayUrl)) {
    clearTimeout(TIMEOUT_MAP.get(gatewayUrl));
  }
  const retryAfter = response.headers.get("Retry-After");
  let backOff = 5000;
  if (retryAfter) {
    const retryAfterSeconds = parseInt(retryAfter);
    if (!isNaN(retryAfterSeconds)) {
      backOff = retryAfterSeconds * 1000;
    }
  }

  // track that we got a too many requests error
  TOO_MANY_REQUESTS_TRACKER.set(gatewayUrl, true);
  TIMEOUT_MAP.set(
    gatewayUrl,
    setTimeout(() => TOO_MANY_REQUESTS_TRACKER.delete(gatewayUrl), backOff),
  );
}
