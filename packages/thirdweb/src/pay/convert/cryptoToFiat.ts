import type { Address } from "abitype";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import { getBytecode } from "../../contract/actions/get-bytecode.js";
import { getContract } from "../../contract/contract.js";
import { isAddress } from "../../utils/address.js";
import { getClientFetch } from "../../utils/fetch.js";
import { getPayConvertCryptoToFiatEndpoint } from "../utils/definitions.js";
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
   * Only USD is supported at the moment.
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
  const { client, fromTokenAddress, to, chain, fromAmount } = options;
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
  // Make sure it's either a valid contract or a native token address
  if (fromTokenAddress.toLowerCase() !== NATIVE_TOKEN_ADDRESS.toLowerCase()) {
    const bytecode = await getBytecode(
      getContract({
        address: fromTokenAddress,
        chain,
        client,
      }),
    ).catch(() => undefined);
    if (!bytecode || bytecode === "0x") {
      throw new Error(
        `Error: ${fromTokenAddress} on chainId: ${chain.id} is not a valid contract address.`,
      );
    }
  }
  const params = {
    fromTokenAddress,
    to,
    chainId: String(chain.id),
    fromAmount: String(fromAmount),
  };
  const queryString = new URLSearchParams(params).toString();
  const url = `${getPayConvertCryptoToFiatEndpoint()}?${queryString}`;
  const response = await getClientFetch(client)(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${to} value for token (${fromTokenAddress}) on chainId: ${chain.id}`,
    );
  }

  const data: { result: number } = await response.json();
  return data;
}
