import { trackConnect } from "../../analytics/track.js";
import type { Chain } from "../../chains/types.js";
import { getContract } from "../../contract/contract.js";
import { isContractDeployed } from "../../utils/bytecode/is-contract-deployed.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { createWalletEmitter } from "../wallet-emitter.js";
import type {
  CreateWalletArgs,
  WalletConnectionOption,
} from "../wallet-types.js";
import { DEFAULT_ACCOUNT_FACTORY } from "./lib/constants.js";

/**
 * Creates a smart wallet.
 * @param createOptions - The options for creating the wallet.
 * @returns The created smart wallet.
 * @example
 * ```ts
 * import { smartWallet } from "thirdweb/wallets";
 *
 * const wallet = smartWallet({
 *  chain: sepolia,
 *  gasless: true,
 * });
 *
 * const account = await wallet.connect({
 *   client,
 *   personalAccount: account,
 * });
 * ```
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
    getChain: () => chain,
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
        address: createOptions.factoryAddress || DEFAULT_ACCOUNT_FACTORY,
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
