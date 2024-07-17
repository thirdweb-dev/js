import type { ThirdwebContract } from "../../../contract/contract.js";
import { getHandle } from "../__generated__/LensHandle/read/getHandle.js";
import { getDefaultHandle } from "../__generated__/TokenHandleRegistry/read/getDefaultHandle.js";

export type GetHandleFromProfileIdParams = {
  profileId: bigint;

  // Lens's smart contracts.
  // Go here for the latest data: https://www.lens.xyz/docs/resources/smart-contracts
  lensHandleContract: ThirdwebContract;
  tokenHandleRegistryContract: ThirdwebContract;
};

/**
 * Return the Lens handle of a profile in the format: lens/@<name-of-user>
 * @param options
 * @returns
 * @extension LENS
 */
export async function getHandleFromProfileId(
  options: GetHandleFromProfileIdParams,
) {
  const { profileId, lensHandleContract, tokenHandleRegistryContract } =
    options;
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
