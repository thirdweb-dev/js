// --- KEEEP IN SYNC with exports/wallets/in-app.native.ts ---

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
