import { CurrencyValue } from "../../types/currency";
import { BigNumber, BigNumberish, providers, utils } from "ethers";
import { fetchCurrencyMetadata } from "./fetchCurrencyMetadata";

/**
 *
 * @param providerOrSigner - The provider or signer to use
 * @param asset - The asset to fetch the value for
 * @param price - The price to fetch the value for
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
