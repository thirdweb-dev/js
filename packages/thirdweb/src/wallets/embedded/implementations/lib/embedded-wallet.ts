import type { ThirdwebClient } from "../../../../index.js";
import {
  UserWalletStatus,
  type EmbeddedWalletConstructorType,
  type GetUser,
} from "../interfaces/embedded-wallets/embedded-wallets.js";
import { EmbeddedWalletIframeCommunicator } from "../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator.js";
import { Auth, type AuthQuerierTypes } from "./auth/index.js";
import { EmbeddedWallet } from "./core/embedded-wallet.js";

/**
 * @internal
 */
export class EmbeddedWalletSdk {
  protected client: ThirdwebClient;
  protected querier: EmbeddedWalletIframeCommunicator<AuthQuerierTypes>;

  private wallet: EmbeddedWallet;
  /**
   * Used to manage the Auth state of the user.
   */
  auth: Auth;

  private isClientIdLegacyPaper(clientId: string): boolean {
    if (clientId.indexOf("-") > 0 && clientId.length === 36) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @example
   * `const thirdwebEmbeddedWallet = new EmbeddedWalletSdk({ clientId: "", chain: "Goerli" });`
   * @internal
   */
  constructor({ client, onAuthSuccess }: EmbeddedWalletConstructorType) {
    if (this.isClientIdLegacyPaper(client.clientId)) {
      throw new Error(
        "You are using a legacy clientId. Please use the clientId found on the thirdweb dashboard settings page",
      );
    }
    this.client = client;
    this.querier = new EmbeddedWalletIframeCommunicator({
      clientId: client.clientId,
    });
    this.wallet = new EmbeddedWallet({
      client,
      querier: this.querier,
    });

    this.auth = new Auth({
      client,
      querier: this.querier,
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
   *  const user = await thirdwebEmbeddedWallet.getUser();
   *  switch (user.status) {
   *     case UserWalletStatus.LOGGED_OUT: {
   *       // User is logged out, call one of the auth methods on thirdwebEmbeddedWallet.auth to authenticate the user
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
