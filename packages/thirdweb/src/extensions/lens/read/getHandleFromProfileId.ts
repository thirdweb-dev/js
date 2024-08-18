import { polygon } from "../../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getContract } from "../../../contract/contract.js";
import { getHandle } from "../__generated__/LensHandle/read/getHandle.js";
import { getDefaultHandle } from "../__generated__/TokenHandleRegistry/read/getDefaultHandle.js";
import {
  LENS_HANDLE_ADDRESS,
  LENS_TOKEN_HANDLE_REGISTRY_ADDRESS,
} from "../consts.js";

/**
 * @extension LENS
 */
export type GetHandleFromProfileIdParams = {
  profileId: bigint;
  client: ThirdwebClient;
  /**
   * Override variables for LensHandle contract and TokenHandleRegistry contract
   * Make sure both of them have to be on the same network
   */
  overrides?: {
    /**
     * Contract address for the LensHandle contract
     */
    lensHandleAddress?: string;
    /**
     * Contract address for the TokenHandleRegistry contract
     */
    tokenHandleRegistryAddress?: string;
    chain?: Chain;
  };
};

/**
 * Return the Lens handle of a profile in the format: lens/@<name-of-user>
 * @param options
 * @returns
 * @extension LENS
 *
 * @example
 * ```ts
 * import { getHandleFromProfileId } from "thirdweb/extensions/lens";
 *
 * const profileId = 461662n;
 * const handle = await getHandleFromProfileId({ profileId, client }); // "lens/@captain_jack"
 * ```
 */
export async function getHandleFromProfileId(
  options: GetHandleFromProfileIdParams,
) {
  const { profileId, overrides, client } = options;
  const lensHandleContract = getContract({
    address: overrides?.lensHandleAddress || LENS_HANDLE_ADDRESS,
    chain: overrides?.chain || polygon,
    client,
  });
  const tokenHandleRegistryContract = getContract({
    address:
      overrides?.tokenHandleRegistryAddress ||
      LENS_TOKEN_HANDLE_REGISTRY_ADDRESS,
    chain: overrides?.chain || polygon,
    client,
  });
  const handleTokenId = await getDefaultHandle({
    contract: tokenHandleRegistryContract,
    profileId,
  }).catch(() => null);
  if (handleTokenId === null) {
    return null;
  }
  // e.g: "lens/@JuanWick"
  const handle = await getHandle({
    contract: lensHandleContract,
    tokenId: handleTokenId,
  }).catch(() => null);

  return handle;
}
