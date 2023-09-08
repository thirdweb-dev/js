import type {
  EmbeddedWalletConstructorType,
  GetUser,
} from "../interfaces/embedded-wallets/embedded-wallets";
import {
  UserStatus,
  UserWalletStatus,
} from "../interfaces/embedded-wallets/embedded-wallets";
import { EmbeddedWalletIframeCommunicator } from "../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator";
import type { AuthQuerierTypes } from "./auth";
import { Auth } from "./auth";
import { EmbeddedWallet } from "./core/embedded-wallet";

export class EmbeddedWalletSdk {
  protected clientId: string;
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
   * const thirdwebEmbeddedWallet = new EmbeddedWalletSdk({ clientId: "", chain: "Goerli" });
   * @param {string} initParams.clientId the clientId found on the {@link https://thirdweb.com/dashboard/settings dashboard settings}
   * @param {Chain} initParams.chain sets the default chain that the EmbeddedWallet will live on.
   * @param {CustomizationOptionsType} initParams.styles sets the default style override for any modal that pops up asking for user's details when creating wallet or logging in.
   */
  constructor({ clientId, chain, styles }: EmbeddedWalletConstructorType) {
    if (this.isClientIdLegacyPaper(clientId)) {
      throw new Error(
        "You are using a legacy clientId. Please use the clientId found on the thirdweb dashboard settings page",
      );
    }
    this.clientId = clientId;
    this.querier = new EmbeddedWalletIframeCommunicator({
      clientId,
      customizationOptions: styles,
    });
    this.wallet = new EmbeddedWallet({
      clientId,
      chain,
      querier: this.querier,
    });

    this.auth = new Auth({
      clientId,
      querier: this.querier,
      onAuthSuccess: async (authResult) => {
        await this.wallet.postWalletSetUp({
          ...authResult.walletDetails,
          walletUserId: authResult.storedToken.authDetails.userWalletId,
        });
        return {
          user: {
            status: UserStatus.LOGGED_IN_WALLET_INITIALIZED,
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
   *  const user = await thirdwebEmbeddedWallet.getUser();
   *  switch (user.status) {
   *     case UserStatus.LOGGED_OUT: {
   *       // User is logged out, call one of the auth methods on thirdwebEmbeddedWallet.auth to authenticate the user
   *       break;
   *     }
   *     case UserStatus.LOGGED_IN_WALLET_INITIALIZED: {
   *       // user is logged in and wallet is all set up.
   *       // You have access to:
   *       user.status;
   *       user.authDetails;
   *       user.walletAddress;
   *       user.wallet;
   *       break;
   *     }
   *}
   * @returns {GetUser} an object to containing various information on the user statuses
   */
  async getUser(): Promise<GetUser> {
    const userStatus = await this.wallet.getUserWalletStatus();
    switch (userStatus.status) {
      // user gets {UserWalletStatus.LOGGED_IN_NEW_DEVICE} when they log in but never complete the recovery flow and exits (close modal, refresh etc)
      case UserWalletStatus.LOGGED_IN_NEW_DEVICE:
      // User gets {UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED} when they log in but manage to exit the client in the small window between auth completion and sending them their wallet recovery details
      case UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED:
        // in both case, we simply log them out to reset their state
        await this.auth.logout();
        return this.getUser();
      case UserWalletStatus.LOGGED_OUT:
        return {
          status: UserStatus.LOGGED_OUT,
        };
      case UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED:
        return {
          status: UserStatus.LOGGED_IN_WALLET_INITIALIZED,
          ...userStatus.user,
        };
    }
  }
}
