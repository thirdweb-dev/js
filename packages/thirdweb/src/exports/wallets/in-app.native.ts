// --- KEEEP IN SYNC with exports/wallets/in-app.ts ---

export { inAppWallet } from "../../wallets/in-app/native/in-app.js";

export {
  preAuthenticate,
  authenticate,
  getUserEmail,
  getUserPhoneNumber,
  getProfiles,
  linkProfile,
} from "../../wallets/in-app/native/auth/index.js";

export { type GetAuthenticatedUserParams } from "../../wallets/in-app/core/authentication/types.js";
export type {
  InAppWalletCreationOptions,
  InAppWalletAuth,
  InAppWalletSocialAuth,
  InAppWalletConnectionOptions,
} from "../../wallets/in-app/core/wallet/types.js";

export { hasStoredPasskey } from "../../wallets/in-app/native/auth/passkeys.js";
