import { sendTransaction } from "../transaction/actions/send-transaction.js";
import type { SendTransactionResult } from "../transaction/types.js";
import type { Account } from "../wallets/interfaces/wallet.js";
import { type Input, nebulaFetch } from "./common.js";

/**
 * Execute a transaction based on a prompt.
 *
 * @param input - The input for the transaction.
 * @returns The transaction hash.
 * @beta This API is in early access and might change in the future.
 * @nebula
 *
 * @example
 * ```ts
 * import { Nebula } from "thirdweb/ai";
 *
 * const wallet = createWallet("io.metamask");
 * const account = wallet.connect({ client });
 *
 * const result = await Nebula.execute({
 *   client,
 *   account, // transactions will be sent from this account
 *   message: "send 0.0001 ETH to vitalik.eth",
 *   contextFilter: {
 *     chains: [sepolia],
 *   },
 * });
 * ```
 *
 * Multi message prompt:
 *
 * ```ts
 * Nebula.execute({
 *  client,
 *  account,
 *  messages: [
 *    { role: "user", content: "What's the address of vitalik.eth" },
 *    {
 *      role: "assistant",
 *      content:
 *        "The address of vitalik.eth is 0xd8dA6BF26964aF8E437eEa5e3616511D7G3a3298",
 *    },
 *    { role: "user", content: "Send them 0.0001 ETH" },
 *  ],
 *  contextFilter: {
 *    chains: [sepolia],
 *  },
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
    account: input.account,
    transaction: tx,
  });
}
