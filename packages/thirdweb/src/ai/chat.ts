import { type Input, nebulaFetch, type Output } from "./common.js";

/**
 * Chat with Nebula.
 *
 * @param input - The input for the chat.
 * @returns The chat response.
 * @beta This API is in early access and might change in the future.
 * @nebula
 *
 * @example
 * ```ts
 * import { Nebula } from "thirdweb/ai";
 *
 * const response = await Nebula.chat({
 *   client: TEST_CLIENT,
 *   message: "What's the symbol of this contract: 0xe2cb0eb5147b42095c2FfA6F7ec953bb0bE347D8",
 *   contextFilter: {
 *     chains: [sepolia],
 *   },
 * });
 * ```
 *
 * Multi message prompt:
 *
 * ```ts
 * const response = await Nebula.chat({
 *   client,
 *   messages: [
 *     { role: "user", content: "What's my balance?" },
 *     { role: "assistant", content: "Your balance is 0.023 ETH" },
 *     { role: "user", content: "What about my NFTs?" },
 *   ],
 *   contextFilter: {
 *     chains: [sepolia],
 *   },
 * });
 * ```
 *
 * Extracting and sending transactions from a chat response:
 *
 * ```ts
 * const response = await Nebula.chat({ ... });
 * const transactions = response.transactions;
 * for (const transaction of transactions) {
 *   await sendTransaction({ transaction, account });
 * }
 * ```
 */
export async function chat(input: Input): Promise<Output> {
  return nebulaFetch("chat", input);
}
