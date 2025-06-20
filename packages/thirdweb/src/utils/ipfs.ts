import type { ThirdwebClient } from "../client/client.js";
import type { FileOrBufferOrString } from "../storage/upload/types.js";

export type ResolveSchemeOptions = {
  client: ThirdwebClient;
  uri: string;
};

const DEFAULT_GATEWAY = "https://{clientId}.ipfscdn.io/ipfs/{cid}";

/**
 * Resolves the scheme of a given URI and returns the corresponding URL.
 * If the URI starts with "ipfs://", it constructs a URL using the IPFS client ID and the IPFS gateway.
 * If the URI starts with "http", it returns the URI as is.
 * Otherwise, it throws an error indicating an invalid URI scheme.
 * @param options - The options object containing the URI and the IPFS client.
 * @returns The resolved URL.
 * @throws Error if the URI scheme is invalid.
 * @example
 * ```ts
 * import { resolveScheme } from "thirdweb/storage";
 * const url = resolveScheme({
 *  client,
 *  uri: "ipfs://Qm...",
 * });
 * ```
 * @storage
 */
export function resolveScheme(options: ResolveSchemeOptions) {
  if (options.uri.startsWith("ipfs://")) {
    const gateway =
      options.client.config?.storage?.gatewayUrl ?? DEFAULT_GATEWAY;
    const clientId = options.client.clientId;
    const cid = findIPFSCidFromUri(options.uri);

    let bundleId: string | undefined;
    if (typeof globalThis !== "undefined" && "Application" in globalThis) {
      // shims use wallet connect RN module which injects Application info in globalThis
      // biome-ignore lint/suspicious/noExplicitAny: get around globalThis typing
      bundleId = (globalThis as any).Application.applicationId;
    }

    // purposefully using SPLIT here and not replace for CID to avoid cases where users don't know the schema
    // also only splitting on `/ipfs` to avoid cases where people pass non `/` terminated gateway urls
    return `${
      gateway.replace("{clientId}", clientId).split("/ipfs")[0]
    }/ipfs/${cid}${bundleId ? `?bundleId=${bundleId}` : ""}`;
  }
  if (options.uri.startsWith("http")) {
    return options.uri;
  }
  throw new Error(`Invalid URI scheme, expected "ipfs://" or "http(s)://"`);
}

/**
 * @internal
 */
export function findIPFSCidFromUri(uri: string) {
  if (!uri.startsWith("ipfs://")) {
    // do not touch URIs that are not ipfs URIs
    return uri;
  }

  // first index of `/Qm` or `/bafy` in the uri (case insensitive)
  const firstIndex = uri.search(/\/(Qm|baf)/i);
  // we start one character after the first `/` to avoid including it in the CID
  return uri.slice(firstIndex + 1);
}
/**
 * Uploads or extracts URIs from the given files.
 * @template T - The type of the files (File, Buffer, String).
 * @param files - The files to upload or extract URIs from.
 * @param client - The Thirdweb client.
 * @param [startNumber] - The starting number for rewriting file names.
 * @returns - A promise that resolves to an array of URIs.
 * @throws {Error} - If the files are not all of the same type (all URI or all FileOrBufferOrString).
 * @internal
 *
 */
export async function uploadOrExtractURIs<
  T extends FileOrBufferOrString | Record<string, unknown>,
>(files: T[], client: ThirdwebClient, startNumber?: number): Promise<string[]> {
  if (isUriList(files)) {
    return files;
  }
  if (isMetadataList(files)) {
    const { upload } = await import("../storage/upload.js");
    const uris = await upload({
      client,
      files,
      rewriteFileNames: {
        fileStartNumber: startNumber || 0,
      },
    });
    return Array.isArray(uris) ? uris : [uris];
  }
  throw new Error(
    "Files must all be of the same type (all URI or all FileOrBufferOrString)",
  );
}

/**
 * Retrieves the base URI from a batch of URIs.
 *
 * @param uris - An array of URIs.
 * @returns The base URI shared by all URIs in the batch.
 * @throws If the batch contains URIs with different base URIs or if no base URI is found.
 * @internal
 */
export function getBaseUriFromBatch(uris: string | string[]): string {
  uris = Array.isArray(uris) ? uris : [uris];
  const [base, ...rest] = uris.map((uri) => {
    // remove query parameters
    [uri] = uri.split("?") as [string];
    // remove fragments
    [uri] = uri.split("#") as [string];

    // if the URI ends with a `/`, remove it
    if (uri.endsWith("/")) {
      uri = uri.slice(0, -1);
    }

    // remove the last part of the URI & add the trailing `/`
    return `${uri.split("/").slice(0, -1).join("/")}/`;
  });

  if (!base) {
    throw new Error("Batch of URIs is empty");
  }

  if (rest.some((uri) => uri !== base)) {
    throw new Error("All URIs in the batch must have the same base URI");
  }
  return base;
}

function isUriList<T extends FileOrBufferOrString | Record<string, unknown>>(
  metadatas: (string | T)[],
): metadatas is string[] {
  return metadatas.every((m) => typeof m === "string");
}

function isMetadataList<
  T extends FileOrBufferOrString | Record<string, unknown>,
>(metadatas: (string | T)[]): metadatas is T[] {
  return metadatas.every((m) => typeof m !== "string");
}
