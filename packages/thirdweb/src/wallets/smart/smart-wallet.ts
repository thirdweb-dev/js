import { trackConnect } from "../../analytics/track.js";
import type { Chain } from "../../chains/types.js";
import { getCachedChainIfExists } from "../../chains/utils.js";
import { getContract } from "../../contract/contract.js";
import { isContractDeployed } from "../../utils/bytecode/is-contract-deployed.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { createWalletEmitter } from "../wallet-emitter.js";
import type {
  CreateWalletArgs,
  WalletConnectionOption,
} from "../wallet-types.js";
import { getDefaultAccountFactory } from "./lib/constants.js";

/**
 * Creates a ERC4337 smart wallet based on a admin account.
 *
 * Smart wallets are smart contract wallets that enable multiple benefits for users:
 *
 * - Sponsor gas fees for transactions
 * - Multiple owners
 * - Session keys
 * - Batch transactions
 * - Predictable addresses
 * - Programmable features
 *
 * [Learn more about account abstraction](https://portal.thirdweb.com/connect/account-abstraction/how-it-works)
 *
 * @param createOptions - The options for creating the wallet.
 * Refer to [SmartWalletCreationOptions](https://portal.thirdweb.com/references/typescript/v5/SmartWalletCreationOptions) for more details.
 * @returns The created smart wallet.
 * @example
 *
 * ## Connect to a smart wallet
 *
 * To connect to a smart wallet, you need to provide an admin account as the `personalAccount` option.
 *
 * Any wallet can be used as an admin account, including an in-app wallets.
 *
 * The `sponsorGas` option is used to enable sponsored gas for transactions automatically.
 *
 * ```ts
 * import { smartWallet, inAppWallet } from "thirdweb/wallets";
 * import { sepolia } from "thirdweb/chains";
 * import { sendTransaction } from "thirdweb";
 *
 * const wallet = smartWallet({
 *  chain: sepolia,
 *  sponsorGas: true, // enable sponsored transactions
 * });
 *
 * // any wallet can be used as an admin account
 * // in this example we use an in-app wallet
 * const adminWallet = inAppWallet();
 * const personalAccount = await adminWallet.connect({
 *   client,
 *   chain: sepolia,
 *   strategy: "google",
 * });
 *
 * const smartAccount = await wallet.connect({
 *   client,
 *   personalAccount, // pass the admin account
 * });
 *
 * // sending sponsored transactions with the smartAccount
 * await sendTransaction({
 *   account: smartAccount,
 *   transaction,
 * });
 * ```
 *
 * ## Configuring the smart wallet
 *
 * You can pass options to the `smartWallet` function to configure the smart wallet.
 *
 * ```ts
 * import { smartWallet } from "thirdweb/wallets";
 * import { sepolia } from "thirdweb/chains";
 *
 * const wallet = smartWallet({
 *  chain: sepolia,
 *  sponsorGas: true, // enable sponsored transactions
 *  factoryAddress: "0x...", // custom factory address
 *  overrides: {
 *    accountAddress: "0x...", // override account address
 *    accountSalt: "0x...", // override account salt
 *    entrypointAddress: "0x...", // override entrypoint address
 *    erc20Paymaster: { ... }, // enable erc20 paymaster
 *    bundlerUrl: "https://...", // override bundler url
 *    paymaster: (userOp) => { ... }, // override paymaster
 *    ...
 *  }
 * });
 * ```
 *
 * Refer to [SmartWalletOptions](https://portal.thirdweb.com/references/typescript/v5/SmartWalletOptions) for more details.
 *
 * @wallet
 */
export function smartWallet(
  createOptions: CreateWalletArgs<"smart">[1],
): Wallet<"smart"> {
  const emitter = createWalletEmitter<"smart">();
  let account: Account | undefined = undefined;
  let chain: Chain | undefined = undefined;
  let lastConnectOptions: WalletConnectionOption<"smart"> | undefined;

  const _smartWallet: Wallet<"smart"> = {
    id: "smart",
    subscribe: emitter.subscribe,
    getChain() {
      if (!chain) {
        return undefined;
      }

      chain = getCachedChainIfExists(chain.id) || chain;
      return chain;
    },
    getConfig: () => createOptions,
    getAccount: () => account,
    autoConnect: async (options) => {
      const { connectSmartWallet } = await import("./index.js");
      const [connectedAccount, connectedChain] = await connectSmartWallet(
        _smartWallet,
        options,
        createOptions,
      );
      // set the states
      lastConnectOptions = options;
      account = connectedAccount;
      chain = connectedChain;
      trackConnect({
        client: options.client,
        walletType: "smart",
        walletAddress: account.address,
      });
      // return account
      return account;
    },
    connect: async (options) => {
      const { connectSmartWallet } = await import("./index.js");
      const [connectedAccount, connectedChain] = await connectSmartWallet(
        _smartWallet,
        options,
        createOptions,
      );
      // set the states
      lastConnectOptions = options;
      account = connectedAccount;
      chain = connectedChain;
      trackConnect({
        client: options.client,
        walletType: "smart",
        walletAddress: account.address,
      });
      // return account
      emitter.emit("accountChanged", account);
      return account;
    },
    disconnect: async () => {
      account = undefined;
      chain = undefined;
      const { disconnectSmartWallet } = await import("./index.js");
      await disconnectSmartWallet(_smartWallet);
      emitter.emit("disconnect", undefined);
    },
    switchChain: async (newChain: Chain) => {
      if (!lastConnectOptions) {
        throw new Error("Cannot switch chain without a previous connection");
      }
      // check if factory is deployed
      const factory = getContract({
        address:
          createOptions.factoryAddress ||
          getDefaultAccountFactory(createOptions.overrides?.entrypointAddress),
        chain: newChain,
        client: lastConnectOptions.client,
      });
      const isDeployed = await isContractDeployed(factory);
      if (!isDeployed) {
        throw new Error(
          `Factory contract not deployed on chain: ${newChain.id}`,
        );
      }
      const { connectSmartWallet } = await import("./index.js");
      const [connectedAccount, connectedChain] = await connectSmartWallet(
        _smartWallet,
        { ...lastConnectOptions, chain: newChain },
        createOptions,
      );
      // set the states
      account = connectedAccount;
      chain = connectedChain;
      emitter.emit("chainChanged", newChain);
    },
  };

  return _smartWallet;
}
