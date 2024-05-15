import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import {
  type GetUser,
  type InAppWalletConstructorType,
  UserWalletStatus,
} from "../interfaces/in-app-wallets/in-app-wallets.js";
import { InAppWalletIframeCommunicator } from "../utils/iFrameCommunication/InAppWalletIframeCommunicator.js";
import { Auth, type AuthQuerierTypes } from "./auth/index.js";
import { InAppWallet } from "./core/in-app-wallet.js";

/**
 * @internal
 */
export class InAppWalletSdk {
  protected client: ThirdwebClient;
  protected querier: InAppWalletIframeCommunicator<AuthQuerierTypes>;

  private wallet: InAppWallet;
  /**
   * Used to manage the Auth state of the user.
   */
  auth: Auth;

  private isClientIdLegacyPaper(clientId: string): boolean {
    if (clientId.indexOf("-") > 0 && clientId.length === 36) {
      return true;
    }
    return false;
  }

  /**
   * @example
   * `const thirdwebInAppWallet = new InAppWalletSdk({ clientId: "", chain: "Goerli" });`
   * @internal
   */
  constructor({ client, onAuthSuccess }: InAppWalletConstructorType) {
    if (this.isClientIdLegacyPaper(client.clientId)) {
      throw new Error(
        "You are using a legacy clientId. Please use the clientId found on the thirdweb dashboard settings page",
      );
    }
    const baseUrl = getThirdwebBaseUrl("inAppWallet");
    this.client = client;
    this.querier = new InAppWalletIframeCommunicator({
      clientId: client.clientId,
      baseUrl,
    });
    this.wallet = new InAppWallet({
      client,
      querier: this.querier,
    });

    this.auth = new Auth({
      client,
      querier: this.querier,
      baseUrl,
      onAuthSuccess: async (authResult) => {
        onAuthSuccess?.(authResult);
        await this.wallet.postWalletSetUp({
          ...authResult.walletDetails,
          walletUserId: authResult.storedToken.authDetails.userWalletId,
        });
        await this.querier.call({
          procedureName: "initIframe",
          params: {
            deviceShareStored: authResult.walletDetails.deviceShareStored,
            clientId: this.client.clientId,
            walletUserId: authResult.storedToken.authDetails.userWalletId,
            authCookie: authResult.storedToken.cookieString,
          },
        });
        return {
          user: {
            status: UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED,
            authDetails: authResult.storedToken.authDetails,
            wallet: this.wallet,
            walletAddress: authResult.walletDetails.walletAddress,
          },
        };
      },
    });
  }

  /**
   * Gets the usr if they are logged in
   * @example
   * ```js
   *  const user = await thirdwebInAppWallet.getUser();
   *  switch (user.status) {
   *     case UserWalletStatus.LOGGED_OUT: {
   *       // User is logged out, call one of the auth methods on thirdwebInAppWallet.auth to authenticate the user
   *       break;
   *     }
   *     case UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED: {
   *       // user is logged in and wallet is all set up.
   *       // You have access to:
   *       user.status;
   *       user.authDetails;
   *       user.walletAddress;
   *       user.wallet;
   *       break;
   *     }
   * }
   * ```
   * @returns GetUser - an object to containing various information on the user statuses
   */
  async getUser(): Promise<GetUser> {
    return this.wallet.getUserWalletStatus();
  }
}
