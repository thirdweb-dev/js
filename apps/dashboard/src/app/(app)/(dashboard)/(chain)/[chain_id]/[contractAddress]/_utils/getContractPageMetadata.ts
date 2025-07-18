import "server-only";
import type { ThirdwebContract } from "thirdweb";
import { getContractPageMetadataSetup } from "./getContractPageMetadataSetup";
import type { EmbedTypeToShow } from "./getEmbedTypeToShow";
import { isInsightSupportedForChain } from "./isAnalyticsSupportedForChain";

export type ContractPageMetadata = {
  supportedERCs: {
    isERC721: boolean;
    isERC1155: boolean;
    isERC20: boolean;
  };
  isDirectListingSupported: boolean;
  isEnglishAuctionSupported: boolean;
  isPermissionsSupported: boolean;
  isVoteContract: boolean;
  isPermissionsEnumerableSupported: boolean;
  isModularCore: boolean;
  embedType: EmbedTypeToShow;
  isInsightSupported: boolean;
  isSplitSupported: boolean;
  isERC721ClaimConditionsSupported: boolean;
  isERC20ClaimConditionsSupported: boolean;
  isAccountFactory: boolean;
  isAccount: boolean;
  isAccountPermissionsSupported: boolean;
  functionSelectors: string[];
  showClaimRewards: boolean;
};

export async function getContractPageMetadata(contract: ThirdwebContract) {
  return getContractPageMetadataSetup(contract, isInsightSupportedForChain);
}
