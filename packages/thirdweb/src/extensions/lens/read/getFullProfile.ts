import { polygon } from "../../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getContract } from "../../../contract/contract.js";
import { getProfile } from "../__generated__/LensHub/read/getProfile.js";
import { getDefaultHandle } from "../__generated__/TokenHandleRegistry/read/getDefaultHandle.js";
import {
  LENS_HANDLE_ADDRESS,
  LENS_HUB_ADDRESS,
  LENS_TOKEN_HANDLE_REGISTRY_ADDRESS,
} from "../consts.js";
import type { LensProfileSchema } from "./type.js";

/**
 * @extension LENS
 */
export type GetFullProfileParams = {
  profileId: bigint;
  client: ThirdwebClient;
  includeJoinDate?: boolean;
  /**
   * Override variables for Lens smart contracts
   * Make sure all of them have to be on the same network
   */
  overrides?: {
    /**
     * Contract address for the LensHub contract
     */
    lensHubAddress?: string;
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
 * @extension LENS
 */
export type FullProfileResponse = {
  handle: string;
  // Timestamp of the join date
  joinDate: bigint | null;
  profileData: LensProfileSchema | null;
} | null;

/**
 * Return the profile data _with Lens handle_ and optional join date
 *
 * In Lens Protocol, each profile is associated with an ERC721 token,
 * thus, the tokenId represent profileId and the 2 terms can be used interchangeably
 * @extension LENS
 *
 * @example
 * ```ts
 * import { getFullProfile } from "thirdweb/extension/lens";
 *
 * const profileId = 10000n; // profileId is the tokenId of the NFT
 * const lensProfile = await getFullProfile({ profileId, client });
 * ```
 */
export async function getFullProfile(
  options: GetFullProfileParams,
): Promise<FullProfileResponse> {
  const { profileId, overrides, includeJoinDate, client } = options;
  const lensHubContract = getContract({
    address: overrides?.lensHubAddress || LENS_HUB_ADDRESS,
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
  const [profile, handleTokenId, { download }] = await Promise.all([
    getProfile({ contract: lensHubContract, profileId }),
    getDefaultHandle({
      contract: tokenHandleRegistryContract,
      profileId,
    }).catch(() => null),
    import("../../../storage/download.js"),
  ]);

  // A profile data should always pair with a handle, so we exit if either is missing
  if (!profile || !handleTokenId) {
    return null;
  }

  const [{ getHandle }, { mintTimestampOf }, profileData] = await Promise.all([
    import("../__generated__/LensHandle/read/getHandle.js"),
    import("../__generated__/LensHub/read/mintTimestampOf.js"),
    profile?.metadataURI
      ? (await download({ client, uri: profile.metadataURI })).json()
      : null,
  ]);

  const lensHandleContract = getContract({
    address: overrides?.lensHandleAddress || LENS_HANDLE_ADDRESS,
    chain: overrides?.chain || polygon,
    client,
  });
  const [handle, joinDate] = await Promise.all([
    getHandle({ contract: lensHandleContract, tokenId: handleTokenId }),
    includeJoinDate
      ? mintTimestampOf({ contract: lensHubContract, tokenId: profileId })
      : null,
  ]);

  const result: FullProfileResponse = {
    handle,
    joinDate,
    profileData,
  };

  return result;
}
