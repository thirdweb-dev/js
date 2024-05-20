export { inAppWallet } from "../../wallets/create-wallet.js";

export {
  preAuthenticate,
  authenticate,
  getUserEmail,
  getUserPhoneNumber,
  type GetAuthenticatedUserParams,
} from "../../wallets/in-app/core/authentication/index.js";

export { hasStoredPasskey } from "../../wallets/in-app/implementations/lib/auth/passkeys.js";
