"use server";

import { NEXT_PUBLIC_DASHBOARD_CLIENT_ID } from "@/constants/public-envs";
import { MORALIS_API_KEY } from "@/constants/server-envs";
import {
  generateAlchemyUrl,
  transformAlchemyResponseToNFT,
} from "@/lib/wallet/nfts/alchemy";
import {
  generateMoralisUrl,
  transformMoralisResponseToNFT,
} from "@/lib/wallet/nfts/moralis";
import type { WalletNFT } from "@/lib/wallet/nfts/types";
import { getVercelEnv } from "@/utils/vercel";
import { isAlchemySupported } from "../lib/wallet/nfts/isAlchemySupported";
import { isMoralisSupported } from "../lib/wallet/nfts/isMoralisSupported";

type WalletNFTApiReturn =
  | { result: WalletNFT[]; error?: undefined }
  | { result?: undefined; error: string };

export async function getWalletNFTs(params: {
  chainId: number;
  owner: string;
  isInsightSupported: boolean;
}): Promise<WalletNFTApiReturn> {
  const { chainId, owner } = params;

  if (params.isInsightSupported) {
    const response = await getWalletNFTsFromInsight({ chainId, owner });

    if (!response.ok) {
      return {
        error: response.error,
      };
    }

    return { result: response.data };
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

      return { error: undefined, result };
    } catch (err) {
      console.error("Error fetching NFTs", err);
      return { error: "error parsing response" };
    }
  }

  if (isMoralisSupported(chainId) && MORALIS_API_KEY) {
    const url = generateMoralisUrl({ chainId, owner });

    const response = await fetch(url, {
      headers: {
        "X-API-Key": MORALIS_API_KEY,
      },
      method: "GET",
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
        chainId,
      );

      return { result };
    } catch (err) {
      console.error("Error fetching NFTs", err);
      return { error: "error parsing response" };
    }
  }

  return { error: "unsupported chain" };
}

type OwnedNFTInsightResponse = {
  name: string;
  description: string;
  image_url?: string;
  background_color: string;
  external_url: string;
  metadata_url: string;
  extra_metadata: {
    customImage?: string;
    customAnimationUrl?: string;
    animation_original_url?: string;
    image_original_url?: string;
  };
  collection: {
    name: string;
    description: string;
    extra_metadata: Record<string, string>;
  };
  contract: {
    chain_id: number;
    address: string;
    type: "erc1155" | "erc721";
    name: string;
  };
  owner_addresses: string[];
  token_id: string;
  balance: string;
  token_type: "erc1155" | "erc721";
};

async function getWalletNFTsFromInsight(params: {
  chainId: number;
  owner: string;
}): Promise<
  | {
      data: WalletNFT[];
      ok: true;
    }
  | {
      ok: false;
      error: string;
    }
> {
  const { chainId, owner } = params;

  const thirdwebDomain =
    getVercelEnv() === "production" ? "thirdweb" : "thirdweb-dev";
  const url = new URL(`https://insight.${thirdwebDomain}.com/v1/nfts`);
  url.searchParams.append("chain", chainId.toString());
  url.searchParams.append("limit", "10");
  url.searchParams.append("owner_address", owner);

  const response = await fetch(url, {
    headers: {
      "x-client-id": NEXT_PUBLIC_DASHBOARD_CLIENT_ID,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    return {
      error: errorMessage,
      ok: false,
    };
  }

  const nftsResponse = (await response.json()) as {
    data: OwnedNFTInsightResponse[];
  };

  const isDev = getVercelEnv() !== "production";

  // NOTE: ipfscdn.io/ to thirdwebstorage-dev.com/ replacement is temporary
  // This should be fixed in the insight dev endpoint

  const walletNFTs = nftsResponse.data.map((nft) => {
    const walletNFT: WalletNFT = {
      chainId: nft.contract.chain_id,
      contractAddress: nft.contract.address,
      id: nft.token_id,
      metadata: {
        animation_url: isDev
          ? nft.extra_metadata.animation_original_url?.replace(
              "ipfscdn.io/",
              "thirdwebstorage-dev.com/",
            )
          : nft.extra_metadata.animation_original_url,
        background_color: nft.background_color,
        description: nft.description,
        external_url: nft.external_url,
        image: isDev
          ? nft.image_url?.replace("ipfscdn.io/", "thirdwebstorage-dev.com/")
          : nft.image_url,
        name: nft.name,
        uri: isDev
          ? nft.metadata_url.replace("ipfscdn.io/", "thirdwebstorage-dev.com/")
          : nft.metadata_url,
      },
      owner: params.owner,
      supply: nft.balance,
      tokenAddress: nft.contract.address,
      tokenURI: nft.metadata_url,
      type: nft.token_type === "erc721" ? "ERC721" : "ERC1155",
    };

    return walletNFT;
  });

  return {
    data: walletNFTs,
    ok: true,
  };
}
