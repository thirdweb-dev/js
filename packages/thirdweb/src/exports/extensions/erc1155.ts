// READ
export {
  balanceOfBatch,
  type BalanceOfBatchParams,
} from "../../extensions/erc1155/__generated__/IERC1155/read/balanceOfBatch.js";
export {
  getNFT,
  type GetNFTParams,
} from "../../extensions/erc1155/read/getNFT.js";
export {
  getNFTs,
  type GetNFTsParams,
} from "../../extensions/erc1155/read/getNFTs.js";
export {
  getOwnedNFTs,
  type GetOwnedNFTsParams,
} from "../../extensions/erc1155/read/getOwnedNFTs.js";
export { nextTokenIdToMint } from "../../extensions/erc1155/__generated__/IERC1155Enumerable/read/nextTokenIdToMint.js";
export {
  uri,
  /**
   * @alias for `uri`
   */
  uri as tokenUri,
  type UriParams,
} from "../../extensions/erc1155/__generated__/IERC1155Metadata/read/uri.js";
export {
  totalSupply,
  type TotalSupplyParams,
} from "../../extensions/erc1155/__generated__/IERC1155Supply/read/totalSupply.js";
export {
  balanceOf,
  type BalanceOfParams,
} from "../../extensions/erc1155/__generated__/IERC1155/read/balanceOf.js";

/**
 * DROPS extension for ERC1155
 */
export { getActiveClaimCondition } from "../../extensions/erc1155/drops/read/getActiveClaimCondition.js";
export {
  claimTo,
  type ClaimToParams,
} from "../../extensions/erc1155/drops/write/claimTo.js";
