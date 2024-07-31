export {
  inAppWallet,
  /**
   * @deprecated use inAppWallet instead
   */
  inAppWallet as embeddedWallet,
} from "../../wallets/in-app/web/in-app.js";

export {
  preAuthenticate,
  authenticate,
  getUserEmail,
} from "../../wallets/in-app/web/lib/auth/index.js";

export { type GetAuthenticatedUserParams } from "../../wallets/in-app/core/authentication/type.js";
