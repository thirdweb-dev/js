"use server";
import { defineDashboardChain } from "lib/defineDashboardChain";
import { isAddress, toTokens, ZERO_ADDRESS } from "thirdweb";
import { getWalletBalance } from "thirdweb/wallets";
import { MORALIS_API_KEY } from "../constants/server-envs";
import { serverThirdwebClient } from "../constants/thirdweb-client.server";

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
      client: serverThirdwebClient,
    });
    return [
      {
        balance: balance.value.toString(),
        decimals: balance.decimals,
        display_balance: toTokens(balance.value, balance.decimals),
        name: "Native Token",
        symbol: balance.symbol,
        token_address: ZERO_ADDRESS,
      },
    ];
  };

  const getTokenBalances = async (): Promise<BalanceQueryResponse> => {
    const _chain = encodeURIComponent(`0x${chainId?.toString(16)}`);
    const _address = encodeURIComponent(contractAddress);
    const tokenBalanceEndpoint = `https://deep-index.moralis.io/api/v2/${_address}/erc20?chain=${_chain}`;

    const resp = await fetch(tokenBalanceEndpoint, {
      headers: {
        "x-api-key": MORALIS_API_KEY,
      },
      method: "GET",
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
    data: [...nativeBalance, ...tokenBalances],
    error: undefined,
  };
}
