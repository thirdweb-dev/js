import {
  generateAlchemyUrl,
  isAlchemySupported,
  transformAlchemyResponseToNFT,
} from "lib/wallet/nfts/alchemy";
import {
  generateMoralisURL,
  isMoralisSupported,
  transformMoralisResponseToNFT,
} from "lib/wallet/nfts/moralis";
import { WalletNFT } from "lib/wallet/nfts/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getSingleQueryValue } from "utils/router";

export type WalletNFTApiReturn =
  | { result: WalletNFT[]; error?: never }
  | { result?: never; error: string };

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<WalletNFTApiReturn>,
) => {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "invalid method" });
  }
  const queryChainId = getSingleQueryValue(req.query, "chainId");
  const owner = getSingleQueryValue(req.query, "owner");
  if (!queryChainId) {
    return res.status(400).json({ error: "missing chainId" });
  }
  if (!owner) {
    return res.status(400).json({ error: "missing owner" });
  }
  const chainId = parseInt(queryChainId);

  // first try to use alchemy

  if (isAlchemySupported(chainId)) {
    const url = generateAlchemyUrl(chainId, owner);

    const response = await fetch(url);
    if (response.status >= 400) {
      return res.status(response.status).json({ error: response.statusText });
    }
    try {
      const parsedResponse = await response.json();
      const result = await transformAlchemyResponseToNFT(parsedResponse, owner);

      res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59",
      );
      return res.status(200).json({ result });
    } catch (err) {
      console.error("Error fetching NFTs", err);
      return res.status(500).json({ error: "error parsing response" });
    }
  }

  if (isMoralisSupported(chainId) && process.env.MORALIS_API_KEY) {
    const url = generateMoralisURL(chainId, owner);

    const options = {
      method: "GET",
      headers: {
        "X-API-Key": process.env.MORALIS_API_KEY,
      },
    };
    const response = await fetch(url, options);

    if (response.status >= 400) {
      return res.status(response.status).json({ error: response.statusText });
    }

    try {
      const parsedResponse = await response.json();
      const result = await transformMoralisResponseToNFT(
        await parsedResponse,
        owner,
      );

      res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59",
      );
      return res.status(200).json({ result });
    } catch (err) {
      console.error("Error fetching NFTs", err);
      return res.status(500).json({ error: "error parsing response" });
    }
  }

  return res.status(400).json({ error: "unsuppored chain" });
};

export default handler;
