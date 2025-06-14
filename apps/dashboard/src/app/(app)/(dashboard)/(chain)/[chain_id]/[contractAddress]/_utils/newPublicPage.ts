import { resolveFunctionSelectors } from "lib/selectors";
import type { ThirdwebContract } from "thirdweb";
import { isGetNFTsSupported as ERC721_isGetNFTsSupported } from "thirdweb/extensions/erc721";
import { isGetNFTsSupported as ERC1155_isGetNFTsSupported } from "thirdweb/extensions/erc1155";
import { supportedERCs } from "./detectedFeatures/supportedERCs";

export type NewPublicPageType = "erc20" | "erc1155" | "erc721";

export async function shouldRenderNewPublicPage(
  contract: ThirdwebContract,
): Promise<false | { type: NewPublicPageType }> {
  try {
    const functionSelectors = await resolveFunctionSelectors(contract).catch(
      () => undefined,
    );

    if (!functionSelectors) {
      return false;
    }

    const _supportedERCs = supportedERCs(functionSelectors);

    // ERC1155
    if (
      _supportedERCs.isERC1155 &&
      ERC1155_isGetNFTsSupported(functionSelectors)
    ) {
      return {
        type: "erc1155",
      };
    }

    // ERC721
    if (
      _supportedERCs.isERC721 &&
      ERC721_isGetNFTsSupported(functionSelectors)
    ) {
      return {
        type: "erc721",
      };
    }

    if (_supportedERCs.isERC20) {
      return {
        type: "erc20",
      };
    }

    return false;
  } catch {
    return false;
  }
}
