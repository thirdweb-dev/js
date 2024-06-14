// --- KEEEP IN SYNC with exports/wallets/in-app.native.ts ---

export { inAppWallet } from "../../wallets/in-app/web/in-app.js";

export {
  preAuthenticate,
  authenticate,
  getUserEmail,
  getUserPhoneNumber,
} from "../../wallets/in-app/web/lib/auth/index.js";

export { type GetAuthenticatedUserParams } from "../../wallets/in-app/core/authentication/type.js";

export { hasStoredPasskey } from "../../wallets/in-app/web/lib/auth/passkeys.js";

export { socialIcons } from "../../react/web/wallets/in-app/socialIcons.js";
