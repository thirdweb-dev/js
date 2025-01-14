import { sendTransaction } from "../transaction/actions/send-transaction.js";
import type { SendTransactionResult } from "../transaction/types.js";
import type { Account } from "../wallets/interfaces/wallet.js";
import { type Input, nebulaFetch } from "./common.js";

/**
 * Execute a transaction based on a prompt.
 *
 * @param input - The input for the transaction.
 * @returns The transaction hash.
 * @beta
 * @nebula
 *
 * @example
 * ```ts
 * import { Nebula } from "thirdweb/ai";
 *
 * const result = await Nebula.execute({
 *   client: TEST_CLIENT,
 *   prompt: "send 0.0001 ETH to vitalik.eth",
 *   account: TEST_ACCOUNT_A,
 *   context: {
 *     chains: [sepolia],
 *   },
 * });
 * ```
 */
export async function execute(
  input: Input & { account: Account },
): Promise<SendTransactionResult> {
  const result = await nebulaFetch("execute", input);
  // TODO: optionally only return the transaction without executing it?
  if (result.transactions.length === 0) {
    throw new Error(result.message);
  }
  const tx = result.transactions[0];
  if (!tx) {
    throw new Error(result.message);
  }
  return sendTransaction({
    transaction: tx,
    account: input.account,
  });
}
