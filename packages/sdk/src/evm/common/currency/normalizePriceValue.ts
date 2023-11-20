import { AmountSchema } from "../../../core/schema/shared";
import { Price } from "../../types/currency";
import { providers, utils } from "ethers";
import { fetchCurrencyMetadata } from "./fetchCurrencyMetadata";

/**
 *
 * @param provider - The provider to use
 * @param inputPrice - The input price to normalize
 * @param currencyAddress - The currency address to normalize the price for
 * @returns
 * @internal
 */
export async function normalizePriceValue(
  provider: providers.Provider,
  inputPrice: Price,
  currencyAddress: string,
) {
  const metadata = await fetchCurrencyMetadata(provider, currencyAddress);
  return utils.parseUnits(AmountSchema.parse(inputPrice), metadata.decimals);
}
