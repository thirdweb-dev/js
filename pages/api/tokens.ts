import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "invalid method" });
  }

  const { address, chainName } = req.body;

  if (!address || !chainName) {
    return res.status(400).json({ error: "must provide network and address" });
  }

  const url = `https://deep-index.moralis.io/api/v2/${address}/erc20?chain=${chainName}`;
  const assetsResponse = await fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "X-API-Key": process.env.MORALIS_API_KEY,
    } as HeadersInit,
  });
  const assets = await assetsResponse.json();

  return res.status(assetsResponse.status).json(assets);
};
