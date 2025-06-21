import { polygon } from "../../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getContract } from "../../../contract/contract.js";
import { getProfile } from "../__generated__/LensHub/read/getProfile.js";
import { LENS_HUB_ADDRESS } from "../consts.js";
import type { LensProfileSchema } from "./type.js";

/**
 * @extension LENS
 */
export type GetProfileMetadataParams = {
  profileId: bigint;
  client: ThirdwebClient;
  overrides?: {
    /**
     * Contract address for the LensHub contract
     */
    lensHubAddress?: string;
    chain?: Chain;
  };
};

/**
 * Download user lens profile from Arweave
 * This method does NOT give you the user handle & join-time - consider using `getFullProfileData` instead
 * It is useful & cost efficient if you only want to get user's name, bio, picture, coverPicture etc.
 *
 * @important The contract here is the LensHub contract
 * @param options
 * @returns LensProfileSchema | null
 * @extension LENS
 *
 * @example
 * ```ts
 * import { getProfileMetadata } from "thirdweb/extensions/lens";
 *
 * const profileData = await getProfileMetadata({ profileId, client });
 *
 * if (profileData) {
 *   console.log("Display name: ", profileData.lens.name);
 *   console.log("Bio: ", profileData.lens.bio);
 * }
 * ```
 */
export async function getProfileMetadata(
  options: GetProfileMetadataParams,
): Promise<LensProfileSchema | null> {
  const { client, profileId, overrides } = options;
  const lensHubContract = getContract({
    address: overrides?.lensHubAddress || LENS_HUB_ADDRESS,
    chain: overrides?.chain || polygon,
    client,
  });
  const profile = await getProfile({
    contract: lensHubContract,
    profileId,
  }).catch(() => null);
  if (profile === null) {
    return profile;
  }
  if (!profile?.metadataURI) {
    return null;
  }
  const { download } = await import("../../../storage/download.js");
  const res = await download({
    client,
    uri: profile.metadataURI,
  });
  const profileData = ((await res.json()) as LensProfileSchema) || null;
  return profileData;
}
