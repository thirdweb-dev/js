import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { toTokens } from "../../../utils/units.js";
import { balanceOf } from "../__generated__/IERC20/read/balanceOf.js";
import { getCurrencyMetadata } from "./getCurrencyMetadata.js";
/**
 * Represents the parameters for retrieving the balance of an address.
 * @extension ERC20
 */
export type GetBalanceParams = {
  /**
   * The address for which to retrieve the balance.
   */
  address: string;
};

/**
 * Represents the result of a balance query for an ERC20 token.
 * @extension ERC20
 */
export type GetBalanceResult = {
  value: bigint;
  decimals: number;
  displayValue: string;
  symbol: string;
  name: string;
  tokenAddress: string;
  chainId: number;
};

/**
 * Retrieves the balance of an ERC20 token for a specific address.
 * @param options - The transaction options including the address.
 * @returns An object containing the balance value, display value, and symbol.
 * @extension ERC20
 * @example
 * ```ts
 * import { getBalance } from "thirdweb/extensions/erc20";
 *
 * const balance = await getBalance({ contract, address: "0x..." });
 * ```
 */
export async function getBalance(
  options: BaseTransactionOptions<GetBalanceParams>,
): Promise<GetBalanceResult> {
  const [balanceWei, currencyMetadata] = await Promise.all([
    balanceOf(options),
    getCurrencyMetadata(options),
  ]);
  return {
    ...currencyMetadata,
    chainId: options.contract.chain.id,
    displayValue: toTokens(balanceWei, currencyMetadata.decimals),
    tokenAddress: options.contract.address,
    value: balanceWei,
  };
}
