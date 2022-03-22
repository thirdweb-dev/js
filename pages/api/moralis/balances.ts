import { AddressZero } from "@ethersproject/constants";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "invalid method" });
  }

  const { chain, address } = req.body;
  const tokenBalanceEndpoint = `https://deep-index.moralis.io/api/v2/${address}/erc20?chain=${chain}`;
  const nativeBalanceEndpoint = `https://deep-index.moralis.io/api/v2/${address}/balance?chain=${chain}`;

  const tokenBalance = await fetch(tokenBalanceEndpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.MORALIS_API_KEY || "",
    },
  });

  const tokenBalances = await tokenBalance.json();

  const nativeBalance = await fetch(nativeBalanceEndpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.MORALIS_API_KEY || "",
    },
  });

  const { balance } = await nativeBalance.json();
  const balances = [
    ...tokenBalances,
    {
      token_address: AddressZero,
      balance,
    },
  ];

  return res.status(200).json(balances);
};
