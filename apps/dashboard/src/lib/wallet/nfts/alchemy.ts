import "server-only";

import { download } from "thirdweb/storage";
import type { NFTMetadata } from "thirdweb/utils";
import { getUserThirdwebClient } from "../../../app/api/lib/getAuthToken";
import { handleArbitraryTokenURI, shouldDownloadURI } from "./tokenUri";
import {
  type AlchemySupportedChainId,
  type GenerateURLParams,
  type WalletNFT,
  alchemySupportedChainIdsMap,
} from "./types";

export function generateAlchemyUrl({ chainId, owner }: GenerateURLParams) {
  const url = new URL(
    `https://${
      alchemySupportedChainIdsMap[chainId as AlchemySupportedChainId]
    }.g.alchemy.com/nft/v2/${process.env.SSR_ALCHEMY_KEY}/getNFTs`,
  );
  url.searchParams.set("owner", owner);
  return url.toString();
}

export async function transformAlchemyResponseToNFT(
  alchemyResponse: AlchemyResponse,
  owner: string,
): Promise<WalletNFT[]> {
  const client = await getUserThirdwebClient();

  return (
    await Promise.all(
      alchemyResponse.ownedNfts.map(async (alchemyNFT) => {
        const rawUri = alchemyNFT.tokenUri.raw;

        try {
          return {
            id: alchemyNFT.id.tokenId,
            contractAddress: alchemyNFT.contract.address,
            metadata: shouldDownloadURI(rawUri)
              ? await download({
                  uri: handleArbitraryTokenURI(rawUri),
                  client,
                })
                  .then((res) => res.json())
                  .catch(() => ({}))
              : rawUri,
            owner,
            supply: alchemyNFT.balance || "1",
            type: alchemyNFT.id.tokenMetadata.tokenType,
            tokenURI: rawUri,
          } as WalletNFT;
        } catch {
          return undefined as unknown as WalletNFT;
        }
      }),
    )
  ).filter(Boolean);
}

type AlchemyResponse = {
  ownedNfts: Array<{
    contract: {
      address: string;
    };
    id: {
      tokenId: string;
      tokenMetadata: {
        tokenType: "ERC721" | "ERC1155";
      };
    };
    balance: string;
    title: string;
    description: string;
    tokenUri: {
      raw: string;
      gateway: string;
    };
    media: Array<{
      raw: string;
      gateway: string;
    }>;
    metadata: NFTMetadata;
    timeLastUpdated: string;
    contractMetadata: {
      name: string;
      symbol: string;
      totalSupply: string;
      tokenType: "ERC721" | "ERC1155";
    };
  }>;
  pageKey: string;
  totalCount: number;
  blockHash: string;
};
