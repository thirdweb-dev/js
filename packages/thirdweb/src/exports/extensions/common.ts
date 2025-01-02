// read
export { contractURI } from "../../extensions/common/__generated__/IContractMetadata/read/contractURI.js";
export {
  getContractMetadata,
  isGetContractMetadataSupported,
} from "../../extensions/common/read/getContractMetadata.js";
export {
  owner,
  isOwnerSupported,
} from "../../extensions/common/__generated__/IOwnable/read/owner.js";
export { name, isNameSupported } from "../../extensions/common/read/name.js";
export {
  symbol,
  isSymbolSupported,
} from "../../extensions/common/read/symbol.js";
export { parseNftUri } from "../../utils/nft/parseNft.js";

// write
export {
  setContractURI,
  type SetContractURIParams,
  isSetContractURISupported,
} from "../../extensions/common/__generated__/IContractMetadata/write/setContractURI.js";

export {
  setOwner,
  type SetOwnerParams,
} from "../../extensions/common/__generated__/IOwnable/write/setOwner.js";

export {
  setContractMetadata,
  type SetContractMetadataParams,
  isSetContractMetadataSupported,
} from "../../extensions/common/write/setContractMetadata.js";

export {
  multicall,
  type MulticallParams,
  isMulticallSupported,
} from "../../extensions/common/__generated__/IMulticall/write/multicall.js";

// events

export {
  ownerUpdatedEvent,
  type OwnerUpdatedEventFilters,
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
  getRoyaltyInfoForToken,
  type GetRoyaltyInfoForTokenParams,
  isGetRoyaltyInfoForTokenSupported,
} from "../../extensions/common/__generated__/IRoyalty/read/getRoyaltyInfoForToken.js";

// write
export {
  setDefaultRoyaltyInfo,
  type SetDefaultRoyaltyInfoParams,
  isSetDefaultRoyaltyInfoSupported,
} from "../../extensions/common/__generated__/IRoyalty/write/setDefaultRoyaltyInfo.js";
export {
  setRoyaltyInfoForToken,
  type SetRoyaltyInfoForTokenParams,
  isSetRoyaltyInfoForTokenSupported,
} from "../../extensions/common/__generated__/IRoyalty/write/setRoyaltyInfoForToken.js";

// --------------------------------------------------------
// Platform Fees
// --------------------------------------------------------

export {
  getPlatformFeeInfo,
  isGetPlatformFeeInfoSupported,
} from "../../extensions/common/__generated__/IPlatformFee/read/getPlatformFeeInfo.js";
export {
  setPlatformFeeInfo,
  isSetPlatformFeeInfoSupported,
  type SetPlatformFeeInfoParams,
} from "../../extensions/common/__generated__/IPlatformFee/write/setPlatformFeeInfo.js";

// --------------------------------------------------------
// Primary Sale
// --------------------------------------------------------
export {
  primarySaleRecipient,
  isPrimarySaleRecipientSupported,
} from "../../extensions/common/__generated__/IPrimarySale/read/primarySaleRecipient.js";
export {
  setPrimarySaleRecipient,
  type SetPrimarySaleRecipientParams,
  isSetPrimarySaleRecipientSupported,
} from "../../extensions/common/__generated__/IPrimarySale/write/setPrimarySaleRecipient.js";
