import { isClaimConditionsSupported } from "./detectedFeatures/claimConditions";
import {
  isDirectListingSupported,
  isEnglishAuctionSupported,
} from "./detectedFeatures/marketplace";
import { supportedERCs } from "./detectedFeatures/supportedERCs";

export type EmbedTypeToShow =
  | "marketplace-v3"
  | "erc20"
  | "erc1155"
  | "erc721"
  | null;

export function getEmbedTypeToShow(
  functionSelectors: string[],
): EmbedTypeToShow {
  const { isERC1155, isERC20, isERC721 } = supportedERCs(functionSelectors);

  if (
    isEnglishAuctionSupported(functionSelectors) &&
    isDirectListingSupported(functionSelectors)
  ) {
    return "marketplace-v3";
  }

  if (isClaimConditionsSupported(functionSelectors)) {
    if (isERC721) {
      return "erc721";
    }
    if (isERC1155) {
      return "erc1155";
    }
    if (isERC20) {
      return "erc20";
    }
  }

  return null;
}
