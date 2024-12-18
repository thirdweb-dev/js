// --- KEEEP IN SYNC with exports/wallets/in-app.ts ---

export { inAppWallet } from "../../wallets/in-app/native/in-app.js";

export {
  preAuthenticate,
  authenticate,
  getUserEmail,
  getUserPhoneNumber,
  getProfiles,
  linkProfile,
  unlinkProfile,
} from "../../wallets/in-app/native/auth/index.js";

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

export { hasStoredPasskey } from "../../wallets/in-app/native/auth/passkeys.js";
