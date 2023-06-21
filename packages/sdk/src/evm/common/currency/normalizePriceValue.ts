import { AmountSchema } from "../../../core/schema/shared";
import { Price } from "../../types/currency";
import { providers, utils } from "ethers";
import { fetchCurrencyMetadata } from "./fetchCurrencyMetadata";

/**
 *
 * @param provider
 * @param inputPrice
 * @param currencyAddress
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
