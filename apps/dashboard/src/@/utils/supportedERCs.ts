import { isERC20 as isERC20_ERC20 } from "thirdweb/extensions/erc20";
import { isGetNFTSupported as isGetNFTSupported_ERC721 } from "thirdweb/extensions/erc721";
import { isGetNFTSupported as isGetNFTSupported_ERC1155 } from "thirdweb/extensions/erc1155";

export function supportedERCs(functionSelectors: string[]) {
  const isERC721 = isGetNFTSupported_ERC721(functionSelectors);
  const isERC1155 = isGetNFTSupported_ERC1155(functionSelectors);
  const isERC20 = isERC20_ERC20(functionSelectors);
  return {
    isERC20,
    isERC721,
    isERC1155,
  };
}
