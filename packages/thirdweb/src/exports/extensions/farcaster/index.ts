// Constants
export {
  ID_GATEWAY_ADDRESS,
  KEY_GATEWAY_ADDRESS,
  STORAGE_REGISTRY_ADDRESS,
  SIGNED_KEY_REQUEST_VALIDATOR_ADDRESS,
} from "../../../extensions/farcaster/constants.js";

// Contracts
export {
  type FarcasterContractOptions,
  getIdGateway,
} from "../../../extensions/farcaster/contracts.js";

export {
  type GetRegistrationPriceOptions,
  getRegistrationPrice,
} from "../../../extensions/farcaster/read/getRegistrationPrice.js";
export {
  type GetUsdRegistrationPriceOptions,
  getUsdRegistrationPrice,
} from "../../../extensions/farcaster/read/getUsdRegistrationPrice.js";
export {
  type RegisterAccountParams,
  registerAccount,
} from "../../../extensions/farcaster/write/registerAccount.js";
export {
  type RegisterAppAccountParams,
  registerAppAccount,
} from "../../../extensions/farcaster/write/registerAppAccount.js";
export {
  type Ed25519Keypair as Signer,
  createEd25519Keypair as createSigner,
} from "../../../extensions/farcaster/signers.js";
