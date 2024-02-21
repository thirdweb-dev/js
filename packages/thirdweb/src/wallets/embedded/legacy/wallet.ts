import {
  defineChain,
  type Chain,
  type ThirdwebClient,
} from "../../../index.js";
import type { Account, Wallet } from "../../interfaces/wallet.js";
import type { WalletMetadata } from "../../types.js";
import type {
  MultiStepAuthArgsType,
  SingleStepAuthArgsType,
} from "../core/authentication/type.js";
import { authenticate, getAuthenticatedUser } from "./actions.js";

/**
 * Embedded Wallet
 * @param args - The args to use for the wallet
 * @param args.client - The ThirdwebClient to use for the wallet
 * @returns The embedded wallet
 * @example
 * ```ts
 * import { embeddedWallet } from "thirdweb/wallets/embedded/legacy/wallet";
 * import { ThirdwebClient } from "thirdweb";
 * const client = new ThirdwebClient();
 * const wallet = embeddedWallet({
 * client,
 * });
 * ```
 */
export function embeddedWallet(args: { client: ThirdwebClient }) {
  return new EmbeddedWallet(args);
}

class EmbeddedWallet implements Wallet {
  metadata: WalletMetadata = {
    id: "embedded-wallet",
    name: "Embedded Wallet",
    iconUrl: "", // TODO (ew)
  };
  client: ThirdwebClient;
  account?: Account;
  chain: Chain;

  constructor(args: { client: ThirdwebClient }) {
    this.client = args.client;
    this.chain = defineChain(1); // chainId doesn't matter for embedded wallets
  }

  async connect(
    options: MultiStepAuthArgsType | SingleStepAuthArgsType,
  ): Promise<Account> {
    const authResult = await authenticate({
      client: this.client,
      ...options,
    });
    const authAccount = await authResult.user.wallet.getAccount();
    this.account = authAccount;
    return authAccount;
  }

  async autoConnect(): Promise<Account> {
    const user = await getAuthenticatedUser({ client: this.client });
    if (!user) {
      throw new Error("not authenticated");
    }
    const authAccount = await user.wallet.getAccount();
    this.account = authAccount;
    return authAccount;
  }

  async disconnect(): Promise<void> {
    this.account = undefined;
  }

  getAccount(): Account | undefined {
    return this.account;
  }

  getChain() {
    return this.chain;
  }

  async switchChain(newChain: Chain) {
    this.chain = newChain;
  }
}
