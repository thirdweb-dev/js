// Constants
export {
  ID_GATEWAY_ADDRESS,
  ID_REGISTRY_ADDRESS,
  KEY_GATEWAY_ADDRESS,
  STORAGE_REGISTRY_ADDRESS,
  SIGNED_KEY_REQUEST_VALIDATOR_ADDRESS,
} from "../../extensions/farcaster/constants.js";

// Contracts
export {
  type FarcasterContractOptions,
  getIdGateway,
} from "../../extensions/farcaster/contracts.js";

// EIP712 Signatures
export {
  // register
  type RegisterMessage,
  signRegister,
  getRegisterData,
  // key request
  type SignedKeyRequestMessage,
  signKeyRequest,
  getKeyRequestData,
  encodeSignedKeyRequestMetadata,
  getSignedKeyRequestMetadata,
  // add
  type AddMessage,
  signAdd,
  getAddData,
} from "../../extensions/farcaster/eip712signatures.js";

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
  type RegisterFidParams,
  registerFid,
} from "../../extensions/farcaster/write/registerFid.js";
export {
  type RegisterFidAndSignerParams,
  registerFidAndSigner,
} from "../../extensions/farcaster/write/registerFidAndSigner.js";
export {
  type Ed25519Keypair as Signer,
  createEd25519Keypair as createSigner,
} from "../../extensions/farcaster/signers.js";
export {
  type AddSignerParams,
  addSigner,
} from "../../extensions/farcaster/write/addSigner.js";
export {
  type AddSignerForParams,
  addSignerFor,
} from "../../extensions/farcaster/write/addSignerFor.js";
