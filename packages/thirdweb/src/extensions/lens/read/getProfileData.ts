import { download } from "../../../storage/download.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getProfile } from "../__generated__/LensHub/read/getProfile.js";
import type { LensProfileSchema } from "./type.js";

/**
 * In Lens Protocol, which profile is associated with an ERC721 token,
 * thus, the tokenId represent profileId and the 2 can be used interchangeably
 *
 * @important The contract here is the LensHub contract
 * @param options
 * @returns
 */
export async function getProfileData(
  options: BaseTransactionOptions<{
    profileId: bigint;
  }>,
): Promise<LensProfileSchema | null> {
  const profile = await getProfile(options);
  console.log(profile);
  if (!profile?.metadataURI) {
    return null;
  }
  const res = await download({
    uri: profile.metadataURI,
    client: options.contract.client,
  });
  const profileData = ((await res.json()) as LensProfileSchema) || null;
  return profileData;
}
