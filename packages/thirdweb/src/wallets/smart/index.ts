import type {
  Account,
  SendTransactionOption,
  Wallet,
} from "../interfaces/wallet.js";
import type { SmartWalletOptions } from "./types.js";
import { createUnsignedUserOp, signUserOp } from "./lib/userop.js";
import { bundleUserOp } from "./lib/bundler.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import { toHex } from "viem";
import { readContract } from "../../transaction/read-contract.js";

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
  const wallet = {
    metadata: {
      name: "SmartWallet",
      id: "smart-wallet",
      iconUrl: "",
    },
    async connect(): Promise<Account> {
      return smartAccount(wallet, options);
    },
    async autoConnect(): Promise<Account> {
      // TODO autoconnect personal account too
      return smartAccount(wallet, options);
    },
    async disconnect(): Promise<void> {
      // TODO
    },
  };
  return wallet;
}

async function smartAccount(
  wallet: Wallet,
  options: SmartWalletOptions,
): Promise<Account> {
  const factoryContract = getContract({
    client: options.client,
    address: options.factoryAddress,
    chain: options.chain,
  });
  const accountAddress = options.predictAddressOverride
    ? await options.predictAddressOverride()
    : await predictAddress(factoryContract, options);
  const accountContract = getContract({
    client: options.client,
    address: accountAddress,
    chain: options.chain,
  });
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
