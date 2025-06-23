import "server-only";

import { download } from "thirdweb/storage";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { handleArbitraryTokenURI, shouldDownloadURI } from "./tokenUri";
import type { GenerateURLParams, WalletNFT } from "./types";

export function generateMoralisUrl({ chainId, owner }: GenerateURLParams) {
  const url = new URL(`https://deep-index.moralis.io/api/v2/${owner}/nft`);

  url.searchParams.append("chain", `0x${chainId.toString(16)}`);
  url.searchParams.append("format", "hex");

  return url.toString();
}

export async function transformMoralisResponseToNFT(
  moralisResponse: MoralisResponse,
  owner: string,
  chainId: number,
): Promise<WalletNFT[]> {
  return (
    await Promise.all(
      moralisResponse.result.map(async (moralisNft) => {
        try {
          return {
            chainId,
            contractAddress: moralisNft.token_address,
            id: moralisNft.token_id,
            metadata: shouldDownloadURI(moralisNft.token_uri)
              ? await download({
                  client: serverThirdwebClient,
                  uri: handleArbitraryTokenURI(moralisNft.token_uri),
                })
                  .then((res) => res.json())
                  .catch(() => ({}))
              : moralisNft.token_uri,
            owner,
            supply: moralisNft.amount || "1",
            tokenAddress: moralisNft.token_address,
            tokenId: moralisNft.token_id,
            tokenURI: moralisNft.token_uri,
            type: moralisNft.contract_type,
          } as WalletNFT;
        } catch {
          return undefined as unknown as WalletNFT;
        }
      }),
    )
  ).filter(Boolean);
}

type MoralisResponse = {
  total: number;
  page: number;
  page_size: number;
  cursor: string | null;
  result: Array<{
    token_address: string;
    token_id: string;
    owner_of: string;
    block_number: string;
    block_number_minted: string;
    token_hash: string;
    amount: string;
    contract_type: string;
    name: string;
    symbol: string;
    token_uri: `https://ipfs.moralis.io:2053/ipfs/${string}`;
    metadata: string;
    last_token_uri_sync: string;
    last_metadata_sync: string;
  }>;
};
