import * as ox__Hex from "ox/Hex";
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

/**
 * Options for creating an EIP-1193 provider adapter.
 */
export type FromEip1193AdapterOptions = {
  provider:
    | EIP1193Provider
    | ((params?: { chainId?: number }) => Promise<EIP1193Provider>);
  walletId?: WalletId;
};

/**
 * Creates a Thirdweb wallet from an EIP-1193 compatible provider.
 *
 * This adapter allows you to use any EIP-1193 provider (like MetaMask, WalletConnect, etc.) as a Thirdweb wallet.
 * It handles all the necessary conversions between the EIP-1193 interface and Thirdweb's wallet interface.
 *
 * @param options - Configuration options for creating the wallet adapter
 * @param options.provider - An EIP-1193 compatible provider or a function that returns one
 * @param options.walletId - Optional custom wallet ID to identify this provider (defaults to "adapter")
 * @returns A Thirdweb wallet instance that wraps the EIP-1193 provider
 *
 * @example
 * ```ts
 * import { EIP1193 } from "thirdweb/wallets";
 *
 * // Create a Thirdweb wallet from MetaMask's provider
 * const wallet = EIP1193.fromProvider({
 *   provider: window.ethereum,
 *   walletId: "io.metamask"
 * });
 *
 * // Use like any other Thirdweb wallet
 * const account = await wallet.connect({
 *   client: createThirdwebClient({ clientId: "..." })
 * });
 *
 * // Sign messages
 * await account.signMessage({ message: "Hello World" });
 *
 * // Send transactions
 * await account.sendTransaction({
 *   to: "0x...",
 *   value: 1000000000000000000n
 * });
 * ```
 *
 * @extension EIP1193
 */
export function fromProvider(options: FromEip1193AdapterOptions): Wallet {
  const id: WalletId = options.walletId ?? "adapter";
  const emitter = createWalletEmitter();
  let account: Account | undefined;
  let chain: Chain | undefined;
  let provider: EIP1193Provider | undefined;
  const getProvider = async (params?: { chainId?: number }) => {
    provider =
      typeof options.provider === "function"
        ? await options.provider(params)
        : options.provider;
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

  let handleSwitchChain: (c: Chain) => Promise<void> = async (c) => {
    await provider?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ox__Hex.fromNumber(c.id) }],
    });
  };

  return {
    autoConnect: async (connectOptions) => {
      const [connectedAccount, connectedChain, doDisconnect, doSwitchChain] =
        await autoConnectEip1193Wallet({
          chain: connectOptions.chain,
          client: connectOptions.client,
          emitter,
          id,
          provider: await getProvider({ chainId: connectOptions.chain?.id }),
        });
      // set the states
      account = connectedAccount;
      chain = connectedChain;
      handleDisconnect = doDisconnect;
      handleSwitchChain = doSwitchChain;
      emitter.emit("onConnect", connectOptions);
      trackConnect({
        client: connectOptions.client,
        walletAddress: account.address,
        walletType: id,
      });
      // return account
      return account;
    },
    connect: async (connectOptions) => {
      const [connectedAccount, connectedChain, doDisconnect, doSwitchChain] =
        await connectEip1193Wallet({
          chain: connectOptions.chain,
          client: connectOptions.client,
          emitter,
          id,
          provider: await getProvider({ chainId: connectOptions.chain?.id }),
        });
      // set the states
      account = connectedAccount;
      chain = connectedChain;
      handleDisconnect = doDisconnect;
      handleSwitchChain = doSwitchChain;
      emitter.emit("onConnect", connectOptions);
      trackConnect({
        client: connectOptions.client,
        walletAddress: account.address,
        walletType: id,
      });
      // return account
      return account;
    },
    disconnect: async () => {
      reset();
      await handleDisconnect();
      emitter.emit("disconnect", undefined);
    },
    getAccount: () => account,
    getChain() {
      if (!chain) {
        return undefined;
      }

      chain = getCachedChainIfExists(chain.id) || chain;
      return chain;
    },
    getConfig: () => undefined,
    id,
    subscribe: emitter.subscribe,
    switchChain: async (c) => {
      await handleSwitchChain(c);
      emitter.emit("chainChanged", c);
    },
  };
}
