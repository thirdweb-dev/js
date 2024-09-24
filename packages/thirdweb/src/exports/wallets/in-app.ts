// --- KEEEP IN SYNC with exports/wallets/in-app.native.ts ---

export { inAppWallet } from "../../wallets/in-app/web/in-app.js";

export {
  preAuthenticate,
  authenticate,
  getUserEmail,
  getUserPhoneNumber,
  getProfiles,
  linkProfile,
} from "../../wallets/in-app/web/lib/auth/index.js";

export { type GetAuthenticatedUserParams } from "../../wallets/in-app/core/authentication/types.js";
export type {
  InAppWalletCreationOptions,
  InAppWalletAuth,
  InAppWalletSocialAuth,
  InAppWalletConnectionOptions,
} from "../../wallets/in-app/core/wallet/types.js";

export { hasStoredPasskey } from "../../wallets/in-app/web/lib/auth/passkeys.js";

export { socialIcons } from "../../react/core/utils/walletIcon.js";
