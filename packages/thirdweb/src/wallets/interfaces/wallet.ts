import type { Address } from "abitype";
import type {
  Hex,
  SignableMessage,
  TransactionSerializable,
  TypedData,
  TypedDataDefinition,
} from "viem";
import type { WalletEventListener } from "./listeners.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import type { Chain } from "../../chains/types.js";
import type { SendTransactionResult } from "../../transaction/types.js";
import { normalizeChainId } from "../utils/normalizeChainId.js";
import { defineChain } from "../../chains/utils.js";
import { injectedProvider } from "../injected/mipdStore.js";
import type {
  CreateWalletArgs,
  InjectedConnectOptions,
  WalletAutoConnectionOption,
  WalletConnectionOption,
  WalletCreationOptions,
  WalletId,
} from "../wallet-types.js";
import type {
  WCAutoConnectOptions,
  WCConnectOptions,
} from "../wallet-connect/types.js";
import type { AsyncStorage } from "../storage/AsyncStorage.js";
import {
  getWalletData,
  setWalletData,
  type WalletData,
} from "./wallet-data.js";

// TODO: add generic ID on wallet class, creation options, connect options etc

export type SendTransactionOption = TransactionSerializable & {
  chainId: number;
};

/**
 * Wallet interface
 */
export class Wallet<ID extends WalletId = WalletId> {
  id: ID;
  events?: {
    addListener: WalletEventListener;
    removeListener: WalletEventListener;
  };

  /**
   * Create a Wallet instance
   * @param args - The walletId and options to create the wallet.
   * @example
   * ```ts
   * // connect to `window.ethereum` provider
   * const wallet = new Wallet();
   * ```
   */
  constructor(...args: CreateWalletArgs<ID>) {
    const [id, options] = args;
    this.id = id;

    const data: WalletData<ID> = {
      chain: undefined,
      options: options as WalletCreationOptions<ID>,
      onChainChanged: (newChainId: string) => {
        const chainId = normalizeChainId(newChainId);
        data.chain = defineChain(chainId);
      },
      onDisconnect: () => {
        data.account = undefined;
        data.chain = undefined;
      },
    };

    // set the wallet data
    setWalletData(this, data);
  }

  // TODO: change it to event emitter instead later

  /**
   *
   * Set the storage interface for the wallet
   * @param storage  - The storage interface
   * @example
   * ```ts
   * wallet.setStorage(storage);
   * ```
   */
  setStorage(storage: AsyncStorage) {
    const data = getWalletData(this);
    if (data) {
      data.storage = storage;
    }
  }

  /**
   * Get the `Chain` object of the blockchain that the wallet is connected to.
   * @returns The `Chain` object
   * @example
   * ```ts
   * const chain = wallet.getChain();
   * ```
   */
  getChain(): Chain | undefined {
    return getWalletData(this)?.chain;
  }

  /**
   * Get the connected `Account`
   * @returns The connected `Account` object
   * @example
   * ```ts
   * const account = wallet.getAccount();
   * ```
   */
  getAccount(): Account | undefined {
    return getWalletData(this)?.account;
  }

  /**
   * Auto connect to the wallet provider. This only succeeds if the wallet provider is still connected.
   *
   * Auto connect is useful to avoid asking the user to connect to the wallet provider again on page refresh or revisit.
   * @param options - The options for auto connecting wallet
   * @example
   * ```ts
   * const account = await wallet.autoConnect();
   * ```
   * @returns A Promise that resolves to the connected `Account`
   */
  async autoConnect(options: WalletAutoConnectionOption<ID>): Promise<Account> {
    const data = getWalletData(this);

    switch (true) {
      // smart wallet case
      case this.id === "smart": {
        const { connectSmartWallet, disconnect } = await import(
          "../smart/index.js"
        );
        if (data) {
          data.methods = {
            disconnect(wallet) {
              return disconnect(wallet as Wallet<"smart">);
            },
          };
        }
        return connectSmartWallet(
          this as Wallet<"smart">,
          options as WalletConnectionOption<"smart">,
        );
      }
      // embedded wallet case
      case this.id === "embedded": {
        const {
          autoConnectEmbeddedWallet,
          switchChainEmbeddedWallet,
          disconnectEmbeddedWallet,
        } = await import("../embedded/core/wallet/index.js");
        if (data) {
          data.methods = {
            switchChain: switchChainEmbeddedWallet,
            disconnect: disconnectEmbeddedWallet,
          };
        }
        return autoConnectEmbeddedWallet(
          this,
          options as WalletConnectionOption<"embedded">,
        );
      }
      // wallet connect case
      case options && "walletConnect" in options: {
        const wcOptions = options as WCAutoConnectOptions;
        const { autoConnectWC, switchChainWC, disconnectWC } = await import(
          "../wallet-connect/index.js"
        );

        if (data) {
          data.methods = {
            switchChain(wallet, chain) {
              return switchChainWC(wallet, chain);
            },
            disconnect: disconnectWC,
          };
        }

        return autoConnectWC(this, wcOptions);
      }

      // injected provider case
      case !!injectedProvider(this.id): {
        const { autoConnectInjectedWallet, switchChainInjectedWallet } =
          await import("../injected/index.js");
        if (data) {
          data.methods = {
            switchChain(wallet, chain) {
              return switchChainInjectedWallet(wallet, chain);
            },
          };
        }

        return autoConnectInjectedWallet(this);
      }

      default:
        throw new Error("Failed to auto connect");
    }
  }

  /**
   * Connect to Wallet
   * @param options - The options for connecting wallet
   * @example
   * ```ts
   * await wallet.connect()
   * ```
   * @returns A Promise that resolves to the connected account
   */
  async connect(options: WalletConnectionOption<ID>) {
    const data = getWalletData(this);

    switch (true) {
      // smart wallet case
      case this.id === "smart": {
        const { connectSmartWallet, disconnect } = await import(
          "../smart/index.js"
        );
        if (data) {
          data.methods = {
            disconnect(wallet) {
              return disconnect(wallet as Wallet<"smart">);
            },
          };
        }
        return connectSmartWallet(
          this,
          options as WalletConnectionOption<"smart">,
        );
      }
      // embedded wallet case
      case this.id === "embedded": {
        const {
          connectEmbeddedWallet,
          switchChainEmbeddedWallet,
          disconnectEmbeddedWallet,
        } = await import("../embedded/core/wallet/index.js");

        if (data) {
          data.methods = {
            switchChain: switchChainEmbeddedWallet,
            disconnect: disconnectEmbeddedWallet,
          };
        }

        return connectEmbeddedWallet(
          this,
          options as WalletConnectionOption<"embedded">,
        );
      }
      // wallet connect case
      case options && "walletConnect" in options: {
        const wcOptions = options as WCConnectOptions;
        const { connectWC, switchChainWC, disconnectWC } = await import(
          "../wallet-connect/index.js"
        );

        if (data) {
          data.methods = {
            switchChain: switchChainWC,
            disconnect: disconnectWC,
          };
        }

        return await connectWC(this, wcOptions);
      }

      // injected provider case
      case !!injectedProvider(this.id): {
        const { connectInjectedWallet, switchChainInjectedWallet } =
          await import("../injected/index.js");
        if (data) {
          data.methods = {
            switchChain(wallet, chain) {
              return switchChainInjectedWallet(wallet, chain);
            },
          };
        }

        return connectInjectedWallet(this, options as InjectedConnectOptions);
      }

      default:
        throw new Error("Failed to connect");
    }
  }

  /**
   * Disconnect from the Injected Wallet Provider.
   * @example
   * ```ts
   * await wallet.disconnect()
   * ```
   */
  async disconnect() {
    const data = getWalletData(this);
    data?.onDisconnect();
    const disconnectMethod = data?.methods?.disconnect;
    if (disconnectMethod) {
      await disconnectMethod(this);
    }
  }

  /**
   * Switch the wallet to a different blockchain by passing the `Chain` object of it.
   * If the wallet already has the capability to connect to the blockchain, it will switch to it. If not, Wallet will prompt the user to confirm adding a new blockchain to the wallet.
   * Depending on the wallet - this action may require the user to confirm the switch chain request or add a new blockchain request.
   *
   * This method throws an error if the wallet fails to do the above or user denies the switch chain request or denies adding a new blockchain request.
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain.
   * @param chain - The `Chain` object of the blockchain
   * @example
   * ```ts
   * import { defineChain } from "thirdweb";
   * const mumbai = defineChain({
   *  id: 80001,
   * });
   * await wallet.switchChain(mumbai)
   * ```
   */
  async switchChain(chain: Chain) {
    const method = getWalletData(this)?.methods?.switchChain;
    if (!method) {
      throw new Error("Switch chain not supported by wallet");
    }

    await method(this, chain);
  }
}

export type Account = {
  // REQUIRED
  address: Address;
  sendTransaction: (
    tx: SendTransactionOption,
  ) => Promise<SendTransactionResult>;
  signMessage: ({ message }: { message: SignableMessage }) => Promise<Hex>;
  signTypedData: <
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
  >(
    _typedData: TypedDataDefinition<typedData, primaryType>,
  ) => Promise<Hex>;

  // OPTIONAL
  estimateGas?: (tx: PreparedTransaction) => Promise<bigint>;
  signTransaction?: (tx: TransactionSerializable) => Promise<Hex>;
  sendBatchTransaction?: (
    txs: SendTransactionOption[],
  ) => Promise<SendTransactionResult>;
};
