import { z } from "zod";
import { isNativeTokenAddress } from "../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { name } from "../../common/read/name.js";
import { symbol } from "../../common/read/symbol.js";
import { decimals } from "../__generated__/IERC20/read/decimals.js";

const NATIVE_CURRENCY_SCHEMA = z
  .object({
    name: z.string().default("Ether"),
    symbol: z.string().default("ETH"),
    decimals: z.number().default(18),
  })
  .default({
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  });

/**
 * @extension ERC20
 */
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
    // if the chain definition does not have a native currency, attempt to fetch it from the API
    if (
      !options.contract.chain.nativeCurrency ||
      !options.contract.chain.nativeCurrency.name ||
      !options.contract.chain.nativeCurrency.symbol ||
      !options.contract.chain.nativeCurrency.decimals
    ) {
      try {
        const { getChainMetadata } = await import("../../../chains/utils.js");
        const chain = await getChainMetadata(options.contract.chain);
        // return the native currency of the chain
        return NATIVE_CURRENCY_SCHEMA.parse({
          ...chain.nativeCurrency,
          ...options.contract.chain.nativeCurrency,
        });
      } catch {
        // no-op, fall through to the default values below
      }
    }

    return NATIVE_CURRENCY_SCHEMA.parse(options.contract.chain.nativeCurrency);
  }

  try {
    const [name_, symbol_, decimals_] = await Promise.all([
      name(options).catch(() => ""),
      symbol(options),
      decimals(options),
    ]);

    return {
      decimals: decimals_,
      name: name_,
      symbol: symbol_,
    };
  } catch (e) {
    throw new Error(`Invalid currency token: ${e}`);
  }
}
