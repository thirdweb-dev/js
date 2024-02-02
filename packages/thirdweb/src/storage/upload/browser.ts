/* eslint-disable jsdoc/require-jsdoc */
import { getPlatformHeaders } from "~thirdweb/utils/fetch.js";
import type { ThirdwebClient } from "~thirdweb/client/client.js";
import { UPLOAD_SERVER_URL } from "./constants.js";
import type { UploadOptions } from "./types.js";

export async function uploadBatchBrowser(
  client: ThirdwebClient,
  form: FormData,
  fileNames: string[],
  options?: UploadOptions,
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    let timer = setTimeout(() => {
      xhr.abort();
      reject(
        new Error(
          "Request to upload timed out! No upload progress received in 30s",
        ),
      );
    }, 30000);

    xhr.upload.addEventListener("loadstart", () => {
      console.log(`[${Date.now()}] [IPFS] Started`);
    });

    xhr.upload.addEventListener("progress", (event) => {
      console.log(`[IPFS] Progress Event ${event.loaded}/${event.total}`);

      clearTimeout(timer);

      if (event.loaded < event.total) {
        timer = setTimeout(() => {
          xhr.abort();
          reject(
            new Error(
              "Request to upload timed out! No upload progress received in 30s",
            ),
          );
        }, 30000);
      } else {
        console.log(
          `[${Date.now()}] [IPFS] Uploaded files. Waiting for response.`,
        );
      }

      // if (event.lengthComputable && options?.onProgress) {
      //   options?.onProgress({
      //     progress: event.loaded,
      //     total: event.total,
      //   });
      // }
    });

    xhr.addEventListener("load", () => {
      console.log(`[${Date.now()}] [IPFS] Load`);
      clearTimeout(timer);

      if (xhr.status >= 200 && xhr.status < 300) {
        let body;
        try {
          body = JSON.parse(xhr.responseText);
        } catch (err) {
          return reject(new Error("Failed to parse JSON from upload response"));
        }

        const cid = body.IpfsHash;
        if (!cid) {
          throw new Error("Failed to get IPFS hash from upload response");
        }

        if (options?.uploadWithoutDirectory) {
          return resolve([`ipfs://${cid}`]);
        } else {
          return resolve(fileNames.map((n) => `ipfs://${cid}/${n}`));
        }
      }

      return reject(
        new Error(
          `Upload failed with status ${xhr.status} - ${xhr.responseText}`,
        ),
      );
    });

    xhr.addEventListener("error", () => {
      console.log("[IPFS] Load");
      clearTimeout(timer);

      if ((xhr.readyState !== 0 && xhr.readyState !== 4) || xhr.status === 0) {
        return reject(new Error("Upload failed due to a network error."));
      }

      return reject(new Error("Unknown upload error occured"));
    });

    xhr.open("POST", `${UPLOAD_SERVER_URL}/ipfs/upload`);

    if (client.secretKey) {
      xhr.setRequestHeader("x-secret-key", client.secretKey);
    } else if (client.clientId) {
      xhr.setRequestHeader("x-client-id", client.clientId);
    }
    getPlatformHeaders().forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    const bundleId =
      typeof globalThis !== "undefined" && "APP_BUNDLE_ID" in globalThis
        ? ((globalThis as any).APP_BUNDLE_ID as string)
        : undefined;
    if (bundleId) {
      xhr.setRequestHeader("x-bundle-id", bundleId);
    }

    // TODO bring back tracking
    // xhr.setRequestHeader("x-sdk-version", pkg.version);
    // xhr.setRequestHeader("x-sdk-name", pkg.name);
    // xhr.setRequestHeader(
    //   "x-sdk-platform",
    //   bundleId
    //     ? "react-native"
    //     : isBrowser()
    //       ? (window as any).bridge !== undefined
    //         ? "webGL"
    //         : "browser"
    //       : "node",
    // );

    // if we have a authorization token on global context then add that to the headers, this is for the dashboard.
    if (
      typeof globalThis !== "undefined" &&
      "TW_AUTH_TOKEN" in globalThis &&
      typeof (globalThis as any).TW_AUTH_TOKEN === "string"
    ) {
      xhr.setRequestHeader(
        "authorization",
        `Bearer ${(globalThis as any).TW_AUTH_TOKEN as string}`,
      );
    }

    // CLI auth token
    if (
      typeof globalThis !== "undefined" &&
      "TW_CLI_AUTH_TOKEN" in globalThis &&
      typeof (globalThis as any).TW_CLI_AUTH_TOKEN === "string"
    ) {
      xhr.setRequestHeader(
        "authorization",
        `Bearer ${(globalThis as any).TW_CLI_AUTH_TOKEN as string}`,
      );
      xhr.setRequestHeader("x-authorize-wallet", `true`);
    }

    xhr.send(form as any);
  });
}
