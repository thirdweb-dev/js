import {
  BufferOrStringWithName,
  FileOrBuffer,
  FileOrBufferSchema,
  GatewayUrls,
  Json,
  JsonObject,
} from "../types";

/**
 * @internal
 */
export function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * @internal
 */
export function isFileInstance(data: any): data is File {
  return global.File && data instanceof File;
}

/**
 * @internal
 */
export function isBufferInstance(data: any): data is Buffer {
  return global.Buffer && data instanceof Buffer;
}

/**
 * @internal
 */
export function isBufferOrStringWithName(
  data: any,
): data is BufferOrStringWithName {
  return !!(data && data.name && data.data);
}

/**
 * @internal
 */
export function replaceGatewayUrlWithScheme(
  uri: string,
  gatewayUrls: GatewayUrls,
): string {
  for (const scheme of Object.keys(gatewayUrls)) {
    for (const url of gatewayUrls[scheme]) {
      if (uri.startsWith(url)) {
        return uri.replace(url, scheme);
      }
    }
  }

  return uri;
}

/**
 * @internal
 */
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

/**
 * @internal
 */
export function replaceObjectGatewayUrlsWithSchemes(
  data: Exclude<Json, FileOrBuffer>,
  gatewayUrls: GatewayUrls,
): Json {
  switch (typeof data) {
    case "string":
      return replaceGatewayUrlWithScheme(data, gatewayUrls);
    case "object":
      if (!data) {
        return data;
      }

      const { success } = FileOrBufferSchema.safeParse(data);
      if (success) {
        return data;
      }

      if (Array.isArray(data)) {
        return data.map((entry) =>
          replaceObjectGatewayUrlsWithSchemes(
            entry as Exclude<Json, FileOrBuffer>,
            gatewayUrls,
          ),
        );
      }

      const json: Json = {};
      Object.keys(data).forEach(
        (key) =>
          (json[key] = replaceObjectGatewayUrlsWithSchemes(
            data[key] as Exclude<Json, FileOrBuffer>,
            gatewayUrls,
          )),
      );
      return json;
  }

  return data;
}

/**
 * @internal
 */
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

      const { success } = FileOrBufferSchema.safeParse(data);
      if (success) {
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

      const json: Json = {};
      Object.keys(data).forEach((key) => {
        json[key] = replaceObjectSchemesWithGatewayUrls(
          data[key] as Exclude<Json, FileOrBuffer>,
          gatewayUrls,
        );
      });
      return json;
  }

  return data;
}

/**
 * @internal
 */
export function extractObjectFiles(
  data: Json,
  files: FileOrBuffer[] = [],
): FileOrBuffer[] {
  // If item is a FileOrBuffer add it to our list of files
  const { success } = FileOrBufferSchema.safeParse(data);
  if (success) {
    files.push(data as FileOrBuffer);
    return files;
  }

  if (typeof data === "object") {
    if (!data) {
      return files;
    }

    if (Array.isArray(data)) {
      data.forEach((entry) => extractObjectFiles(entry, files));
    } else {
      Object.keys(data).map((key) =>
        extractObjectFiles((data as JsonObject)[key], files),
      );
    }
  }

  return files;
}

/**
 * @internal
 */
export function replaceObjectFilesWithUris(data: Json, uris: string[]): Json {
  const { success: isFileOrBuffer } = FileOrBufferSchema.safeParse(data);
  if (isFileOrBuffer) {
    if (uris.length) {
      data = uris.shift() as string;
      return data;
    } else {
      console.warn("Not enough URIs to replace all files in object.");
    }
  }

  if (typeof data === "object") {
    if (!data) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((entry) => replaceObjectFilesWithUris(entry, uris));
    } else {
      const json: Json = {};
      Object.keys(data).map(
        (key) =>
          (json[key] = replaceObjectFilesWithUris(
            (data as JsonObject)[key],
            uris,
          )),
      );
      return json;
    }
  }

  return data;
}
