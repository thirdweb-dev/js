import type { ThirdwebClient } from "../client/client.js";
import { getThirdwebDomains } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";

export type UnpinOptions = {
  client: ThirdwebClient;
  cid: string;
};

/**
 * Unpins a file from IPFS.
 *  For security purposes, this method requires a secret key to be set in the ThirdwebClient instance.
 * @param options - The options for unpinning the file.
 * @param options.client - The Thirdweb client instance.
 * @param options.cid - The content identifier (CID) of the file to unpin.
 * @throws Will throw an error if the client does not have a secret key or if the unpinning fails.
 * @example
 * ```ts
 * import { unpin } from "thirdweb";
 *
 * const result = await unpin({
 *   client: thirdwebClient,
 *   cid: "QmTzQ1N1z1Q1N1z1Q1N1z1Q1N1z1Q1N1z1Q1N1z1Q1N1z1",
 * });
 * ```
 * @storage
 */

export async function unpin(options: UnpinOptions) {
  if (!options.client.secretKey) {
    throw new Error(
      "Unauthorized - Your client must have a secret key to unpin files.",
    );
  }

  const res = await getClientFetch(options.client)(
    `https://${getThirdwebDomains().storage}/ipfs/pinned/${options.cid}`,
    {
      method: "DELETE",
    },
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(
        "Unauthorized - You don't have permission to use this service.",
      );
    }
    const error = await res.text();
    throw new Error(
      `Failed to unpin file - ${res.status} - ${res.statusText} ${error || ""}`,
    );
  }
}
