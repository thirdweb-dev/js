export type { GetAuthenticatedUserParams } from "../../wallets/in-app/core/authentication/types.js";
export {
  inAppWallet,
  /**
   * @deprecated use inAppWallet instead
   */
  inAppWallet as embeddedWallet,
} from "../../wallets/in-app/web/in-app.js";
export {
  authenticate,
  getUserEmail,
  preAuthenticate,
} from "../../wallets/in-app/web/lib/auth/index.js";
