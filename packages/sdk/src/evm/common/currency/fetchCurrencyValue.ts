import { CurrencyValue } from "../../types/currency";
import { BigNumber, BigNumberish, providers, utils } from "ethers";
import { fetchCurrencyMetadata } from "./fetchCurrencyMetadata";

/**
 *
 * @param providerOrSigner
 * @param asset
 * @param price
 * @returns
 * @internal
 */
export async function fetchCurrencyValue(
  providerOrSigner: providers.Provider,
  asset: string,
  price: BigNumberish,
): Promise<CurrencyValue> {
  const metadata = await fetchCurrencyMetadata(providerOrSigner, asset);
  return {
    ...metadata,
    value: BigNumber.from(price),
    displayValue: utils.formatUnits(price, metadata.decimals),
  };
}
