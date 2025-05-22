import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../fetch.js";
import { resolveScheme } from "../ipfs.js";
import { parseNftUri } from "../nft/parseNft.js";

export type ParseAvatarOptions = {
  client: ThirdwebClient;
  uri: string;
};

/**
 * Parses an ENS or similar avatar record. Supports NFT URIs, IPFS scheme, and HTTPS URIs.
 * @param options - The options for parsing an ENS avatar record.
 * @param options.client - The Thirdweb client.
 * @param options.uri - The URI to parse.
 * @returns A promise that resolves to the avatar URL, or null if the URI could not be parsed.
 * @example
 * ```ts
 * import { parseAvatarRecord } from "thirdweb/utils/ens";
 * const avatarUrl = await parseAvatarRecord({
 *    client,
 *    uri: "ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/",
 * });
 *
 * console.log(avatarUrl); // "https://ipfs.io/ipfs/bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/"
 *
 * const avatarUrl2 = await parseAvatarRecord({
 *    client,
 *    uri: "eip155:1/erc1155:0xb32979486938aa9694bfc898f35dbed459f44424/10063",
 * });
 *
 * console.log(avatarUrl2); // "https://opensea.io/assets/0xb32979486938aa9694bfc898f35dbed459f44424/10063"
 * ```
 * @extension ENS
 */
export async function parseAvatarRecord(
  options: ParseAvatarOptions,
): Promise<string | null> {
  let uri: string | null = options.uri;
  if (/eip155:/i.test(options.uri)) {
    // do nft uri parsing
    uri = await parseNftUri(options);
  }
  if (!uri) {
    return null;
  }
  const resolvedScheme = resolveScheme({
    client: options.client,
    uri,
  });

  // check if it's an image
  if (await isImageUri({ client: options.client, uri: resolvedScheme })) {
    return resolvedScheme;
  }
  return null;
}

async function isImageUri(options: ParseAvatarOptions): Promise<boolean> {
  try {
    const res = await getClientFetch(options.client)(options.uri, {
      method: "HEAD",
    });
    // retrieve content type header to check if content is image
    if (res.status === 200) {
      const contentType = res.headers.get("content-type");
      return !!contentType?.startsWith("image/");
    }
    return false;
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
  } catch (error: any) {
    // if error is not cors related then fail
    if (typeof error === "object" && typeof error.response !== "undefined") {
      return false;
    }
    // fail in NodeJS, since the error is not cors but any other network issue
    if (!Object.hasOwn(globalThis, "Image")) {
      return false;
    }
    // in case of cors, use image api to validate if given url is an actual image
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(true);
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = options.uri;
    });
  }
}
