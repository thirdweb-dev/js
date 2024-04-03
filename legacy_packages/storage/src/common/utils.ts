import { BufferOrStringWithName, FileOrBuffer, GatewayUrls } from "../types";
import { getGatewayUrlForCid } from "./urls";

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
export function isFileBufferOrStringEqual(input1: any, input2: any): boolean {
  if (isFileInstance(input1) && isFileInstance(input2)) {
    // if both are File types, compare the name, size, and last modified date (best guess that these are the same files)
    if (
      input1.name === input2.name &&
      input1.lastModified === input2.lastModified &&
      input1.size === input2.size
    ) {
      return true;
    }
  } else if (isBufferInstance(input1) && isBufferInstance(input2)) {
    // buffer gives us an easy way to compare the contents!

    return input1.equals(input2);
  } else if (
    isBufferOrStringWithName(input1) &&
    isBufferOrStringWithName(input2)
  ) {
    // first check the names
    if (input1.name === input2.name) {
      // if the data for both is a string, compare the strings
      if (typeof input1.data === "string" && typeof input2.data === "string") {
        return input1.data === input2.data;
      } else if (
        isBufferInstance(input1.data) &&
        isBufferInstance(input2.data)
      ) {
        // otherwise we know it's buffers, so compare the buffers
        return input1.data.equals(input2.data);
      }
    }
  }
  // otherwise if we have not found a match, return false
  return false;
}

/**
 * @internal
 */
function parseCidAndPath(
  gatewayUrl: string,
  uri: string,
): { hash?: string; path?: string; query?: string } | undefined {
  const regexString = gatewayUrl
    .replace("{cid}", "(?<hash>[^/]+)")
    .replace("{path}", "(?<path>[^?#]+)");

  const regex = new RegExp(regexString);
  const match = uri.match(regex);

  if (match) {
    const hash = match.groups?.hash;
    const path = match.groups?.path;
    const queryString = uri.includes("?")
      ? uri.substring(uri.indexOf("?") + 1)
      : "";

    return { hash, path, query: queryString };
  }
}

/**
 * @internal
 */
export function replaceGatewayUrlWithScheme(
  uri: string,
  gatewayUrls: GatewayUrls,
): string {
  for (const scheme of Object.keys(gatewayUrls)) {
    for (const gatewayUrl of gatewayUrls[scheme]) {
      // If the url is a tokenized url, we need to convert it to a canonical url
      // Otherwise, we just need to check if the url is a prefix of the uri
      if (gatewayUrl.includes("{cid}")) {
        // Given the url is a tokenized url, we need to lift the cid and the path from the uri
        const parsed = parseCidAndPath(gatewayUrl, uri);
        if (parsed?.hash && parsed?.path) {
          const queryString = parsed?.query ? `?${parsed?.query}` : "";
          return `${scheme}${parsed?.hash}/${parsed?.path}${queryString}`;
        } else {
          // If we can't lift the cid and path from the uri, we can't replace the gateway url, return the orig string
          return uri;
        }
      } else if (uri.startsWith(gatewayUrl)) {
        return uri.replace(gatewayUrl, scheme);
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
  clientId?: string,
): string | undefined {
  const scheme = Object.keys(gatewayUrls).find((s) => uri.startsWith(s));
  const schemeGatewayUrls = scheme ? gatewayUrls[scheme] : [];

  if ((!scheme && index > 0) || (scheme && index >= schemeGatewayUrls.length)) {
    return undefined;
  }

  if (!scheme) {
    return uri;
  }

  const path = uri.replace(scheme, "");
  try {
    const gatewayUrl = getGatewayUrlForCid(
      schemeGatewayUrls[index],
      path,
      clientId,
    );
    return gatewayUrl;
  } catch (err) {
    console.warn(`The IPFS uri: ${path} is not valid.`);
    return undefined;
  }
}

/**
 * @internal
 */
export function replaceObjectGatewayUrlsWithSchemes<TData = unknown>(
  data: TData,
  gatewayUrls: GatewayUrls,
): TData {
  if (typeof data === "string") {
    return replaceGatewayUrlWithScheme(data, gatewayUrls) as any as TData;
  }
  if (typeof data === "object") {
    if (!data) {
      return data;
    }

    if (isFileOrBuffer(data)) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((entry) =>
        replaceObjectGatewayUrlsWithSchemes(entry, gatewayUrls),
      ) as any as TData;
    }

    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        replaceObjectGatewayUrlsWithSchemes(value, gatewayUrls),
      ]),
    ) as any as TData;
  }

  return data;
}

/**
 * @internal
 */
export function replaceObjectSchemesWithGatewayUrls<TData = unknown>(
  data: TData,
  gatewayUrls: GatewayUrls,
  clientId?: string,
): TData {
  if (typeof data === "string") {
    return replaceSchemeWithGatewayUrl(
      data,
      gatewayUrls,
      0,
      clientId,
    ) as any as TData;
  }
  if (typeof data === "object") {
    if (!data) {
      return data;
    }
    if (isFileOrBuffer(data)) {
      return data;
    }
    if (Array.isArray(data)) {
      return data.map((entry) =>
        replaceObjectSchemesWithGatewayUrls(entry, gatewayUrls, clientId),
      ) as any as TData;
    }
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        replaceObjectSchemesWithGatewayUrls(value, gatewayUrls, clientId),
      ]),
    ) as any as TData;
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
