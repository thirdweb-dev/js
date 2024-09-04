import type { Account } from "../../wallets/interfaces/wallet.js";
import type { PreparedTransaction } from "../prepare-transaction.js";
import { addTransactionToStore } from "../transaction-store.js";
import type { GaslessOptions } from "./gasless/types.js";
import { toSerializableTransaction } from "./to-serializable-transaction.js";
import type { WaitForReceiptOptions } from "./wait-for-tx-receipt.js";

/** Send transaction options */
export interface SendTransactionOptions {
  /**
   * The account to send the transaction with
   */
  account: Account;
  /**
   * The prepared transaction to send
   */
  // biome-ignore lint/suspicious/noExplicitAny: library function that accepts any prepared transaction type
  transaction: PreparedTransaction<any>;
  /**
   * Gasless options for the transaction, if applicable
   */
  gasless?: GaslessOptions;
}

/**
 * Sends a transaction using the provided account.
 *
 * You can send a transaction with a [prepared contract call](https://portal.thirdweb.com/references/typescript/v5/prepareContractCall), a [prepared transaction](https://portal.thirdweb.com/references/typescript/v5/prepareTransaction), or using a write [Extension](https://portal.thirdweb.com/typescript/v5/extensions/use).
 * @param options - The options for sending the transaction.
 * @returns A promise that resolves to the transaction result.
 * @throws An error if the transaction reverts.
 * @transaction
 * @example
 *
 * ### Using a prepared contract call
 *
 * ```ts
 * import { sendTransaction, getContract, prepareContractCall } from "thirdweb";
 * import { sepolia } from "thirdweb/chains";
 *
 * const contract = getContract({
 *   address: "0x...",
 *   chain: sepolia,
 *   client,
 * });
 *
 * const transaction = prepareContractCall({
 *   contract,
 *   method: "function transfer(address to, uint256 value)",
 *   params: [to, value],
 * });
 *
 * const { transactionHash } = await sendTransaction({
 *  account,
 *  transaction,
 * });
 * ```
 *
 * ### Using a write extension
 *
 * ```ts
 * import { sendTransaction, getContract } from "thirdweb";
 * import { sepolia } from "thirdweb/chains";
 * import { mintTo } from "thirdweb/extensions/erc721";
 *
 * const contract = getContract({
 *   address: "0x...",
 *   chain: sepolia,
 *   client,
 * });
 *
 * const transaction = mintTo({
 *   contract,
 *   to: "0x...",
 *   nft: {
 *     name: "NFT Name",
 *     description: "NFT Description",
 *     image: "https://example.com/image.png",
 *   },
 * });
 *
 * const { transactionHash } = await sendTransaction({
 *  account,
 *  transaction,
 * });
 * ```
 *
 * ### Using a prepared transaction
 *
 * ```ts
 * import { sendTransaction, getContract, prepareTransaction } from "thirdweb";
 * import { sepolia } from "thirdweb/chains";
 *
 * const contract = getContract({
 *   address: "0x...",
 *   chain: sepolia,
 *   client,
 * });
 *
 * const transaction = prepareTransaction({
 *   contract,
 *   to: "0x...",
 *   value: toWei("0.1"),
 * });
 *
 * const { transactionHash } = await sendTransaction({
 *  account,
 *  transaction,
 * });
 * ```
 *
 * ### Gasless usage with [thirdweb Engine](https://portal.thirdweb.com/engine)
 * ```ts
 * const { transactionHash } = await sendTransaction({
 *  account,
 *  transaction,
 *  gasless: {
 *    provider: "engine",
 *    relayerUrl: "https://thirdweb.engine-***.thirdweb.com/relayer/***",
 *    relayerForwarderAddress: "0x...",
 *  }
 * });
 * ```
 *
 * ### Gasless usage with OpenZeppelin
 * ```ts
 * const { transactionHash } = await sendTransaction({
 *  account,
 *  transaction,
 *  gasless: {
 *    provider: "openzeppelin",
 *    relayerUrl: "https://...",
 *    relayerForwarderAddress: "0x...",
 *  }
 * });
 * ```
 */
export async function sendTransaction(
  options: SendTransactionOptions,
): Promise<WaitForReceiptOptions> {
  const { account, transaction, gasless } = options;

  if (account.onTransactionRequested) {
    await account.onTransactionRequested(transaction);
  }

  // if zksync transaction params are set, send with eip712
  if (options.transaction.eip712) {
    const { sendEip712Transaction } = await import(
      "./zksync/send-eip712-transaction.js"
    );
    return sendEip712Transaction({
      account,
      transaction,
    });
  }

  const serializableTransaction = await toSerializableTransaction({
    transaction: transaction,
    from: account.address,
  });

  // branch for gasless transactions
  if (gasless) {
    // lazy load the gasless tx function because it's only needed for gasless transactions
    const { sendGaslessTransaction } = await import(
      "./gasless/send-gasless-transaction.js"
    );
    return sendGaslessTransaction({
      account,
      transaction,
      serializableTransaction,
      gasless,
    });
  }

  const result = await account.sendTransaction(serializableTransaction);
  // Store the transaction
  addTransactionToStore({
    address: account.address,
    transactionHash: result.transactionHash,
    chainId: transaction.chain.id,
  });
  return { ...result, chain: transaction.chain, client: transaction.client };
}
