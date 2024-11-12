import { trackConnect } from "../../analytics/track/connect.js";
import type { Chain } from "../../chains/types.js";
import { getCachedChainIfExists } from "../../chains/utils.js";
import {
  autoConnectEip1193Wallet,
  connectEip1193Wallet,
} from "../../wallets/injected/index.js";
import type { Account, Wallet } from "../../wallets/interfaces/wallet.js";
import { createWalletEmitter } from "../../wallets/wallet-emitter.js";
import type { WalletId } from "../../wallets/wallet-types.js";
import type { EIP1193Provider } from "./types.js";

export type FromEip1193AdapterOptions = {
  provider: EIP1193Provider | (() => Promise<EIP1193Provider>);
  walletId?: WalletId;
};

/**
 * Converts an EIP1193 provider to a Thirdweb wallet.
 *
 * @param options - The options for converting an EIP1193 provider to a Thirdweb wallet.
 * @returns A Thirdweb wallet.
 * @example
 * ```ts
 * import { EIP1193 } from "thirdweb/wallets";
 * const wallet = EIP1193.fromProvider({ provider });
 *
 * // ... now you can use wallet with ConnectButton, useConnect, etc
 * ```
 * @walletUtils
 */
export function fromProvider(options: FromEip1193AdapterOptions): Wallet {
  const id: WalletId = options.walletId ?? "adapter";
  const emitter = createWalletEmitter();
  let account: Account | undefined = undefined;
  let chain: Chain | undefined = undefined;
  let provider: EIP1193Provider | undefined = undefined;
  const getProvider = async () => {
    if (!provider) {
      provider =
        typeof options.provider === "function"
          ? await options.provider()
          : options.provider;
    }
    return provider;
  };

  const unsubscribeChain = emitter.subscribe("chainChanged", (newChain) => {
    chain = newChain;
  });

  function reset() {
    account = undefined;
    chain = undefined;
  }

  let handleDisconnect = async () => {};

  const unsubscribeDisconnect = emitter.subscribe("disconnect", () => {
    reset();
    unsubscribeChain();
    unsubscribeDisconnect();
  });

  emitter.subscribe("accountChanged", (_account) => {
    account = _account;
  });

  let handleSwitchChain: (chain: Chain) => Promise<void> = async () => {
    throw new Error("Not implemented");
  };

  return {
    id: options.walletId as WalletId,
    subscribe: emitter.subscribe,
    getConfig: () => undefined,
    getChain() {
      if (!chain) {
        return undefined;
      }

      chain = getCachedChainIfExists(chain.id) || chain;
      return chain;
    },
    getAccount: () => account,
    connect: async (connectOptions) => {
      const [connectedAccount, connectedChain, doDisconnect, doSwitchChain] =
        await connectEip1193Wallet({
          id,
          provider: await getProvider(),
          client: connectOptions.client,
          chain: connectOptions.chain,
          emitter,
        });
      // set the states
      account = connectedAccount;
      chain = connectedChain;
      handleDisconnect = doDisconnect;
      handleSwitchChain = doSwitchChain;
      emitter.emit("onConnect", connectOptions);
      trackConnect({
        client: connectOptions.client,
        walletType: id,
        walletAddress: account.address,
      });
      // return account
      return account;
    },
    autoConnect: async (connectOptions) => {
      const [connectedAccount, connectedChain, doDisconnect, doSwitchChain] =
        await autoConnectEip1193Wallet({
          id,
          provider: await getProvider(),
          emitter,
          chain: connectOptions.chain,
          client: connectOptions.client,
        });
      // set the states
      account = connectedAccount;
      chain = connectedChain;
      handleDisconnect = doDisconnect;
      handleSwitchChain = doSwitchChain;
      emitter.emit("onConnect", connectOptions);
      trackConnect({
        client: connectOptions.client,
        walletType: id,
        walletAddress: account.address,
      });
      // return account
      return account;
    },
    disconnect: async () => {
      reset();
      await handleDisconnect();
      emitter.emit("disconnect", undefined);
    },
    switchChain: async (c) => {
      await handleSwitchChain(c);
      emitter.emit("chainChanged", c);
    },
  };
}
