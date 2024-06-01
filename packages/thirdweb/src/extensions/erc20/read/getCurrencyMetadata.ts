import { isNativeTokenAddress } from "../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { name } from "../../common/read/name.js";
import { symbol } from "../../common/read/symbol.js";
import { decimals } from "../__generated__/IERC20/read/decimals.js";

export type GetCurrencyMetadataResult = {
  name: string;
  symbol: string;
  decimals: number;
};

/**
 * Retrieves the metadata of a currency.
 * @param options - The options for the transaction.
 * @returns A promise that resolves to an object containing the currency metadata.
 * @extension ERC20
 * @example
 * ```ts
 * import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
 *
 * const currencyMetadata = await getCurrencyMetadata({ contract });
 * ```
 */
export async function getCurrencyMetadata(
  options: BaseTransactionOptions,
): Promise<GetCurrencyMetadataResult> {
  // if the contract is the native token, return the native currency metadata
  if (isNativeTokenAddress(options.contract.address)) {
    return {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      // overwrite with native currency of the chain if available
      ...options.contract.chain.nativeCurrency,
    };
  }

  try {
    const [name_, symbol_, decimals_] = await Promise.all([
      name(options).catch(() => ""),
      symbol(options),
      decimals(options),
    ]);

    return {
      name: name_,
      symbol: symbol_,
      decimals: decimals_,
    };
  } catch (e) {
    throw new Error("Invalid currency token");
  }
}
