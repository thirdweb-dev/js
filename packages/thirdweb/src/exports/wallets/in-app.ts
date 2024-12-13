// --- KEEEP IN SYNC with exports/wallets/in-app.native.ts ---

export { inAppWallet } from "../../wallets/in-app/web/in-app.js";

export {
  preAuthenticate,
  authenticate,
  getUserEmail,
  getUserPhoneNumber,
  getProfiles,
  linkProfile,
  unlinkProfile,
} from "../../wallets/in-app/web/lib/auth/index.js";

export type { GetAuthenticatedUserParams } from "../../wallets/in-app/core/authentication/types.js";
export type {
  InAppWalletCreationOptions,
  InAppWalletAuth,
  InAppWalletSocialAuth,
  InAppWalletConnectionOptions,
  InAppWalletAutoConnectOptions,
} from "../../wallets/in-app/core/wallet/types.js";

export type {
  MultiStepAuthArgsType,
  SingleStepAuthArgsType,
} from "../../wallets/in-app/core/authentication/types.js";

export { hasStoredPasskey } from "../../wallets/in-app/web/lib/auth/passkeys.js";

export {
  socialIcons,
  getSocialIcon,
} from "../../react/core/utils/walletIcon.js";
