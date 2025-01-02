import { getThirdwebClient } from "@/constants/thirdweb.server";
import { defineDashboardChain } from "lib/defineDashboardChain";
import type { NextApiRequest, NextApiResponse } from "next";
import { ZERO_ADDRESS, isAddress, toTokens } from "thirdweb";
import { getWalletBalance } from "thirdweb/wallets";

export type BalanceQueryRequest = {
  chainId: number;
  address: string;
};

export type BalanceQueryResponse = Array<{
  balance: string;
  decimals: number;
  name?: string;
  symbol: string;
  token_address: string;
  display_balance: string;
}>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "invalid method" });
  }

  const { chainId, address } = req.body;
  if (!isAddress(address)) {
    return res.status(400).json({ error: "invalid address" });
  }

  const getNativeBalance = async (): Promise<BalanceQueryResponse> => {
    // eslint-disable-next-line no-restricted-syntax
    const chain = defineDashboardChain(chainId, undefined);
    const balance = await getWalletBalance({
      address,
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
    const _address = encodeURIComponent(address);
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

  return res.status(200).json([...nativeBalance, ...tokenBalances]);
};

export default handler;
