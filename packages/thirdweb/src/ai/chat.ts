import { type Input, type Output, nebulaFetch } from "./common.js";

/**
 * Chat with Nebula.
 *
 * @param input - The input for the chat.
 * @returns The chat response.
 * @beta
 * @nebula
 *
 * @example
 * ```ts
 * import { Nebula } from "thirdweb/ai";
 *
 * const response = await Nebula.chat({
 *   client: TEST_CLIENT,
 *   prompt: "What's the symbol of this contract: 0xe2cb0eb5147b42095c2FfA6F7ec953bb0bE347D8",
 *   context: {
 *     chains: [sepolia],
 *   },
 * });
 * ```
 */
export async function chat(input: Input): Promise<Output> {
  return nebulaFetch("chat", input);
}
