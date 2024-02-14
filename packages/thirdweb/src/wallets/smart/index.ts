import type {
  Account,
  SendTransactionOption,
  Wallet,
} from "../interfaces/wallet.js";
import type {
  SmartWalletConnectionOptions,
  SmartWalletOptions,
} from "./types.js";
import { createUnsignedUserOp, signUserOp } from "./lib/userop.js";
import { bundleUserOp } from "./lib/bundler.js";
import { getContract } from "../../contract/contract.js";
import { predictAddress } from "./lib/calls.js";

/**
 * Creates a smart wallet.
 * @param options - The options for the smart wallet.
 * @returns The created wallet.
 * @example
 * ```ts
 * import { smartWallet } from "thirdweb";
 * const wallet = await smartWallet({
 *  client,
 *  chain,
 *  personalAccount: myAccount,
 *  gasless: true,
 * });
 * ```
 */
export function smartWallet(options: SmartWalletOptions): Wallet {
  return new SmartWallet(options);
}

/**
 *
 */
export class SmartWallet implements Wallet {
  private options: SmartWalletOptions;
  metadata: Wallet["metadata"];
  chainId?: bigint | undefined;

  /**
   * Create an instance of the SmartWallet.
   * @param options - The options for the smart wallet.
   * @example
   * ```ts
   * const wallet = new SmartWallet(options)
   * ```
   */
  constructor(options: SmartWalletOptions) {
    this.options = options;
    this.metadata = {
      name: "SmartWallet",
      id: "smart-wallet",
      iconUrl: "",
    };
  }

  /**
   * Connect to the smart wallet using a personal account.
   * @param connectionOptions - The options for connecting to the smart wallet.
   * @example
   * ```ts
   * const smartAccount = await wallet.connect({
   *  personalAccount,
   * })
   * ```
   * @returns The connected smart account.
   */
  async connect(
    connectionOptions: SmartWalletConnectionOptions,
  ): Promise<Account> {
    const chainId = BigInt(
      typeof this.options.chain === "object"
        ? this.options.chain.id
        : this.options.chain,
    );

    if (connectionOptions.personalAccount.wallet.chainId !== chainId) {
      throw new Error(
        "Personal account's wallet is on a different chain than the smart wallet.",
      );
    }

    return smartAccount(this, { ...this.options, ...connectionOptions });
  }

  /**
   * Auto connect the smart wallet using a personal account.
   * @param connectionOptions - The options for connecting to the smart wallet.
   * @example
   * ```ts
   * const smartAccount = await wallet.autoConnect({
   *  personalAccount,
   * })
   * ```
   * @returns The connected smart account.
   */
  async autoConnect(
    connectionOptions: SmartWalletConnectionOptions,
  ): Promise<Account> {
    return this.connect(connectionOptions);
  }

  /**
   * Disconnect smart wallet.
   * @example
   * ```ts
   * await wallet.disconnect()
   * ```
   */
  async disconnect(): Promise<void> {
    // noop
    // should we disconnect the personal account?
  }
}

async function smartAccount(
  wallet: Wallet,
  options: SmartWalletOptions & { personalAccount: Account },
): Promise<Account> {
  const factoryContract = getContract({
    client: options.client,
    address: options.factoryAddress,
    chain: options.chain,
  });
  const accountAddress = await predictAddress(factoryContract, options);
  const accountContract = getContract({
    client: options.client,
    address: accountAddress,
    chain: options.chain,
  });

  wallet.chainId =
    typeof options.chain === "object"
      ? BigInt(options.chain.id)
      : BigInt(options.chain);

  return {
    wallet,
    address: accountAddress,
    async sendTransaction(tx: SendTransactionOption) {
      const unsignedUserOp = await createUnsignedUserOp({
        factoryContract,
        accountContract,
        transaction: tx,
        options,
      });
      const signedUserOp = await signUserOp({
        options,
        userOp: unsignedUserOp,
      });
      const userOpHash = await bundleUserOp({
        options,
        userOp: signedUserOp,
      });
      return {
        userOpHash,
      };
    },
    async estimateGas() {
      // estimation is done in createUnsignedUserOp
      return 0n;
    },
    async signMessage({ message }) {
      // TODO optionally deploy on sign
      return options.personalAccount.signMessage({ message });
    },
    async signTypedData(typedData) {
      // TODO optionally deploy on sign
      return options.personalAccount.signTypedData(typedData);
    },
  };
}
