// read
export { contractURI } from "../../extensions/common/__generated__/IContractMetadata/read/contractURI.js";
export { getContractMetadata } from "../../extensions/common/read/getContractMetadata.js";
export { owner } from "../../extensions/common/__generated__/IOwnable/read/owner.js";
export { name } from "../../extensions/common/read/name.js";
export { symbol } from "../../extensions/common/read/symbol.js";

// write
export {
  setContractURI,
  type SetContractURIParams,
} from "../../extensions/common/__generated__/IContractMetadata/write/setContractURI.js";

export {
  setOwner,
  type SetOwnerParams,
} from "../../extensions/common/__generated__/IOwnable/write/setOwner.js";

export {
  setContractMetadata,
  type SetContractMetadataParams,
} from "../../extensions/common/write/setContractMetadata.js";

// events

export {
  ownerUpdatedEvent,
  type OwnerUpdatedEventFilters,
} from "../../extensions/common/__generated__/IOwnable/events/OwnerUpdated.js";

// --------------------------------------------------------
// Royalty
// --------------------------------------------------------
// read
export { getDefaultRoyaltyInfo } from "../../extensions/common/__generated__/IRoyalty/read/getDefaultRoyaltyInfo.js";
export {
  getRoyaltyInfoForToken,
  type GetRoyaltyInfoForTokenParams,
} from "../../extensions/common/__generated__/IRoyalty/read/getRoyaltyInfoForToken.js";

// write
export {
  setDefaultRoyaltyInfo,
  type SetDefaultRoyaltyInfoParams,
} from "../../extensions/common/__generated__/IRoyalty/write/setDefaultRoyaltyInfo.js";
export {
  setRoyaltyInfoForToken,
  type SetRoyaltyInfoForTokenParams,
} from "../../extensions/common/__generated__/IRoyalty/write/setRoyaltyInfoForToken.js";

// --------------------------------------------------------
// Platform Fees
// --------------------------------------------------------

export { getPlatformFeeInfo } from "../../extensions/common/__generated__/IPlatformFee/read/getPlatformFeeInfo.js";
export {
  setPlatformFeeInfo,
  type SetPlatformFeeInfoParams,
} from "../../extensions/common/__generated__/IPlatformFee/write/setPlatformFeeInfo.js";

// --------------------------------------------------------
// Primary Sale
// --------------------------------------------------------
export { primarySaleRecipient } from "../../extensions/common/__generated__/IPrimarySale/read/primarySaleRecipient.js";
export {
  setPrimarySaleRecipient,
  type SetPrimarySaleRecipientParams,
} from "../../extensions/common/__generated__/IPrimarySale/write/setPrimarySaleRecipient.js";
