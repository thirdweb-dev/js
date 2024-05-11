import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import type { Account, Wallet } from "../wallets/interfaces/wallet.js";
import { createWalletEmitter } from "../wallets/wallet-emitter.js";

export type AdapterWalletOptions = {
  client: ThirdwebClient;
  adaptedAccount: Account;
  chain: Chain;
  onDisconnect: () => Promise<void> | void;
  switchChain: (chain: Chain) => Promise<void> | void;
};

export function createWalletAdapter(
  options: AdapterWalletOptions,
): Wallet<"adapter"> {
  const emitter = createWalletEmitter<"adapter">();
  let _chain = options.chain;
  return {
    id: "adapter",
    subscribe: emitter.subscribe,
    connect: async () => {
      emitter.emit("onConnect", options);
      return options.adaptedAccount;
    },
    autoConnect: async () => {
      emitter.emit("onConnect", options);
      return options.adaptedAccount;
    },
    disconnect: async () => {
      await options.onDisconnect();
      emitter.emit("disconnect", undefined);
    },
    getAccount() {
      return options.adaptedAccount;
    },
    getChain() {
      return _chain;
    },
    getConfig() {
      return options;
    },
    switchChain: async (chain) => {
      await options.switchChain(chain);
      _chain = chain;
      emitter.emit("chainChanged", chain);
    },
  };
}
