export { createAuth } from "../auth/auth.js";
export type { GenerateLoginPayloadParams } from "../auth/core/generate-login-payload.js";
// meant to be used on the "client" side to sign the login payload with a given account
export {
  type SignLoginPayloadParams,
  signLoginPayload,
} from "../auth/core/sign-login-payload.js";
export type { AuthOptions, LoginPayload } from "../auth/core/types.js";
export type {
  VerifyLoginPayloadParams,
  VerifyLoginPayloadResult,
} from "../auth/core/verify-login-payload.js";
export { isErc6492Signature } from "../auth/is-erc6492-signature.js";
export {
  type ParseErc6492SignatureReturnType,
  parseErc6492Signature,
} from "../auth/parse-erc6492-signature.js";
export { serializeErc6492Signature } from "../auth/serialize-erc6492-signature.js";
export type { Erc6492Signature } from "../auth/types.js";
export {
  type VerifyContractWalletSignatureParams,
  type VerifyEOASignatureParams,
  type VerifySignatureParams,
  verifyContractWalletSignature,
  verifyEOASignature,
  verifySignature,
} from "../auth/verify-signature.js";
