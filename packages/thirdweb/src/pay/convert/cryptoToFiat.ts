import type { Address } from "abitype";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { isAddress } from "../../utils/address.js";
import { getToken } from "./get-token.js";
import type { SupportedFiatCurrency } from "./type.js";

/**
 * Props for the `convertCryptoToFiat` function
 * @buyCrypto
 */
export type ConvertCryptoToFiatParams = {
  client: ThirdwebClient;
  /**
   * The contract address of the token
   * For native token, use NATIVE_TOKEN_ADDRESS
   */
  fromTokenAddress: Address;
  /**
   * The amount of token to convert to fiat value
   */
  fromAmount: number;
  /**
   * The chain that the token is deployed to
   */
  chain: Chain;
  /**
   * The fiat symbol. e.g "USD"
   */
  to: SupportedFiatCurrency;
};

/**
 * Get a price of a token (using tokenAddress + chainId) in fiat.
 * Only USD is supported at the moment.
 * @example
 * ### Basic usage
 * For native token (non-ERC20), you should use NATIVE_TOKEN_ADDRESS as the value for `tokenAddress`
 * ```ts
 * import { convertCryptoToFiat } from "thirdweb/pay";
 *
 * // Get Ethereum price
 * const result = convertCryptoToFiat({
 *   fromTokenAddress: NATIVE_TOKEN_ADDRESS,
 *   to: "USD",
 *   chain: ethereum,
 *   fromAmount: 1,
 * });
 *
 * // Result: `{ result: 3404.11 }`
 * ```
 * @buyCrypto
 * @returns a number representing the price (in selected fiat) of "x" token, with "x" being the `fromAmount`.
 */
export async function convertCryptoToFiat(
  options: ConvertCryptoToFiatParams,
): Promise<{ result: number }> {
  const { client, fromTokenAddress, chain, fromAmount, to } = options;
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
  if (!isAddress(fromTokenAddress)) {
    throw new Error(
      "Invalid fromTokenAddress. Expected a valid EVM contract address",
    );
  }
  const token = await getToken(client, fromTokenAddress, chain.id);
  const price = token?.prices[to] || 0;
  if (!token || price === 0) {
    throw new Error(
      `Error: Failed to fetch price for token ${fromTokenAddress} on chainId: ${chain.id}`,
    );
  }
  return { result: price * fromAmount };
}
