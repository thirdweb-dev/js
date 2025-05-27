import { type ThirdwebClient, getContract } from "thirdweb";
import { NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { getAddress } from "thirdweb";
import type { Chain, ChainMetadata } from "thirdweb/chains";
import { symbol } from "thirdweb/extensions/common";
import { decimals } from "thirdweb/extensions/erc20";

export async function getCurrencyMeta(params: {
  currencyAddress: string;
  chainMetadata: ChainMetadata;
  chain: Chain;
  client: ThirdwebClient;
}): Promise<{
  decimals: number;
  symbol: string;
}> {
  // if native token
  if (getAddress(params.currencyAddress) === getAddress(NATIVE_TOKEN_ADDRESS)) {
    return {
      decimals: params.chainMetadata.nativeCurrency.decimals,
      symbol: params.chainMetadata.nativeCurrency.symbol,
    };
  }

  const currencyTokenContract = getContract({
    address: params.currencyAddress,
    chain: params.chain,
    client: params.client,
  });

  const [currencyDecimals, currencySymbol] = await Promise.all([
    decimals({
      contract: currencyTokenContract,
    }),
    symbol({
      contract: currencyTokenContract,
    }),
  ]);

  return {
    decimals: currencyDecimals,
    symbol: currencySymbol,
  };
}
