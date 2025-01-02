import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Account } from "../../../../interfaces/wallet.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type {
  AuthResultAndRecoveryCode,
  GetUser,
} from "../../../core/authentication/types.js";
import type { IWebWallet } from "../../../core/wallet/web-wallet.js";
import { fetchUserDetails } from "../api/fetchers.js";
import { postAuth } from "../auth/middleware.js";
import { getWalletUserDetails } from "../storage/local.js";
import { getExistingUserAccount } from "./retrieval.js";

export class ShardedWallet implements IWebWallet {
  private client: ThirdwebClient;
  private storage: ClientScopedStorage;

  constructor(args: {
    client: ThirdwebClient;
    storage: ClientScopedStorage;
  }) {
    this.client = args.client;
    this.storage = args.storage;
  }

  async postWalletSetUp(authResult: AuthResultAndRecoveryCode): Promise<void> {
    await postAuth({
      storedToken: authResult.storedToken,
      client: this.client,
      storage: this.storage,
      encryptionKey: authResult.encryptionKey,
    });
  }

  async getUserWalletStatus(): Promise<GetUser> {
    const localData = await getWalletUserDetails(this.client.clientId);
    const userStatus = await fetchUserDetails({
      client: this.client,
      email: localData?.email,
      storage: this.storage,
    });
    if (userStatus.status === "Logged In, Wallet Initialized") {
      return {
        status: userStatus.status,
        authDetails: userStatus.storedToken.authDetails,
        walletAddress: userStatus.walletAddress,
        account: await this.getAccount(),
      };
    }
    if (userStatus.status === "Logged In, New Device") {
      return {
        status: "Logged In, New Device",
        authDetails: userStatus.storedToken.authDetails,
        walletAddress: userStatus.walletAddress,
      };
    }
    if (userStatus.status === "Logged In, Wallet Uninitialized") {
      return {
        status: "Logged In, Wallet Uninitialized",
        authDetails: userStatus.storedToken.authDetails,
      };
    }
    // Logged out
    return { status: "Logged Out" };
  }
  getAccount(): Promise<Account> {
    return getExistingUserAccount({
      client: this.client,
      storage: this.storage,
    });
  }
}
