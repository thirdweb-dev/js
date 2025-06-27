// --- KEEEP IN SYNC with exports/wallets/in-app.native.ts ---

//ACCOUNT
export {
  type CreateSessionKeyOptions,
  createSessionKey,
  isCreateSessionKeySupported,
} from "../../extensions/erc7702/account/createSessionKey.js";
export type {
  Condition,
  LimitType,
} from "../../extensions/erc7702/account/types.js";
export {
  getSocialIcon,
  socialIcons,
} from "../../react/core/utils/walletIcon.js";
export type {
  GetAuthenticatedUserParams,
  MultiStepAuthArgsType,
  SingleStepAuthArgsType,
} from "../../wallets/in-app/core/authentication/types.js";
export type {
  InAppWalletAuth,
  InAppWalletAutoConnectOptions,
  InAppWalletConnectionOptions,
  InAppWalletCreationOptions,
  InAppWalletSocialAuth,
} from "../../wallets/in-app/core/wallet/types.js";
export { inAppWallet } from "../../wallets/in-app/web/in-app.js";
export {
  authenticate,
  getProfiles,
  getUserEmail,
  getUserPhoneNumber,
  linkProfile,
  preAuthenticate,
  unlinkProfile,
} from "../../wallets/in-app/web/lib/auth/index.js";
export { hasStoredPasskey } from "../../wallets/in-app/web/lib/auth/passkeys.js";
