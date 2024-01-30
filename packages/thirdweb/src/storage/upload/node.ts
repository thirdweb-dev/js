/* eslint-disable jsdoc/require-jsdoc */
import type { ThirdwebClient } from "../../client/client.js";
import type { UploadOptions } from "./types.js";
import { UPLOAD_SERVER_URL } from "./constants.js";

export async function uploadBatchNode(
  client: ThirdwebClient,
  form: FormData,
  fileNames: string[],
  options?: UploadOptions,
) {
  // if (options?.onProgress) {
  //   console.warn("The onProgress option is only supported in the browser");
  // }

  const headers: HeadersInit = {};

  if (client.secretKey) {
    headers["x-secret-key"] = client.secretKey;
  } else if (client.clientId) {
    headers["x-client-id"] = client.clientId;
  }

  // if we have a bundle id on global context then add that to the headers
  if (typeof globalThis !== "undefined" && "APP_BUNDLE_ID" in globalThis) {
    headers["x-bundle-id"] = (globalThis as any).APP_BUNDLE_ID as string;
  }

  // if we have a authorization token on global context then add that to the headers, this is for the dashboard.
  if (
    typeof globalThis !== "undefined" &&
    "TW_AUTH_TOKEN" in globalThis &&
    typeof (globalThis as any).TW_AUTH_TOKEN === "string"
  ) {
    headers["authorization"] = `Bearer ${
      (globalThis as any).TW_AUTH_TOKEN as string
    }`;
  }

  // CLI auth token
  if (
    typeof globalThis !== "undefined" &&
    "TW_CLI_AUTH_TOKEN" in globalThis &&
    typeof (globalThis as any).TW_CLI_AUTH_TOKEN === "string"
  ) {
    headers["authorization"] = `Bearer ${
      (globalThis as any).TW_CLI_AUTH_TOKEN as string
    }`;
    headers["x-authorize-wallet"] = "true";
  }

  const res = await fetch(`${UPLOAD_SERVER_URL}/ipfs/upload`, {
    method: "POST",
    headers: {
      ...headers,
      // ...form.getHeaders(),
    },
    body: form,
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(
        "Unauthorized - You don't have permission to use this service.",
      );
    }
    throw new Error(
      `Failed to upload files to IPFS - ${res.status} - ${
        res.statusText
      } - ${await res.text()}`,
    );
  }

  const body = await res.json();

  const cid = body.IpfsHash;
  if (!cid) {
    throw new Error("Failed to upload files to IPFS - Bad CID");
  }

  if (options?.uploadWithoutDirectory) {
    return [`ipfs://${cid}`];
  } else {
    return fileNames.map((name) => `ipfs://${cid}/${name}`);
  }
}
