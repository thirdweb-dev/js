import { SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import { CURRENCIES } from "constants/currencies";
import { constants, utils } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

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

  const _chain = encodeURIComponent(`0x${chainId?.toString(16)}`);
  const _address = encodeURIComponent(address);

  const tokenBalanceEndpoint = `https://deep-index.moralis.io/api/v2/${_address}/erc20?chain=${_chain}`;
  const nativeBalanceEndpoint = `https://deep-index.moralis.io/api/v2/${_address}/balance?chain=${_chain}`;

  const [nativeBalance, tokenBalances] = await Promise.all([
    fetch(nativeBalanceEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.MORALIS_API_KEY || "",
      },
    }).then((nRes) => nRes.json()),
    fetch(tokenBalanceEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.MORALIS_API_KEY || "",
      },
    }).then((tRes) => tRes.json()),
  ]);

  const native = CURRENCIES[chainId]?.find(
    (c) => c.address === constants.AddressZero,
  );

  if (tokenBalances?.message) {
    return res.status(400).json({ error: tokenBalances.message });
  }

  if (nativeBalance?.message) {
    return res.status(400).json({ error: nativeBalance.message });
  }

  const balances = [
    ...(tokenBalances || []),
    {
      token_address: native?.address,
      symbol: native?.symbol,
      name: "Native Token",
      decimals: 18,
      balance: nativeBalance.balance,
    },
  ].map((balance) => ({
    ...balance,
    display_balance: utils
      .formatUnits(balance.balance, balance.decimals)
      .toString(),
  }));

  return res.status(200).json(balances);
};

export default handler;
