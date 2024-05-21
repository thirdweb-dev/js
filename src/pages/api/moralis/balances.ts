import { SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import { constants, utils } from "ethers";
import { thirdwebClient } from "lib/thirdweb-client";
import { NextApiRequest, NextApiResponse } from "next";
import { defineChain } from "thirdweb";
import { getWalletBalance } from "thirdweb/wallets";

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
  if (!utils.isAddress(address)) {
    return res.status(400).json({ error: "invalid address" });
  }

  const getNativeBalance = async (): Promise<BalanceQueryResponse> => {
    const chain = defineChain(chainId);
    const balance = await getWalletBalance({
      address,
      chain,
      client: thirdwebClient,
    });
    return [
      {
        token_address: constants.AddressZero,
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
