import type { Address } from "abitype";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { isAddress } from "../../utils/address.js";
import { getToken } from "./get-token.js";
import type { SupportedFiatCurrency } from "./type.js";

/**
 * Props for the `convertFiatToCrypto` function
 * @buyCrypto
 */
export type ConvertFiatToCryptoParams = {
  client: ThirdwebClient;
  /**
   * The fiat symbol. e.g: "USD"
   */
  from: SupportedFiatCurrency;
  /**
   * The total amount of fiat to convert
   * e.g: If you want to convert 2 cents to USD, enter `0.02`
   */
  fromAmount: number;
  /**
   * The token address
   * For native token, use NATIVE_TOKEN_ADDRESS
   */
  to: Address;
  /**
   * The chain that the token is deployed to
   */
  chain: Chain;
};

/**
 * Convert a fiat value to a token.
 * Currently only USD is supported.
 * @example
 * ### Basic usage
 * ```ts
 * import { convertFiatToCrypto } from "thirdweb/pay";
 *
 * // Convert 2 cents to ETH
 * const result = await convertFiatToCrypto({
 *   from: "USD",
 *   // the token address. For native token, use NATIVE_TOKEN_ADDRESS
 *   to: "0x...",
 *   // the chain (of the chain where the token belong to)
 *   chain: ethereum,
 *   // 2 cents
 *   fromAmount: 0.02,
 * });
 * ```
 * Result: `{ result: 0.0000057 }`
 * @buyCrypto
 */
export async function convertFiatToCrypto(
  options: ConvertFiatToCryptoParams,
): Promise<{ result: number }> {
  const { client, to, chain, fromAmount, from } = options;
  if (Number(fromAmount) === 0) {
    return { result: 0 };
  }
  // Testnets just don't work with our current provider(s)
  if (chain.testnet === true) {
    throw new Error(`Cannot fetch price for a testnet (chainId: ${chain.id})`);
  }
  // Some provider that we are using will return `0` for unsupported token
  // so we should do some basic input validations before sending the request

  // Make sure it's a valid EVM address
  if (!isAddress(to)) {
    throw new Error("Invalid `to`. Expected a valid EVM contract address");
  }
  const token = await getToken(client, to, chain.id);
  const price = token?.prices[from] || 0;
  if (!token || price === 0) {
    throw new Error(
      `Error: Failed to fetch price for token ${to} on chainId: ${chain.id}`,
    );
  }
  return { result: fromAmount / price };
}
