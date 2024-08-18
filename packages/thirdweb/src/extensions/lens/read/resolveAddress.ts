import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import { getAddress, isAddress } from "../../../utils/address.js";
import { withCache } from "../../../utils/promise/withCache.js";

/**
 * @extension LENS
 */
export type ResolveLensAddressParams = {
  /**
   * Either a full lens handle, or a lens localName
   * Examples:
   * 1. Full handle: "lens/vitalik"
   * 2. Just local name: "vitalik"
   */
  name: string;
  /**
   * a [`ThirdwebClient`](https://portal.thirdweb.com/references/typescript/v5/ThirdwebClient)
   */
  client: ThirdwebClient;
  /**
   * Override parameters for Lens contract, defaults to LensHandle contract on Polygon
   */
  overrides?: {
    /**
     * The contract address of the [`LensHandle contract`](https://www.lens.xyz/docs/resources/smart-contracts)
     */
    lensHandleContractAddress?: string;
    /**
     * The chain which `lensHandleContractAddress` is deployed on
     */
    chain?: Chain;
  };
};

/**
 * Take in a Lens handle or local-name and return the wallet address behind that handle/local-name.
 * For example, "lens/vitalik" is a handle, with "lens" being the namespace and "vitalik" being the local name
 * @extension LENS
 * @example
 * ```ts
 * import { resolveAddress } from "thirdweb/extensions/lens";
 *
 * const walletAddress = await resolveAddress({
 *   name: "vitalik",
 *   client,
 * });
 * ```
 */
export async function resolveAddress(
  options: ResolveLensAddressParams,
): Promise<string> {
  const { name, overrides, client } = options;
  if (isAddress(name)) {
    return getAddress(name);
  }
  return withCache(
    async (): Promise<string> => {
      const [
        { getContract },
        { getTokenId },
        { ownerOf },
        { polygon },
        { LENS_HANDLE_ADDRESS },
      ] = await Promise.all([
        import("../../../contract/contract.js"),
        import("../__generated__/LensHandle/read/getTokenId.js"),
        import("../../erc721/__generated__/IERC721A/read/ownerOf.js"),
        import("../../../chains/chain-definitions/polygon.js"),
        import("../consts.js"),
      ]);
      const contract = getContract({
        address: overrides?.lensHandleContractAddress || LENS_HANDLE_ADDRESS,
        chain: overrides?.chain || polygon,
        client,
      });
      /**
       * For better UX, we accept both handle and local name
       * The difference: handle = <namespace>/<local-name>
       * For example, "lens/vitalik" is a handle, with "lens" being the namespace and "vitalik" being the local name
       * Currently there's only 1 namespace called "lens" but we should make sure the code can scale when there are more
       *
       * Since lens does not allow "/" in the name,
       * if the string contains "/", it is either invalid, or it definitely contains the namespace
       * In that case we remove the possible namespace because the `getTokenId` method only accepts localName
       */
      const isPossibleHandle = name.includes("/");
      const localName = isPossibleHandle ? name.split("/")[1] : name;
      if (!localName) {
        throw new Error(`missing local name from ${name}`);
      }
      const tokenId = await getTokenId({ contract, localName });
      if (!tokenId) {
        throw new Error(
          `Could not retrieve tokenId from localName: ${localName}`,
        );
      }

      /**
       * Another thing to note is that even if you enter an invalid localName,
       * `getTokenId` still returns you a tokenId - so never rely on the result alone.
       * Check if the tokenId truly exists using `exists` or in this case, `ownerOf`
       */
      const address = await ownerOf({ contract, tokenId }).catch(
        () => ZERO_ADDRESS,
      );
      if (address === ZERO_ADDRESS) {
        throw new Error(
          `Could not fetch the wallet address for lens handle: ${name}`,
        );
      }
      return address;
    },
    {
      cacheKey: `lens:addr:${name}`,
      // 1min cache
      cacheTime: 60 * 1000,
    },
  );
}
