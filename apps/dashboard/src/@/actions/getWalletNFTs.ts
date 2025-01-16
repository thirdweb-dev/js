"use server";

import {
  generateAlchemyUrl,
  isAlchemySupported,
  transformAlchemyResponseToNFT,
} from "lib/wallet/nfts/alchemy";
import {
  generateMoralisUrl,
  isMoralisSupported,
  transformMoralisResponseToNFT,
} from "lib/wallet/nfts/moralis";
import {
  generateSimpleHashUrl,
  isSimpleHashSupported,
  transformSimpleHashResponseToNFT,
} from "lib/wallet/nfts/simpleHash";
import type { WalletNFT } from "lib/wallet/nfts/types";

type WalletNFTApiReturn =
  | { result: WalletNFT[]; error?: undefined }
  | { result?: undefined; error: string };

export async function getWalletNFTs(params: {
  chainId: number;
  owner: string;
}): Promise<WalletNFTApiReturn> {
  const { chainId, owner } = params;
  const supportedChainSlug = await isSimpleHashSupported(chainId);

  if (supportedChainSlug && process.env.SIMPLEHASH_API_KEY) {
    const url = generateSimpleHashUrl({ chainSlug: supportedChainSlug, owner });

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.SIMPLEHASH_API_KEY,
      },
      next: {
        revalidate: 10, // cache for 10 seconds
      },
    });

    if (response.status >= 400) {
      return {
        error: response.statusText,
      };
    }

    try {
      const parsedResponse = await response.json();
      const result = await transformSimpleHashResponseToNFT(
        parsedResponse,
        owner,
      );

      return { result };
    } catch {
      return { error: "error parsing response" };
    }
  }

  if (isAlchemySupported(chainId)) {
    const url = generateAlchemyUrl({ chainId, owner });

    const response = await fetch(url, {
      next: {
        revalidate: 10, // cache for 10 seconds
      },
    });
    if (response.status >= 400) {
      return { error: response.statusText };
    }
    try {
      const parsedResponse = await response.json();
      const result = await transformAlchemyResponseToNFT(parsedResponse, owner);

      return { result, error: undefined };
    } catch (err) {
      console.error("Error fetching NFTs", err);
      return { error: "error parsing response" };
    }
  }

  if (isMoralisSupported(chainId) && process.env.MORALIS_API_KEY) {
    const url = generateMoralisUrl({ chainId, owner });

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": process.env.MORALIS_API_KEY,
      },
      next: {
        revalidate: 10, // cache for 10 seconds
      },
    });

    if (response.status >= 400) {
      return { error: response.statusText };
    }

    try {
      const parsedResponse = await response.json();
      const result = await transformMoralisResponseToNFT(
        await parsedResponse,
        owner,
      );

      return { result };
    } catch (err) {
      console.error("Error fetching NFTs", err);
      return { error: "error parsing response" };
    }
  }

  return { error: "unsupported chain" };
}
