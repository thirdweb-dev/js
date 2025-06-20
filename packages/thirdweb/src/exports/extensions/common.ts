// read
export { contractURI } from "../../extensions/common/__generated__/IContractMetadata/read/contractURI.js";
// write
export {
  isSetContractURISupported,
  type SetContractURIParams,
  setContractURI,
} from "../../extensions/common/__generated__/IContractMetadata/write/setContractURI.js";
export {
  isMulticallSupported,
  type MulticallParams,
  multicall,
} from "../../extensions/common/__generated__/IMulticall/write/multicall.js";
export {
  isOwnerSupported,
  owner,
} from "../../extensions/common/__generated__/IOwnable/read/owner.js";
export {
  type SetOwnerParams,
  setOwner,
} from "../../extensions/common/__generated__/IOwnable/write/setOwner.js";
export {
  getContractMetadata,
  isGetContractMetadataSupported,
} from "../../extensions/common/read/getContractMetadata.js";
export { isNameSupported, name } from "../../extensions/common/read/name.js";
export {
  isSymbolSupported,
  symbol,
} from "../../extensions/common/read/symbol.js";

export {
  isSetContractMetadataSupported,
  type SetContractMetadataParams,
  setContractMetadata,
} from "../../extensions/common/write/setContractMetadata.js";
export { parseNftUri } from "../../utils/nft/parseNft.js";

// events

export {
  type OwnerUpdatedEventFilters,
  ownerUpdatedEvent,
} from "../../extensions/common/__generated__/IOwnable/events/OwnerUpdated.js";

// --------------------------------------------------------
// Royalty
// --------------------------------------------------------
// read
export {
  getDefaultRoyaltyInfo,
  isGetDefaultRoyaltyInfoSupported,
} from "../../extensions/common/__generated__/IRoyalty/read/getDefaultRoyaltyInfo.js";
export {
  type GetRoyaltyInfoForTokenParams,
  getRoyaltyInfoForToken,
  isGetRoyaltyInfoForTokenSupported,
} from "../../extensions/common/__generated__/IRoyalty/read/getRoyaltyInfoForToken.js";

// write
export {
  isSetDefaultRoyaltyInfoSupported,
  type SetDefaultRoyaltyInfoParams,
  setDefaultRoyaltyInfo,
} from "../../extensions/common/__generated__/IRoyalty/write/setDefaultRoyaltyInfo.js";
export {
  isSetRoyaltyInfoForTokenSupported,
  type SetRoyaltyInfoForTokenParams,
  setRoyaltyInfoForToken,
} from "../../extensions/common/__generated__/IRoyalty/write/setRoyaltyInfoForToken.js";

// --------------------------------------------------------
// Platform Fees
// --------------------------------------------------------

export {
  getPlatformFeeInfo,
  isGetPlatformFeeInfoSupported,
} from "../../extensions/common/__generated__/IPlatformFee/read/getPlatformFeeInfo.js";
export {
  isSetPlatformFeeInfoSupported,
  type SetPlatformFeeInfoParams,
  setPlatformFeeInfo,
} from "../../extensions/common/__generated__/IPlatformFee/write/setPlatformFeeInfo.js";

// --------------------------------------------------------
// Primary Sale
// --------------------------------------------------------
export {
  isPrimarySaleRecipientSupported,
  primarySaleRecipient,
} from "../../extensions/common/__generated__/IPrimarySale/read/primarySaleRecipient.js";
export {
  isSetPrimarySaleRecipientSupported,
  type SetPrimarySaleRecipientParams,
  setPrimarySaleRecipient,
} from "../../extensions/common/__generated__/IPrimarySale/write/setPrimarySaleRecipient.js";
