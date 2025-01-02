export {
  verifySignature,
  type VerifySignatureParams,
  verifyEOASignature,
  type VerifyEOASignatureParams,
  verifyContractWalletSignature,
  type VerifyContractWalletSignatureParams,
} from "../auth/verify-signature.js";

export { isErc6492Signature } from "../auth/is-erc6492-signature.js";
export { serializeErc6492Signature } from "../auth/serialize-erc6492-signature.js";
export {
  parseErc6492Signature,
  type ParseErc6492SignatureReturnType,
} from "../auth/parse-erc6492-signature.js";
export type { Erc6492Signature } from "../auth/types.js";

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
