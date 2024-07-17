import type { ThirdwebContract } from "../../../contract/contract.js";
import { getNFT } from "../../erc721/read/getNFT.js";
import { getHandle } from "../__generated__/LensHandle/read/getHandle.js";
import { getProfile } from "../__generated__/LensHub/read/getProfile.js";
import { mintTimestampOf } from "../__generated__/LensHub/read/mintTimestampOf.js";
import { getDefaultHandle } from "../__generated__/TokenHandleRegistry/read/getDefaultHandle.js";

/**
 * In Lens Protocol, which profile is associated with an ERC721 token,
 * thus, the tokenId represent profileId and the 2 can be used interchangeably
 *
 * There's no reliable way to query all Lens profiles in a wallet address,
 * you should use an indexing service for that information
 */

export type GetProfileFromTokenIdParams = {
  // this is the profileId
  tokenId: bigint;

  // Lens's smart contracts.
  // Go here for the latest data: https://www.lens.xyz/docs/resources/smart-contracts
  lensHubContract: ThirdwebContract;
  lensHandleContract: ThirdwebContract;
  tokenHandleRegistryContract: ThirdwebContract;

  includeJoinDate?: boolean;
};

export type LensProfileInfo = {
  // Lens profile handle | e.g "lens/@JuanWick"
  handle: string;
  // The image of the profile NFT
  image: string;
  profile: {
    pubCount: bigint;
    // Hex
    followModule: string;
    // Hex
    followNFT: string;
    __DEPRECATED__handle: string;
    __DEPRECATED__imageURI: string;
    __DEPRECATED__followNFTURI: string;
    metadataURI: string;
  };

  // timestamp of the moment the handle NFT was minted
  joinDate: bigint | null;
};

export async function getProfileFromTokenId(
  options: GetProfileFromTokenIdParams,
): Promise<LensProfileInfo> {
  const {
    lensHubContract,
    lensHandleContract,
    tokenHandleRegistryContract,
    tokenId,
    includeJoinDate,
  } = options;
  const profileId = tokenId;
  const [profile, handleTokenId, nft, joinDate] = await Promise.all([
    getProfile({ contract: lensHubContract, profileId }),
    getDefaultHandle({ contract: tokenHandleRegistryContract, profileId }),
    getNFT({ contract: lensHubContract, tokenId }),
    includeJoinDate
      ? mintTimestampOf({ contract: lensHubContract, tokenId })
      : null,
  ]);

  const handle = await getHandle({
    contract: lensHandleContract,
    tokenId: handleTokenId,
  });

  const profileInfo: LensProfileInfo = {
    handle,
    image: nft.metadata.image ?? "",
    profile,
    joinDate,
  };

  return profileInfo;
}
