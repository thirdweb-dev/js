export {
  inAppWallet,
  /**
   * @deprecated use inAppWallet instead
   */
  inAppWallet as embeddedWallet,
} from "../../wallets/create-wallet.js";

export {
  preAuthenticate,
  authenticate,
  getUserEmail,
  type GetAuthenticatedUserParams,
} from "../../wallets/in-app/core/authentication/index.js";
