export { inAppWallet } from "../../wallets/create-wallet.js";

export {
  preAuthenticate,
  authenticate,
  getUserEmail,
  getUserPhoneNumber,
  type GetAuthenticatedUserParams,
} from "../../wallets/in-app/core/authentication/index.js";

export { hasStoredPasskey } from "../../wallets/in-app/web/lib/auth/passkeys.js";

export { socialIcons } from "../../react/web/wallets/in-app/socialIcons.js";
