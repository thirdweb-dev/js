import { BufferOrStringWithName, FileOrBuffer, GatewayUrls } from "../types";

/**
 * @internal
 */
export function isBrowser() {
  return typeof window !== "undefined";
}

export function isString(data: any): data is string {
  return typeof data === "string";
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
  return !!(
    data &&
    data.name &&
    data.data &&
    typeof data.name === "string" &&
    (typeof data.data === "string" || isBufferInstance(data.data))
  );
}

export function isFileOrBuffer(
  data: any,
): data is File | Buffer | BufferOrStringWithName {
  return (
    isFileInstance(data) ||
    isBufferInstance(data) ||
    isBufferOrStringWithName(data)
  );
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
  data: unknown,
  gatewayUrls: GatewayUrls,
): unknown {
  switch (typeof data) {
    case "string":
      return replaceGatewayUrlWithScheme(data, gatewayUrls);
    case "object":
      if (!data) {
        return data;
      }

      if (isFileOrBuffer(data)) {
        return data;
      }

      if (Array.isArray(data)) {
        return data.map((entry) =>
          replaceObjectGatewayUrlsWithSchemes(entry, gatewayUrls),
        );
      }

      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          replaceObjectGatewayUrlsWithSchemes(value, gatewayUrls),
        ]),
      );
  }

  return data;
}

/**
 * @internal
 */
export function replaceObjectSchemesWithGatewayUrls(
  data: unknown,
  gatewayUrls: GatewayUrls,
): unknown {
  if (isString(data)) {
    return replaceSchemeWithGatewayUrl(data, gatewayUrls);
  }

  switch (typeof data) {
    case "string":
      return replaceSchemeWithGatewayUrl(data, gatewayUrls);
    case "object":
      if (!data) {
        return data;
      }

      if (isFileOrBuffer(data)) {
        return data;
      }

      if (Array.isArray(data)) {
        return data.map((entry) =>
          replaceObjectSchemesWithGatewayUrls(entry, gatewayUrls),
        );
      }

      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          replaceObjectSchemesWithGatewayUrls(value, gatewayUrls),
        ]),
      );
  }

  return data;
}

/**
 * @internal
 */
export function extractObjectFiles(
  data: unknown,
  files: FileOrBuffer[] = [],
): FileOrBuffer[] {
  // If item is a FileOrBuffer add it to our list of files
  if (isFileOrBuffer(data)) {
    files.push(data);
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
        extractObjectFiles(data[key as keyof typeof data], files),
      );
    }
  }

  return files;
}

/**
 * @internal
 */
export function replaceObjectFilesWithUris(
  data: unknown,
  uris: string[],
): unknown {
  if (isFileOrBuffer(data)) {
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
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          replaceObjectFilesWithUris(value, uris),
        ]),
      );
    }
  }

  return data;
}
