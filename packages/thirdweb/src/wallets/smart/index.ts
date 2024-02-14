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
      throw new Error("Method not implemented.");
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
    address: options.factoryAddress || "0x123", // FIXME universal factory address,
    chain: options.chain,
  });
  const accountAddress = await predictAddress(factoryContract, options);
  const accountContract = getContract({
    client: options.client,
    address: accountAddress,
    chain: options.chain,
  });
  return {
    wallet,
    address: accountAddress,
    async sendTransaction(tx: SendTransactionOption) {
      console.log(tx);
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
      // TODO break down the process so estimate gas does the userOp estimation without doing double work
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

// TODO ppl should be able to override this
async function predictAddress(
  factoryContract: ThirdwebContract,
  options: SmartWalletOptions,
): Promise<string> {
  const accountAddress =
    options.accountAddress || options.personalAccount.address;
  const extraData = toHex(options.accountExtradata || "");
  return readContract({
    contract: factoryContract,
    method: "function getAddress(address, bytes) returns (address)",
    params: [accountAddress, extraData],
  });
}
