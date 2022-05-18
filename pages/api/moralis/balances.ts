import { constants, utils } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "invalid method" });
  }

  const { chain, address } = req.body;
  if (!utils.isAddress(address)) {
    return res.status(400).json({ error: "invalid address" });
  }

  const _chain = encodeURIComponent(chain);
  const _address = encodeURIComponent(address);

  const tokenBalanceEndpoint = `https://deep-index.moralis.io/api/v2/${_address}/erc20?chain=${_chain}`;
  const nativeBalanceEndpoint = `https://deep-index.moralis.io/api/v2/${_address}/balance?chain=${_chain}`;

  const [tokenBalances, nativeBalance] = await Promise.all([
    fetch(tokenBalanceEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.MORALIS_API_KEY || "",
      },
    }).then((tRes) => tRes.json()),
    fetch(nativeBalanceEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.MORALIS_API_KEY || "",
      },
    }).then((nRes) => nRes.json()),
  ]);

  const balances = [
    ...tokenBalances,
    {
      token_address: constants.AddressZero,
      balance: nativeBalance.balance,
    },
  ];

  return res.status(200).json(balances);
};
