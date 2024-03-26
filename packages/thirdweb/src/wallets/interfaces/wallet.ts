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
} from "../__generated__/wallet-types.js";
import type {
  WCAutoConnectOptions,
  WCConnectOptions,
} from "../wallet-connect/types.js";
import type { AsyncStorage } from "../storage/AsyncStorage.js";

// TODO: add generic ID on wallet class, creation options, connect options etc

export type SendTransactionOption = TransactionSerializable & {
  chainId: number;
};

type WalletData<TWalletId extends WalletId> = {
  chain: Chain | undefined;
  storage?: AsyncStorage;
  options?: WalletCreationOptions<TWalletId>;
  account?: Account | undefined;
  onChainChanged: (newChainId: string) => void;
  onDisconnect: () => void;
  // dynamically loaded methods for given wallet id when doing connect/autoConnect
  methods?: {
    switchChain?: (wallet: Wallet<TWalletId>, chain: Chain) => Promise<void>;
    disconnect?: (wallet: Wallet<TWalletId>) => Promise<void>;
  };
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

  // TODO: hide this

  _data: WalletData<WalletId>;

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
    this._data = {
      chain: undefined,
      options,
      onChainChanged: (newChainId: string) => {
        const chainId = normalizeChainId(newChainId);
        this._data.chain = defineChain(chainId);
      },
      onDisconnect: () => {
        this._data.account = undefined;
        this._data.chain = undefined;
      },
    };
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
    this._data.storage = storage;
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
    return this._data.chain;
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
    return this._data.account;
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
    const isExtensionInstalled = injectedProvider(this.id);

    if (isExtensionInstalled) {
      const { autoConnectInjectedWallet, switchChainInjectedWallet } =
        await import("../injected/index.js");

      this._data.methods = {
        switchChain(wallet, chain) {
          return switchChainInjectedWallet(wallet, chain);
        },
      };

      return autoConnectInjectedWallet(this);
    }

    // wallet connect
    else {
      if (options && "walletConnect" in options) {
        const wcOptions = options as WCAutoConnectOptions;
        const { autoConnectWC, switchChainWC, disconnectWC } = await import(
          "../wallet-connect/index.js"
        );

        this._data.methods = {
          switchChain(wallet, chain) {
            return switchChainWC(wallet, chain);
          },
          disconnect: disconnectWC,
        };
        return autoConnectWC(this, wcOptions);
      }
    }

    throw new Error("Failed to auto connect");
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
    console.log("options", options);

    // wallet connect
    if (options && "walletConnect" in options) {
      const wcOptions = options as WCConnectOptions;
      const { connectWC, switchChainWC, disconnectWC } = await import(
        "../wallet-connect/index.js"
      );

      this._data.methods = {
        switchChain: switchChainWC,
        disconnect: disconnectWC,
      };

      await connectWC(this, wcOptions);
    }

    // injected
    const { connectInjectedWallet, switchChainInjectedWallet } = await import(
      "../injected/index.js"
    );

    this._data.methods = {
      switchChain(wallet, chain) {
        return switchChainInjectedWallet(wallet, chain);
      },
    };

    return connectInjectedWallet(this, options as InjectedConnectOptions);
  }

  /**
   * Disconnect from the Injected Wallet Provider.
   * @example
   * ```ts
   * await wallet.disconnect()
   * ```
   */
  async disconnect() {
    this._data.onDisconnect();
    const disconnectMethod = this._data.methods?.disconnect;
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
    const method = this._data.methods?.switchChain;
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
