// Constants
export {
  ID_GATEWAY_ADDRESS,
  ID_REGISTRY_ADDRESS,
  KEY_GATEWAY_ADDRESS,
  SIGNED_KEY_REQUEST_VALIDATOR_ADDRESS,
  STORAGE_REGISTRY_ADDRESS,
} from "../../extensions/farcaster/constants.js";

// Contracts
export type { FarcasterContractOptions } from "../../extensions/farcaster/contracts/contractOptions.js";
export { getBundler } from "../../extensions/farcaster/contracts/getBundler.js";
export { getIdGateway } from "../../extensions/farcaster/contracts/getIdGateway.js";
export { getIdRegistry } from "../../extensions/farcaster/contracts/getIdRegistry.js";
export { getKeyGateway } from "../../extensions/farcaster/contracts/getKeyGateway.js";
export { getStorageRegistry } from "../../extensions/farcaster/contracts/getStorageRegistry.js";
export {
  createEd25519Keypair,
  type Ed25519Keypair,
} from "../../extensions/farcaster/ed25519.js";
export {
  type AddMessage,
  getAddData,
  type SignAddOptions,
  signAdd,
} from "../../extensions/farcaster/eip712Signatures/addSignature.js";
export {
  encodeSignedKeyRequestMetadata,
  getKeyRequestData,
  getSignedKeyRequestMetadata,
  type SignedKeyRequestMessage,
  type SignedKeyRequestMetadataOptions,
  type SignKeyRequestOptions,
  signKeyRequest,
} from "../../extensions/farcaster/eip712Signatures/keyRequestSignature.js";
// EIP712 Signatures
export {
  getRegisterData,
  type RegisterMessage,
  type SignRegisterOptions,
  signRegister,
} from "../../extensions/farcaster/eip712Signatures/registerSignature.js";
// Helper Functions
export {
  type GetFidParams,
  getFid,
} from "../../extensions/farcaster/read/getFid.js";
export {
  type GetNonceParams,
  getNonce,
} from "../../extensions/farcaster/read/getNonce.js";
export {
  type GetRegistrationPriceParams,
  getRegistrationPrice,
} from "../../extensions/farcaster/read/getRegistrationPrice.js";
export {
  type GetStoragePriceParams,
  getStoragePrice,
} from "../../extensions/farcaster/read/getStoragePrice.js";
export {
  type GetUsdRegistrationPriceParams,
  getUsdRegistrationPrice,
} from "../../extensions/farcaster/read/getUsdRegistrationPrice.js";
export {
  type GetUsdStoragePriceParams,
  getUsdStoragePrice,
} from "../../extensions/farcaster/read/getUsdStoragePrice.js";
export {
  type AddSignerParams,
  addSigner,
} from "../../extensions/farcaster/write/addSigner.js";
export {
  type AddSignerForParams,
  addSignerFor,
} from "../../extensions/farcaster/write/addSignerFor.js";
export {
  type RegisterFidParams,
  registerFid,
} from "../../extensions/farcaster/write/registerFid.js";
export {
  type RegisterFidAndSignerParams,
  registerFidAndSigner,
} from "../../extensions/farcaster/write/registerFidAndSigner.js";
export {
  type RentStorageParams,
  rentStorage,
} from "../../extensions/farcaster/write/rentStorage.js";
