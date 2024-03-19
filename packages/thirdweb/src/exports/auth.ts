export {
  verifySignature,
  type VerifySignatureParams,
  verifyEOASignature,
  type VerifyEOASignatureParams,
  verifyContractWalletSignature,
  type VerifyContractWalletSignatureParams,
} from "../auth/verifySignature.js";

export { createAuth } from "../auth/auth.js";
export type {
  VerifyLoginPayloadParams,
  VerifyLoginPayloadResult,
} from "../auth/core/verify-login-payload.js";
export type { GenerateLoginPayloadParams } from "../auth/core/generate-login-payload.js";
export type { AuthOptions, LoginPayload } from "../auth/core/types.js";

// meant to be used on the "client" side to sign the login payload with a given account
export {
  signLoginPayload,
  type SignLoginPayloadParams,
} from "../auth/core/sign-login-payload.js";
