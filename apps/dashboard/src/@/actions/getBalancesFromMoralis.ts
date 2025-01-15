"use server";

import { getThirdwebClient } from "@/constants/thirdweb.server";
import { defineDashboardChain } from "lib/defineDashboardChain";
import { ZERO_ADDRESS, isAddress, toTokens } from "thirdweb";
import { getWalletBalance } from "thirdweb/wallets";

type BalanceQueryResponse = Array<{
  balance: string;
  decimals: number;
  name?: string;
  symbol: string;
  token_address: string;
  display_balance: string;
}>;

export async function getTokenBalancesFromMoralis(params: {
  contractAddress: string;
  chainId: number;
}): Promise<
  | { data: BalanceQueryResponse; error: undefined }
  | {
      data: undefined;
      error: string;
    }
> {
  const { contractAddress, chainId } = params;

  if (!isAddress(contractAddress)) {
    return {
      data: undefined,
      error: "invalid address",
    };
  }

  const getNativeBalance = async (): Promise<BalanceQueryResponse> => {
    // eslint-disable-next-line no-restricted-syntax
    const chain = defineDashboardChain(chainId, undefined);
    const balance = await getWalletBalance({
      address: contractAddress,
      chain,
      client: getThirdwebClient(),
    });
    return [
      {
        token_address: ZERO_ADDRESS,
        symbol: balance.symbol,
        name: "Native Token",
        decimals: balance.decimals,
        balance: balance.value.toString(),
        display_balance: toTokens(balance.value, balance.decimals),
      },
    ];
  };

  const getTokenBalances = async (): Promise<BalanceQueryResponse> => {
    const _chain = encodeURIComponent(`0x${chainId?.toString(16)}`);
    const _address = encodeURIComponent(contractAddress);
    const tokenBalanceEndpoint = `https://deep-index.moralis.io/api/v2/${_address}/erc20?chain=${_chain}`;

    const resp = await fetch(tokenBalanceEndpoint, {
      method: "GET",
      headers: {
        "x-api-key": process.env.MORALIS_API_KEY || "",
      },
    });

    if (!resp.ok) {
      resp.body?.cancel();
      return [];
    }
    const json = await resp.json();
    // biome-ignore lint/suspicious/noExplicitAny: FIXME
    return json.map((balance: any) => ({
      ...balance,
      display_balance: toTokens(BigInt(balance.balance), balance.decimals),
    }));
  };

  const [nativeBalance, tokenBalances] = await Promise.all([
    getNativeBalance(),
    getTokenBalances(),
  ]);

  return {
    error: undefined,
    data: [...nativeBalance, ...tokenBalances],
  };
}
