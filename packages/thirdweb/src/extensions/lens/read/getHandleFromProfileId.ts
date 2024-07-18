import { getHandle } from "../__generated__/LensHandle/read/getHandle.js";
import { getDefaultHandle } from "../__generated__/TokenHandleRegistry/read/getDefaultHandle.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { Chain } from "../../../chains/types.js";
import { getContract } from "../../../contract/contract.js";
import type { ThirdwebClient } from "../../../client/client.js";
import {
  LENS_HANDLE_ADDRESS,
  LENS_TOKEN_HANDLE_REGISTRY_ADDRESS,
} from "../consts.js";
import { polygon } from "../../../chains/chain-definitions/polygon.js";

export type GetHandleFromProfileIdParams = {
  profileId: bigint;
  client: ThirdwebClient;
  overrides?: {
    lensHandleAddress?: Hex;
    tokenHandleRegistryAddress?: Hex;
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
 * const handle = await getHandleFromProfileId({ profileId }); // "lens/@captain_jack"
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
  });
  // e.g: "lens/@JuanWick"
  const handle = await getHandle({
    contract: lensHandleContract,
    tokenId: handleTokenId,
  });

  return handle;
}
