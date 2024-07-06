// READ
export { isERC1155 } from "../../extensions/erc1155/read/isERC1155.js";
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
} from "../../extensions/erc1155/__generated__/IERC1155/read/uri.js";
export {
  totalSupply,
  type TotalSupplyParams,
} from "../../extensions/erc1155/__generated__/IERC1155/read/totalSupply.js";
export {
  balanceOf,
  type BalanceOfParams,
} from "../../extensions/erc1155/__generated__/IERC1155/read/balanceOf.js";
export {
  isApprovedForAll,
  type IsApprovedForAllParams,
} from "../../extensions/erc1155/__generated__/IERC1155/read/isApprovedForAll.js";

//WRITE

export {
  burn,
  type BurnParams,
} from "../../extensions/erc1155/__generated__/IBurnableERC1155/write/burn.js";
export {
  burnBatch,
  type BurnBatchParams,
} from "../../extensions/erc1155/__generated__/IBurnableERC1155/write/burnBatch.js";
export {
  setApprovalForAll,
  type SetApprovalForAllParams,
} from "../../extensions/erc1155/__generated__/IERC1155/write/setApprovalForAll.js";
export {
  safeTransferFrom,
  type SafeTransferFromParams,
} from "../../extensions/erc1155/__generated__/IERC1155/write/safeTransferFrom.js";
export {
  safeBatchTransferFrom,
  type SafeBatchTransferFromParams,
} from "../../extensions/erc1155/__generated__/IERC1155/write/safeBatchTransferFrom.js";
export {
  mintTo,
  type MintToParams,
} from "../../extensions/erc1155/write/mintTo.js";
export {
  mintAdditionalSupplyTo,
  type MintAdditionalSupplyToParams,
} from "../../extensions/erc1155/write/mintAdditionalSupplyTo.js";
export {
  setTokenURI,
  type SetTokenURIParams,
} from "../../extensions/erc1155/__generated__/INFTMetadata/write/setTokenURI.js";
export { freezeMetadata } from "../../extensions/erc1155/__generated__/INFTMetadata/write/freezeMetadata.js";

/**
 * DROPS extension for ERC1155
 */
export { getActiveClaimCondition } from "../../extensions/erc1155/drops/read/getActiveClaimCondition.js";
export { claimCondition } from "../../extensions/erc1155/__generated__/DropSinglePhase1155/read/claimCondition.js";
export {
  claimTo,
  type ClaimToParams,
} from "../../extensions/erc1155/drops/write/claimTo.js";

export {
  lazyMint,
  type LazyMintParams,
} from "../../extensions/erc1155/write/lazyMint.js";

export {
  setClaimConditions,
  type SetClaimConditionsParams,
} from "../../extensions/erc1155/drops/write/setClaimConditions.js";

export {
  updateMetadata,
  type UpdateMetadataParams,
} from "../../extensions/erc1155/drops/write/updateMetadata.js";
export {
  getClaimConditionById,
  type GetClaimConditionByIdParams,
} from "../../extensions/erc1155/__generated__/IDrop1155/read/getClaimConditionById.js";

/**
 * SIGNATURE extension for ERC1155
 */
export {
  mintWithSignature,
  type GenerateMintSignatureOptions,
  generateMintSignature,
} from "../../extensions/erc1155/write/sigMint.js";

// EVENTS
export { tokensLazyMintedEvent } from "../../extensions/erc1155/__generated__/ILazyMint/events/TokensLazyMinted.js";
export { tokensClaimedEvent } from "../../extensions/erc1155/__generated__/IDrop1155/events/TokensClaimed.js";
export {
  transferSingleEvent,
  type TransferSingleEventFilters,
} from "../../extensions/erc1155/__generated__/IERC1155/events/TransferSingle.js";
export {
  transferBatchEvent,
  type TransferBatchEventFilters,
} from "../../extensions/erc1155/__generated__/IERC1155/events/TransferBatch.js";
export {
  approvalForAllEvent,
  type ApprovalForAllEventFilters,
} from "../../extensions/erc1155/__generated__/IERC1155/events/ApprovalForAll.js";
export { metadataUpdateEvent } from "../../extensions/erc1155/__generated__/INFTMetadata/events/MetadataUpdate.js";
export { metadataFrozenEvent } from "../../extensions/erc1155/__generated__/INFTMetadata/events/MetadataFrozen.js";
export { batchMetadataUpdateEvent } from "../../extensions/erc1155/__generated__/INFTMetadata/events/BatchMetadataUpdate.js";
export {
  tokensMintedWithSignatureEvent,
  type TokensMintedWithSignatureEventFilters,
} from "../../extensions/erc1155/__generated__/ISignatureMintERC1155/events/TokensMintedWithSignature.js";

// Packs
export {
  packCreatedEvent,
  type PackCreatedEventFilters,
} from "../../extensions/erc1155/__generated__/IPack/events/PackCreated.js";
export {
  packOpenedEvent,
  type PackOpenedEventFilters,
} from "../../extensions/erc1155/__generated__/IPack/events/PackOpened.js";
export {
  packUpdatedEvent,
  type PackUpdatedEventFilters,
} from "../../extensions/erc1155/__generated__/IPack/events/PackUpdated.js";
export {
  createPack,
  type CreatePackParams,
} from "../../extensions/erc1155/__generated__/IPack/write/createPack.js";
export {
  openPack,
  type OpenPackParams,
} from "../../extensions/erc1155/__generated__/IPack/write/openPack.js";
