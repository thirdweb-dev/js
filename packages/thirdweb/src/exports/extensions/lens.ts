/**
 * LensHub
 */
export {
  getProfile,
  type GetProfileParams,
} from "../../extensions/lens/__generated__/LensHub/read/getProfile.js";
export {
  exists,
  type ExistsParams,
} from "../../extensions/lens/__generated__/LensHub/read/exists.js";
export {
  getContentURI,
  type GetContentURIParams,
} from "../../extensions/lens/__generated__/LensHub/read/getContentURI.js";
export {
  getProfileIdByHandleHash,
  type GetProfileIdByHandleHashParams,
} from "../../extensions/lens/__generated__/LensHub/read/getProfileIdByHandleHash.js";
export {
  getPublication,
  type GetPublicationParams,
} from "../../extensions/lens/__generated__/LensHub/read/getPublication.js";
export {
  tokenDataOf,
  type TokenDataOfParams,
} from "../../extensions/lens/__generated__/LensHub/read/tokenDataOf.js";
export {
  mintTimestampOf,
  type MintTimestampOfParams,
} from "../../extensions/lens/__generated__/LensHub/read/mintTimestampOf.js";

/**
 * LensHandle
 */
export {
  getHandle,
  type GetHandleParams,
} from "../../extensions/lens/__generated__/LensHandle/read/getHandle.js";
export { getHandleTokenURIContract } from "../../extensions/lens/__generated__/LensHandle/read/getHandleTokenURIContract.js";
export {
  getLocalName,
  type GetLocalNameParams,
} from "../../extensions/lens/__generated__/LensHandle/read/getLocalName.js";
export {
  getTokenId,
  type GetTokenIdParams,
} from "../../extensions/lens/__generated__/LensHandle/read/getTokenId.js";

/**
 * FollowNFT
 */
export {
  getFollowData,
  type GetFollowDataParams,
} from "../../extensions/lens/__generated__/FollowNFT/read/getFollowData.js";
export { getFollowerCount } from "../../extensions/lens/__generated__/FollowNFT/read/getFollowerCount.js";
export {
  getFollowerProfileId,
  type GetFollowerProfileIdParams,
} from "../../extensions/lens/__generated__/FollowNFT/read/getFollowerProfileId.js";
export {
  getFollowTokenId,
  type GetFollowTokenIdParams,
} from "../../extensions/lens/__generated__/FollowNFT/read/getFollowTokenId.js";
export {
  getOriginalFollowTimestamp,
  type GetOriginalFollowTimestampParams,
} from "../../extensions/lens/__generated__/FollowNFT/read/getOriginalFollowTimestamp.js";
export {
  getProfileIdAllowedToRecover,
  type GetProfileIdAllowedToRecoverParams,
} from "../../extensions/lens/__generated__/FollowNFT/read/getProfileIdAllowedToRecover.js";
export {
  isFollowing,
  type IsFollowingParams,
} from "../../extensions/lens/__generated__/FollowNFT/read/isFollowing.js";
export {
  mintTimestampOf as mintTimestampOfFollowNFT,
  type MintTimestampOfParams as MintTimestampOfFollowNFTParams,
} from "../../extensions/lens/__generated__/FollowNFT/read/mintTimestampOf.js";

/**
 * TokenHandleRegistry
 */
export {
  getDefaultHandle,
  type GetDefaultHandleParams,
} from "../../extensions/lens/__generated__/TokenHandleRegistry/read/getDefaultHandle.js";
export {
  nonces,
  type NoncesParams,
} from "../../extensions/lens/__generated__/TokenHandleRegistry/read/nonces.js";
export {
  resolve,
  type ResolveParams,
} from "../../extensions/lens/__generated__/TokenHandleRegistry/read/resolve.js";

/**
 * ModuleRegistry
 */
export {
  getModuleTypes,
  type GetModuleTypesParams,
} from "../../extensions/lens/__generated__/ModuleRegistry/read/getModuleTypes.js";
export {
  isErc20CurrencyRegistered,
  type IsErc20CurrencyRegisteredParams,
} from "../../extensions/lens/__generated__/ModuleRegistry/read/isErc20CurrencyRegistered.js";
export {
  isModuleRegistered,
  type IsModuleRegisteredParams,
} from "../../extensions/lens/__generated__/ModuleRegistry/read/isModuleRegistered.js";
export {
  isModuleRegisteredAs,
  type IsModuleRegisteredAsParams,
} from "../../extensions/lens/__generated__/ModuleRegistry/read/isModuleRegisteredAs.js";

/**
 * Custom extension
 */

// Read
export {
  getHandleFromProfileId,
  type GetHandleFromProfileIdParams,
} from "../../extensions/lens/read/getHandleFromProfileId.js";
export {
  getProfileMetadata,
  type GetProfileMetadataParams,
} from "../../extensions/lens/read/getProfileMetadata.js";
export type { LensProfileSchema } from "../../extensions/lens/read/type.js";
export {
  getFullProfile,
  type GetFullProfileParams,
  type FullProfileResponse,
} from "../../extensions/lens/read/getFullProfile.js";
export {
  resolveAddress,
  type ResolveLensAddressParams,
} from "../../extensions/lens/read/resolveAddress.js";

/**
 * Contract addresses
 */
export {
  // Mainnet
  LENS_HUB_ADDRESS,
  LENS_HANDLE_ADDRESS,
  LENS_TOKEN_HANDLE_REGISTRY_ADDRESS,
  LENS_FOLLOW_NFT_ADDRESS,
  LENS_COLLECT_NFT_ADDRESS,
  LENS_MODULE_REGISTRY_ADDRESS,
  // Testnet
  LENS_HUB_ADDRESS_TESTNET,
  LENS_HANDLE_ADDRESS_TESTNET,
  LENS_TOKEN_HANDLE_REGISTRY_ADDRESS_TESTNET,
  LENS_FOLLOW_NFT_ADDRESS_TESTNET,
  LENS_COLLECT_NFT_ADDRESS_TESTNET,
  LENS_MODULE_REGISTRY_ADDRESS_TESTNET,
} from "../../extensions/lens/consts.js";
