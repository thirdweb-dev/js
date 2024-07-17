import type { ThirdwebClient } from "../../../client/client.js";
// import { getDefaultHandle } from "src/exports/extensions/lens.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { getProfile } from "../__generated__/LensHub/read/getProfile.js";
import { getDefaultHandle } from "../__generated__/TokenHandleRegistry/read/getDefaultHandle.js";
import type { LensProfileSchema } from "./type.js";

export type GetFullProfileParams = {
  profileId: bigint;
  client: ThirdwebClient;

  // Lens's smart contracts.
  // Go here for the latest data: https://www.lens.xyz/docs/resources/smart-contracts
  lensHubContract: ThirdwebContract;
  lensHandleContract: ThirdwebContract;
  tokenHandleRegistryContract: ThirdwebContract;

  includeJoinDate?: boolean;
  // includeFollowerCount?: boolean;
  // includeFollowingCount?: boolean;
};

export type FullProfileResponse =
  | (LensProfileSchema & {
      handle: string;
      // Timestamp of the join date
      joinDate: bigint | null;
    })
  | null;

/**
 * Return the profile data _with Lens handle_ and optional join date + follower/following count
 *
 * In Lens Protocol, which profile is associated with an ERC721 token,
 * thus, the tokenId represent profileId and the 2 can be used interchangeably
 * @extension LENS
 *
 * @example
 * ```ts
 * import { getFullProfile } from "thirdweb/extension/lens";
 *
 * const lensProfile = await getFullProfile({ ... });
 * ```
 */
export async function getFullProfile(
  options: GetFullProfileParams,
): Promise<FullProfileResponse> {
  const {
    profileId,
    lensHandleContract,
    lensHubContract,
    tokenHandleRegistryContract,
    includeJoinDate,
    client,
  } = options;

  const [profile, handleTokenId, { download }] = await Promise.all([
    getProfile({ contract: lensHubContract, profileId }),
    getDefaultHandle({ contract: tokenHandleRegistryContract, profileId }),
    import("../../../storage/download.js"),
  ]);

  // A profile data should always pair with a handle
  if (!profile || !handleTokenId) {
    return null;
  }

  const [{ getHandle }, { mintTimestampOf }, profileData] = await Promise.all([
    import("../__generated__/LensHandle/read/getHandle.js"),
    import("../__generated__/LensHub/read/mintTimestampOf.js"),
    profile?.metadataURI
      ? (await download({ uri: profile.metadataURI, client })).json()
      : null,
  ]);

  const [handle, joinDate] = await Promise.all([
    getHandle({ contract: lensHandleContract, tokenId: handleTokenId }),
    includeJoinDate
      ? mintTimestampOf({ contract: lensHubContract, tokenId: profileId })
      : null,
  ]);

  const result: FullProfileResponse = {
    ...profileData,
    handle,
    joinDate,
  };

  return result;
}
