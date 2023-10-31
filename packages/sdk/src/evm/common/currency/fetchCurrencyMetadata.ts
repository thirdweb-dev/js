import { getNativeTokenByChainId } from "../../constants/currency";
import { Currency } from "../../types/currency";
import type { IERC20Metadata } from "@thirdweb-dev/contracts-js";
import { Contract, providers } from "ethers";
import { isNativeToken } from "./isNativeToken";

/**
 *
 * @param provider
 * @param asset
 * @returns
 * @internal
 */
export async function fetchCurrencyMetadata(
  provider: providers.Provider,
  asset: string,
): Promise<Currency> {
  if (isNativeToken(asset)) {
    const network = await provider.getNetwork();
    const nativeToken = getNativeTokenByChainId(network.chainId);
    return {
      name: nativeToken.name,
      symbol: nativeToken.symbol,
      decimals: nativeToken.decimals,
    };
  } else {
    const ERC20MetadataAbi = (
      await import("@thirdweb-dev/contracts-js/dist/abis/IERC20Metadata.json")
    ).default;
    const erc20 = new Contract(
      asset,
      ERC20MetadataAbi,
      provider,
    ) as IERC20Metadata;
    const [name, symbol, decimals] = await Promise.all([
      erc20.name(),
      erc20.symbol(),
      erc20.decimals(),
    ]);
    return {
      name,
      symbol,
      decimals,
    };
  }
}
