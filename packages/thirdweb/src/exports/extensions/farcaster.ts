// Constants
export {
  ID_GATEWAY_ADDRESS,
  ID_REGISTRY_ADDRESS,
  KEY_GATEWAY_ADDRESS,
  STORAGE_REGISTRY_ADDRESS,
  SIGNED_KEY_REQUEST_VALIDATOR_ADDRESS,
} from "../../extensions/farcaster/constants.js";

// Contracts
export type { FarcasterContractOptions } from "../../extensions/farcaster/contracts/contractOptions.js";
export { getIdGateway } from "../../extensions/farcaster/contracts/getIdGateway.js";
export { getKeyGateway } from "../../extensions/farcaster/contracts/getKeyGateway.js";
export { getBundler } from "../../extensions/farcaster/contracts/getBundler.js";
export { getIdRegistry } from "../../extensions/farcaster/contracts/getIdRegistry.js";
export { getStorageRegistry } from "../../extensions/farcaster/contracts/getStorageRegistry.js";

// EIP712 Signatures
export {
  type RegisterMessage,
  signRegister,
  getRegisterData,
} from "../../extensions/farcaster/eip712Signatures/registerSignature.js";
export {
  type SignedKeyRequestMessage,
  signKeyRequest,
  getKeyRequestData,
  encodeSignedKeyRequestMetadata,
  getSignedKeyRequestMetadata,
} from "../../extensions/farcaster/eip712Signatures/keyRequestSignature.js";
export {
  type AddMessage,
  signAdd,
  getAddData,
} from "../../extensions/farcaster/eip712Signatures/addSignature.js";

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
  type GetUsdRegistrationPriceParams,
  getUsdRegistrationPrice,
} from "../../extensions/farcaster/read/getUsdRegistrationPrice.js";
export {
  type GetStoragePriceParams,
  getStoragePrice,
} from "../../extensions/farcaster/read/getStoragePrice.js";
export {
  type GetUsdStoragePriceParams,
  getUsdStoragePrice,
} from "../../extensions/farcaster/read/getUsdStoragePrice.js";
export {
  type RegisterFidParams,
  registerFid,
} from "../../extensions/farcaster/write/registerFid.js";
export {
  type RegisterFidAndSignerParams,
  registerFidAndSigner,
} from "../../extensions/farcaster/write/registerFidAndSigner.js";
export {
  type Ed25519Keypair,
  createEd25519Keypair,
} from "../../extensions/farcaster/ed25519.js";
export {
  type AddSignerParams,
  addSigner,
} from "../../extensions/farcaster/write/addSigner.js";
export {
  type AddSignerForParams,
  addSignerFor,
} from "../../extensions/farcaster/write/addSignerFor.js";
export {
  type RentStorageParams,
  rentStorage,
} from "../../extensions/farcaster/write/rentStorage.js";
