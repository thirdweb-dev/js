import {
  FileOrBuffer,
  GatewayUrls,
  IStorageUploader,
  Json,
  JsonObject,
} from "../types";

export function isBrowser() {
  return typeof window !== "undefined";
}

function isFileInstance(data: any): data is File {
  return global.File && data instanceof File;
}

function isBufferInstance(data: any): data is Buffer {
  return global.Buffer && data instanceof Buffer;
}

export function replaceSchemeWithGatewayUrl(
  uri: string,
  gatewayUrls: GatewayUrls,
  index = 0,
): string {
  const scheme = Object.keys(gatewayUrls).find((s) => uri.startsWith(s));
  const schemeGatewayUrls = scheme ? gatewayUrls[scheme] : [];

  if (!scheme) {
    return uri;
  }

  if (index > schemeGatewayUrls.length) {
    throw new Error(
      "[GATEWAY_URL_ERROR] Failed to resolve gateway URL - ran out of gateway URLs to try.",
    );
  }

  return uri.replace(scheme, schemeGatewayUrls[index]);
}

export function replaceObjectSchemesWithGatewayUrls(
  data: Exclude<Json, FileOrBuffer>,
  gatewayUrls: GatewayUrls,
): Json {
  switch (typeof data) {
    case "string":
      return replaceSchemeWithGatewayUrl(data, gatewayUrls);
    case "object":
      if (!data) {
        return data;
      }

      if (Array.isArray(data)) {
        return data.map((entry) =>
          replaceObjectSchemesWithGatewayUrls(
            entry as Exclude<Json, FileOrBuffer>,
            gatewayUrls,
          ),
        );
      }

      return Object.keys(data).map((key) =>
        replaceObjectSchemesWithGatewayUrls(
          data[key] as Exclude<Json, FileOrBuffer>,
          gatewayUrls,
        ),
      );
  }

  return data;
}

export function replaceGatewayUrlWithScheme(
  uri: string,
  gatewayUrls: GatewayUrls,
): JsonObject[] {
  return [];
}

function extractFilesFromObjects(data: JsonObject[]): FileOrBuffer[] {
  return [];
}

function replaceFilesWithHashes(
  data: JsonObject[],
  uris: string[],
): JsonObject[] {
  return [];
}

export async function uploadAndReplaceFilesWithHashes(
  data: JsonObject[],
): Promise<JsonObject[]> {
  // Replace any gateway URLs with their hashes
  // Recurse through data and extract files to upload
  // Recurse through data and replace files with hashes

  return [];
}
