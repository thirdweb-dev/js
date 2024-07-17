import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getProfile } from "../__generated__/LensHub/read/getProfile.js";
import type { LensProfileSchema } from "./type.js";

/**
 * Download user lens profile from Arweave
 * This method does NOT give you the user handle - consider using `getFullProfileData`
 *
 * @important The contract here is the LensHub contract
 * @param options
 * @returns LensProfileSchema | null
 * @extension LENS
 *
 * @example
 * ```ts
 * import { getProfileData } from "thirdweb/extensions/lens";
 *
 * const profileData = await getProfileData({ contract, profileId });
 *
 * if (profileData) {
 *   console.log("Display name: ", profileData.lens.name);
 * }
 * ```
 */
export async function getProfileData(
  options: BaseTransactionOptions<{
    profileId: bigint;
  }>,
): Promise<LensProfileSchema | null> {
  const profile = await getProfile(options);
  if (!profile?.metadataURI) {
    return null;
  }
  const { download } = await import("../../../storage/download.js");
  const res = await download({
    uri: profile.metadataURI,
    client: options.contract.client,
  });
  const profileData = ((await res.json()) as LensProfileSchema) || null;
  return profileData;
}
