import { resolveFunctionSelectors } from "lib/selectors";
import type { ThirdwebContract } from "thirdweb";
import { contractType as getContractType } from "thirdweb/extensions/thirdweb";
import {
  isERC20ClaimConditionsSupported,
  isERC721ClaimConditionsSupported,
} from "./detectedFeatures/claimConditions";
import {
  isAccountContract,
  isAccountFactoryContract,
  isAccountPermissionsSupported,
} from "./detectedFeatures/erc4337";
import {
  isDirectListingSupported,
  isEnglishAuctionSupported,
} from "./detectedFeatures/marketplace";
import { isModularCoreContract } from "./detectedFeatures/modular";
import {
  isPermissionsEnumerableSupported,
  isPermissionsSupported,
} from "./detectedFeatures/permissions";
import { supportedERCs } from "./detectedFeatures/supportedERCs";
import { type EmbedTypeToShow, getEmbedTypeToShow } from "./getEmbedTypeToShow";
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
};

export async function getContractPageMetadata(contract: ThirdwebContract) {
  return getContractPageMetadataSetup(contract, isInsightSupportedForChain);
}

export async function getContractPageMetadataSetup(
  contract: ThirdwebContract,
  isAnalyticsSupportedFn: (chainId: number) => Promise<boolean>,
): Promise<ContractPageMetadata> {
  const [
    functionSelectorsResult,
    isInsightSupportedResult,
    contractTypeResult,
  ] = await Promise.allSettled([
    resolveFunctionSelectors(contract),
    isAnalyticsSupportedFn(contract.chain.id),
    getContractType({ contract }),
  ]);

  const functionSelectors =
    functionSelectorsResult.status === "fulfilled"
      ? functionSelectorsResult.value
      : [];

  const isInsightSupported =
    isInsightSupportedResult.status === "fulfilled"
      ? isInsightSupportedResult.value
      : true;

  const contractType =
    contractTypeResult.status === "fulfilled" ? contractTypeResult.value : null;

  return {
    supportedERCs: supportedERCs(functionSelectors),
    isDirectListingSupported: isDirectListingSupported(functionSelectors),
    isEnglishAuctionSupported: isEnglishAuctionSupported(functionSelectors),
    isPermissionsSupported: isPermissionsSupported(functionSelectors),
    isPermissionsEnumerableSupported:
      isPermissionsEnumerableSupported(functionSelectors),
    isModularCore: isModularCoreContract(functionSelectors),
    embedType: getEmbedTypeToShow(functionSelectors),
    isInsightSupported: isInsightSupported,
    isSplitSupported: contractType === "Split",
    isVoteContract: contractType === "VoteERC20",
    isERC721ClaimConditionsSupported:
      isERC721ClaimConditionsSupported(functionSelectors),
    isERC20ClaimConditionsSupported:
      isERC20ClaimConditionsSupported(functionSelectors),
    isAccountFactory: isAccountFactoryContract(functionSelectors),
    isAccount: isAccountContract(functionSelectors),
    isAccountPermissionsSupported:
      isAccountPermissionsSupported(functionSelectors),
    functionSelectors,
  };
}
