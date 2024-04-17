import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { isNativeTokenAddress } from "../../constants/addresses.js";
import { toTokens } from "../units.js";

export type CurrencyValue = {
  name: string;
  decimals: number;
  symbol: string;
  displayValue: string;
  value: bigint;
};

export async function resolveCurrencyValue(options: {
  client: ThirdwebClient;
  chain: Chain;
  currencyAddress: string;
  wei: bigint;
}): Promise<CurrencyValue> {
  if (isNativeTokenAddress(options.currencyAddress)) {
    const [name, decimals, symbol] = await Promise.all([
      options.chain.nativeCurrency?.name ??
        import("../../chains/utils.js").then(({ getChainNativeCurrencyName }) =>
          getChainNativeCurrencyName(options.chain),
        ),
      options.chain.nativeCurrency?.decimals ??
        import("../../chains/utils.js").then(({ getChainDecimals }) =>
          getChainDecimals(options.chain),
        ),
      options.chain.nativeCurrency?.symbol ??
        import("../../chains/utils.js").then(({ getChainSymbol }) =>
          getChainSymbol(options.chain),
        ),
    ]);

    return {
      name,
      decimals,
      symbol,
      displayValue: toTokens(options.wei, decimals),
      value: options.wei,
    };
  }

  // else it's a erc20
  const [{ getContract }, { getCurrencyMetadata }] = await Promise.all([
    import("../../contract/contract.js"),
    import("../../extensions/erc20/read/getCurrencyMetadata.js"),
  ]);

  const contract = getContract({
    address: options.currencyAddress,
    chain: options.chain,
    client: options.client,
  });

  const metadata = await getCurrencyMetadata({ contract });

  return {
    name: metadata.name,
    decimals: metadata.decimals,
    symbol: metadata.symbol,
    displayValue: toTokens(options.wei, metadata.decimals),
    value: options.wei,
  };
}
