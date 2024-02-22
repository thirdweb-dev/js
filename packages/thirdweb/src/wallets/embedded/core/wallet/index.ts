import type { Account, Wallet } from "../../../interfaces/wallet.js";
import type { WalletMetadata } from "../../../types.js";
import type {
  MultiStepAuthArgsType,
  PreAuthArgsType,
  SingleStepAuthArgsType,
} from "../authentication/type.js";
import type { AuthenticatedUser, EmbeddedWalletConfig } from "./types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Chain } from "../../../../chains/types.js";
import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import {
  getSavedConnectParamsFromStorage,
  saveConnectParamsToStorage,
} from "../../../manager/storage.js";
import type { InitializedUser } from "../../implementations/index.js";

type SavedConnectParams = {
  chain: Chain;
};

/**
 * Embedded Wallet
 * @param args - The args to use for the wallet
 * @returns The embedded wallet
 * @example
 * ```ts
 * import { embeddedWallet } from "thirdweb/wallets";
 *
 * const wallet = embeddedWallet({
 *   client,
 * });
 * await wallet.connect({
 *   strategy: "google",
 * });
 * ```
 */
export function embeddedWallet(args: EmbeddedWalletConfig) {
  return new EmbeddedWallet(args);
}

export const embeddedWalletMetadata: WalletMetadata = {
  id: "embedded-wallet",
  name: "Embedded Wallet",
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzM1ODlfODY0OSkiPgo8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSI4IiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMzU4OV84NjQ5KSIvPgo8cmVjdCB4PSItMSIgeT0iLTEiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcng9IjkuOCIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzM1ODlfODY0OSkiLz4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAxXzM1ODlfODY0OSkiPgo8cGF0aCBkPSJNMjQgMTQuMjVDMTguNjE3MiAxNC4yNSAxNC4yNSAxOC42MTcyIDE0LjI1IDI0QzE0LjI1IDI5LjM4MjggMTguNjE3MiAzMy43NSAyNCAzMy43NUMyNC44OTg4IDMzLjc1IDI1LjYyNSAzNC40NzYyIDI1LjYyNSAzNS4zNzVDMjUuNjI1IDM2LjI3MzggMjQuODk4OCAzNyAyNCAzN0MxNi44MTk1IDM3IDExIDMxLjE4MDUgMTEgMjRDMTEgMTYuODE5NSAxNi44MTk1IDExIDI0IDExQzMxLjE4MDUgMTEgMzcgMTYuODE5NSAzNyAyNFYyNS42MjVDMzcgMjguMzE2NCAzNC44MTY0IDMwLjUgMzIuMTI1IDMwLjVDMzAuNjM3MSAzMC41IDI5LjMwMTYgMjkuODI5NyAyOC40MDc4IDI4Ljc3ODVDMjcuMjUgMjkuODQ0OSAyNS43MDEyIDMwLjUgMjQgMzAuNUMyMC40MDk4IDMwLjUgMTcuNSAyNy41OTAyIDE3LjUgMjRDMTcuNSAyMC40MDk4IDIwLjQwOTggMTcuNSAyNCAxNy41QzI1LjQxNjggMTcuNSAyNi43MjcgMTcuOTUyIDI3Ljc5MzQgMTguNzIzOEMyOC4wODI4IDE4LjQ2OTkgMjguNDU4NiAxOC4zMTI1IDI4Ljg3NSAxOC4zMTI1QzI5Ljc3MzggMTguMzEyNSAzMC41IDE5LjAzODcgMzAuNSAxOS45Mzc1VjI1LjYyNUMzMC41IDI2LjUyMzggMzEuMjI2MiAyNy4yNSAzMi4xMjUgMjcuMjVDMzMuMDIzOCAyNy4yNSAzMy43NSAyNi41MjM4IDMzLjc1IDI1LjYyNVYyNEMzMy43NSAxOC42MTcyIDI5LjM4MjggMTQuMjUgMjQgMTQuMjVaTTI3LjI1IDI0QzI3LjI1IDIzLjEzOCAyNi45MDc2IDIyLjMxMTQgMjYuMjk4MSAyMS43MDE5QzI1LjY4ODYgMjEuMDkyNCAyNC44NjIgMjAuNzUgMjQgMjAuNzVDMjMuMTM4IDIwLjc1IDIyLjMxMTQgMjEuMDkyNCAyMS43MDE5IDIxLjcwMTlDMjEuMDkyNCAyMi4zMTE0IDIwLjc1IDIzLjEzOCAyMC43NSAyNEMyMC43NSAyNC44NjIgMjEuMDkyNCAyNS42ODg2IDIxLjcwMTkgMjYuMjk4MUMyMi4zMTE0IDI2LjkwNzYgMjMuMTM4IDI3LjI1IDI0IDI3LjI1QzI0Ljg2MiAyNy4yNSAyNS42ODg2IDI2LjkwNzYgMjYuMjk4MSAyNi4yOTgxQzI2LjkwNzYgMjUuNjg4NiAyNy4yNSAyNC44NjIgMjcuMjUgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjwvZz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8zNTg5Xzg2NDkiIHgxPSIyNS41IiB5MT0iLTYuMjk1NzJlLTA2IiB4Mj0iMzAuMjAxNiIgeTI9IjQ3LjUzNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjODM1OEJBIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzdCMUNGNyIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MV9saW5lYXJfMzU4OV84NjQ5IiB4MT0iMjUuNTYyNSIgeTE9Ii0xLjAwMDAxIiB4Mj0iMzAuNDYiIHkyPSI0OC41MTU2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM4MzU4QkEiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjN0IxQ0Y3Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMzU4OV84NjQ5Ij4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPGNsaXBQYXRoIGlkPSJjbGlwMV8zNTg5Xzg2NDkiPgo8cmVjdCB3aWR0aD0iMjYiIGhlaWdodD0iMjYiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMSAxMSkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K", // TODO (ew)
};

/**
 * Embedded Wallet allows users to connect to connect using the Email or Social logins.
 */
export class EmbeddedWallet implements Wallet {
  metadata: WalletMetadata;
  client: ThirdwebClient;
  isEmbeddedWallet: true;

  private account?: Account;
  private chain: Chain | undefined;
  private user: InitializedUser | undefined;

  events: Wallet["events"];

  /**
   * Create a new Embedded Wallet
   * @param options  - The options to configure the embedded wallet initialization
   * @example
   * ```ts
   * const wallet = embeddedWallet({
   *  client,
   * });
   * await wallet.connect({
   *   strategy: "google",
   * });
   * ```
   */
  constructor(options: EmbeddedWalletConfig) {
    this.client = options.client;
    this.metadata = embeddedWalletMetadata;
    this.isEmbeddedWallet = true;
  }

  /**
   * Pre step for 2 step authentication like sending an OTP verification email
   * @param options - The options for pre-authentication
   * @example
   * ```ts
   * await wallet.preAuthenticate(options);
   * ```
   * @returns information about the un-authenticated user.
   */
  async preAuthenticate(options: Omit<PreAuthArgsType, "client">) {
    const { preAuthenticate } = await import("../authentication/index.js");
    return preAuthenticate({
      client: this.client,
      ...options,
    });
  }

  /**
   * Connect Embedded Wallet
   * @param options - The options for configuring the connection
   * @example
   * ```ts
   * const account = await wallet.connect(options);
   * ```
   * @returns A Promise that resolves to the connected `Account`
   */
  async connect(
    options: (MultiStepAuthArgsType | SingleStepAuthArgsType) & {
      chain?: Chain;
    },
  ): Promise<Account> {
    const { authenticate } = await import("../authentication/index.js");

    const authResult = await authenticate({
      client: this.client,
      ...options,
    });
    const authAccount = await authResult.user.wallet.getAccount();

    this.account = authAccount;
    this.user = authResult.user;
    this.chain = options.chain || ethereum;

    const params: SavedConnectParams = {
      chain: this.chain,
    };
    saveConnectParamsToStorage(this.metadata.id, params);

    return authAccount;
  }

  /**
   * Auto connect to saved session
   * @example
   * ```ts
   * const account = await wallet.autoConnect();
   * ```
   * @returns A Promise that resolves to the connected `Account`
   */
  async autoConnect(): Promise<Account> {
    const { getAuthenticatedUser } = await import("../authentication/index.js");
    const user = await getAuthenticatedUser({ client: this.client });
    if (!user) {
      throw new Error("not authenticated");
    }

    const savedParams: SavedConnectParams | null =
      await getSavedConnectParamsFromStorage(this.metadata.id);

    const authAccount = await user.wallet.getAccount();

    this.account = authAccount;
    this.user = user;
    if (savedParams) {
      this.chain = savedParams.chain;
    } else {
      this.chain = ethereum;
    }

    return authAccount;
  }

  /**
   * Disconnect the wallet
   * @example
   * ```ts
   * await wallet.disconnect();
   * ```
   */
  async disconnect(): Promise<void> {
    this.account = undefined;
    this.chain = undefined;
    this.user = undefined;
  }

  /**
   * Get the account associated with the wallet
   * @example
   * ```ts
   * const account = wallet.getAccount();
   * ```
   * @returns The `Account` object associated with the wallet
   */
  getAccount(): Account | undefined {
    return this.account;
  }

  /**
   * Get the chain the wallet is currently connected to
   * @example
   * ```ts
   * const chain = wallet.getChain();
   * ```
   * @returns The `Chain` object for the chain the wallet is currently connected to
   */
  getChain() {
    return this.chain;
  }

  /**
   * Switch wallet to chain with given `Chain` object
   * @param chain - The chain to switch to
   * @example
   * ```ts
   * await wallet.switchChain(chain);
   * ```
   */
  async switchChain(chain: Chain) {
    saveConnectParamsToStorage(this.metadata.id, { chain });
    this.chain = chain;
  }

  /**
   * Get the Embedded Wallet user information. It returns the `AuthenticatedUser` object if wallet is connected. Otherwise, it returns `undefined`.
   * @example
   * ```ts
   * const user = wallet.getUser();
   * ```
   * @returns The `AuthenticatedUser` object associated with the wallet
   */
  getUser(): AuthenticatedUser | undefined {
    if (!this.user) {
      return undefined;
    }
    return {
      email: this.user.authDetails.email,
      walletAddress: this.user.walletAddress,
    };
  }
}
