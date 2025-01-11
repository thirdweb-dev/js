import type { Address } from "abitype";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import { getBytecode } from "../../contract/actions/get-bytecode.js";
import { getContract } from "../../contract/contract.js";
import { isAddress } from "../../utils/address.js";
import { getClientFetch } from "../../utils/fetch.js";
import { getPayConvertFiatToCryptoEndpoint } from "../utils/definitions.js";
import type { SupportedFiatCurrency } from "./type.js";

/**
 * Props for the `convertFiatToCrypto` function
 * @buyCrypto
 */
export type ConvertFiatToCryptoParams = {
  client: ThirdwebClient;
  /**
   * The fiat symbol. e.g: "USD"
   * Currently only USD is supported.
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
  const { client, from, to, chain, fromAmount } = options;
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
  // Make sure it's either a valid contract or a native token
  if (to.toLowerCase() !== NATIVE_TOKEN_ADDRESS.toLowerCase()) {
    const bytecode = await getBytecode(
      getContract({
        address: to,
        chain,
        client,
      }),
    ).catch(() => undefined);
    if (!bytecode || bytecode === "0x") {
      throw new Error(
        `Error: ${to} on chainId: ${chain.id} is not a valid contract address.`,
      );
    }
  }
  const params = {
    from,
    to,
    chainId: String(chain.id),
    fromAmount: String(fromAmount),
  };
  const queryString = new URLSearchParams(params).toString();
  const url = `${getPayConvertFiatToCryptoEndpoint()}?${queryString}`;
  const response = await getClientFetch(client)(url);
  if (!response.ok) {
    throw new Error(
      `Failed to convert ${from} value to token (${to}) on chainId: ${chain.id}`,
    );
  }

  const data: { result: number } = await response.json();
  return data;
}
