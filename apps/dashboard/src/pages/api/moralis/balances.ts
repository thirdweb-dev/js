import type { SUPPORTED_CHAIN_ID } from "constants/chains";
import { utils } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { ZERO_ADDRESS, createThirdwebClient, isAddress } from "thirdweb";
import { getWalletBalance } from "thirdweb/wallets";
import { DASHBOARD_THIRDWEB_SECRET_KEY } from "../../../constants/rpc";
import { IPFS_GATEWAY_URL } from "../../../lib/sdk";
import { defineDashboardChain } from "../../../lib/v5-adapter";

export type BalanceQueryRequest = {
  chainId: SUPPORTED_CHAIN_ID;
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
    const chain = defineDashboardChain(chainId);
    const balance = await getWalletBalance({
      address,
      chain,
      client: createThirdwebClient({
        secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
        config: {
          storage: {
            gatewayUrl: IPFS_GATEWAY_URL,
          },
        },
      }),
    });
    return [
      {
        token_address: ZERO_ADDRESS,
        symbol: balance.symbol,
        name: "Native Token",
        decimals: balance.decimals,
        balance: balance.value.toString(),
        display_balance: balance.displayValue,
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
      display_balance: utils
        .formatUnits(balance.balance, balance.decimals)
        .toString(),
    }));
  };

  const [nativeBalance, tokenBalances] = await Promise.all([
    getNativeBalance(),
    getTokenBalances(),
  ]);

  return res.status(200).json([...nativeBalance, ...tokenBalances]);
};

export default handler;
