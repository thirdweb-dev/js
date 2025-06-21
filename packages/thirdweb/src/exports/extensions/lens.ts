/**
 * LensHub
 */

/**
 * FollowNFT
 */
export {
  type GetFollowDataParams,
  getFollowData,
} from "../../extensions/lens/__generated__/FollowNFT/read/getFollowData.js";
export { getFollowerCount } from "../../extensions/lens/__generated__/FollowNFT/read/getFollowerCount.js";
export {
  type GetFollowerProfileIdParams,
  getFollowerProfileId,
} from "../../extensions/lens/__generated__/FollowNFT/read/getFollowerProfileId.js";
export {
  type GetFollowTokenIdParams,
  getFollowTokenId,
} from "../../extensions/lens/__generated__/FollowNFT/read/getFollowTokenId.js";
export {
  type GetOriginalFollowTimestampParams,
  getOriginalFollowTimestamp,
} from "../../extensions/lens/__generated__/FollowNFT/read/getOriginalFollowTimestamp.js";
export {
  type GetProfileIdAllowedToRecoverParams,
  getProfileIdAllowedToRecover,
} from "../../extensions/lens/__generated__/FollowNFT/read/getProfileIdAllowedToRecover.js";
export {
  type IsFollowingParams,
  isFollowing,
} from "../../extensions/lens/__generated__/FollowNFT/read/isFollowing.js";
export {
  type MintTimestampOfParams as MintTimestampOfFollowNFTParams,
  mintTimestampOf as mintTimestampOfFollowNFT,
} from "../../extensions/lens/__generated__/FollowNFT/read/mintTimestampOf.js";
/**
 * LensHandle
 */
export {
  type GetHandleParams,
  getHandle,
} from "../../extensions/lens/__generated__/LensHandle/read/getHandle.js";
export { getHandleTokenURIContract } from "../../extensions/lens/__generated__/LensHandle/read/getHandleTokenURIContract.js";
export {
  type GetLocalNameParams,
  getLocalName,
} from "../../extensions/lens/__generated__/LensHandle/read/getLocalName.js";
export {
  type GetTokenIdParams,
  getTokenId,
} from "../../extensions/lens/__generated__/LensHandle/read/getTokenId.js";
export {
  type ExistsParams,
  exists,
} from "../../extensions/lens/__generated__/LensHub/read/exists.js";
export {
  type GetContentURIParams,
  getContentURI,
} from "../../extensions/lens/__generated__/LensHub/read/getContentURI.js";
export {
  type GetProfileParams,
  getProfile,
} from "../../extensions/lens/__generated__/LensHub/read/getProfile.js";
export {
  type GetProfileIdByHandleHashParams,
  getProfileIdByHandleHash,
} from "../../extensions/lens/__generated__/LensHub/read/getProfileIdByHandleHash.js";
export {
  type GetPublicationParams,
  getPublication,
} from "../../extensions/lens/__generated__/LensHub/read/getPublication.js";
export {
  type MintTimestampOfParams,
  mintTimestampOf,
} from "../../extensions/lens/__generated__/LensHub/read/mintTimestampOf.js";
export {
  type TokenDataOfParams,
  tokenDataOf,
} from "../../extensions/lens/__generated__/LensHub/read/tokenDataOf.js";
/**
 * ModuleRegistry
 */
export {
  type GetModuleTypesParams,
  getModuleTypes,
} from "../../extensions/lens/__generated__/ModuleRegistry/read/getModuleTypes.js";
export {
  type IsErc20CurrencyRegisteredParams,
  isErc20CurrencyRegistered,
} from "../../extensions/lens/__generated__/ModuleRegistry/read/isErc20CurrencyRegistered.js";
export {
  type IsModuleRegisteredParams,
  isModuleRegistered,
} from "../../extensions/lens/__generated__/ModuleRegistry/read/isModuleRegistered.js";
export {
  type IsModuleRegisteredAsParams,
  isModuleRegisteredAs,
} from "../../extensions/lens/__generated__/ModuleRegistry/read/isModuleRegisteredAs.js";
/**
 * TokenHandleRegistry
 */
export {
  type GetDefaultHandleParams,
  getDefaultHandle,
} from "../../extensions/lens/__generated__/TokenHandleRegistry/read/getDefaultHandle.js";
export {
  type NoncesParams,
  nonces,
} from "../../extensions/lens/__generated__/TokenHandleRegistry/read/nonces.js";
export {
  type ResolveParams,
  resolve,
} from "../../extensions/lens/__generated__/TokenHandleRegistry/read/resolve.js";

/**
 * Custom extension
 */

/**
 * Contract addresses
 */
export {
  LENS_COLLECT_NFT_ADDRESS,
  LENS_COLLECT_NFT_ADDRESS_TESTNET,
  LENS_FOLLOW_NFT_ADDRESS,
  LENS_FOLLOW_NFT_ADDRESS_TESTNET,
  LENS_HANDLE_ADDRESS,
  LENS_HANDLE_ADDRESS_TESTNET,
  // Mainnet
  LENS_HUB_ADDRESS,
  // Testnet
  LENS_HUB_ADDRESS_TESTNET,
  LENS_MODULE_REGISTRY_ADDRESS,
  LENS_MODULE_REGISTRY_ADDRESS_TESTNET,
  LENS_TOKEN_HANDLE_REGISTRY_ADDRESS,
  LENS_TOKEN_HANDLE_REGISTRY_ADDRESS_TESTNET,
} from "../../extensions/lens/consts.js";
export {
  type FullProfileResponse,
  type GetFullProfileParams,
  getFullProfile,
} from "../../extensions/lens/read/getFullProfile.js";
// Read
export {
  type GetHandleFromProfileIdParams,
  getHandleFromProfileId,
} from "../../extensions/lens/read/getHandleFromProfileId.js";
export {
  type GetProfileMetadataParams,
  getProfileMetadata,
} from "../../extensions/lens/read/getProfileMetadata.js";
export {
  type ResolveLensAddressParams,
  resolveAddress,
} from "../../extensions/lens/read/resolveAddress.js";
export type { LensProfileSchema } from "../../extensions/lens/read/type.js";
