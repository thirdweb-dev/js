export type { connectExternalWallet } from "./external.js";
export { loginAsGuest } from "./guest.js";
export {
  handleOauthRedirect,
  type LoginWithOauthOptions,
  type LoginWithOauthRedirectOptions,
  loginWithOauth,
  loginWithOauthRedirect,
} from "./oauth.js";
export {
  loginWithCode as verifyCode,
  type SendCodeOptions,
  sendCode,
  type VerifyCodeOptions,
} from "./otp.js";
export { type LoginWithPasskeyOptions, loginWithPasskey } from "./passkey.js";
export { type LoginWithWalletOptions, loginWithWallet } from "./siwe.js";
export type { BaseLoginOptions, UserWallet } from "./types.js";
