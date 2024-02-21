import type { Account, Wallet } from "../../../interfaces/wallet.js";
import type { WalletMetadata } from "../../../types.js";
import type {
  MultiStepAuthArgsType,
  PreAuthArgsType,
  SingleStepAuthArgsType,
} from "../authentication/type.js";
import {
  authenticate,
  getAuthenticatedUser,
  preAuthenticate,
} from "../authentication/index.js";
import type { EmbeddedWalletConfig } from "./types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Chain } from "../../../../chains/types.js";
import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";

/**
 * Embedded Wallet
 * @param args - The args to use for the wallet
 * @param args.client - The ThirdwebClient to use for the wallet
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

class EmbeddedWallet implements Wallet {
  metadata: WalletMetadata = {
    id: "embedded-wallet",
    name: "Embedded Wallet",
    iconUrl: "", // TODO (ew)
  };
  client: ThirdwebClient;
  account?: Account;
  chain: Chain;

  constructor(args: EmbeddedWalletConfig) {
    this.client = args.client;
    this.chain = args.defaultChain ?? ethereum;
  }

  async preAuthenticate(options: Omit<PreAuthArgsType, "client">) {
    return preAuthenticate({
      client: this.client,
      ...options,
    });
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
