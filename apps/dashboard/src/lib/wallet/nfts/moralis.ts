import "server-only";

import { download } from "thirdweb/storage";
import { getUserThirdwebClient } from "../../../app/api/lib/getAuthToken";
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
  const client = await getUserThirdwebClient();

  return (
    await Promise.all(
      moralisResponse.result.map(async (moralisNft) => {
        try {
          return {
            id: moralisNft.token_id,
            contractAddress: moralisNft.token_address,
            tokenId: moralisNft.token_id,
            metadata: shouldDownloadURI(moralisNft.token_uri)
              ? await download({
                  uri: handleArbitraryTokenURI(moralisNft.token_uri),
                  client,
                })
                  .then((res) => res.json())
                  .catch(() => ({}))
              : moralisNft.token_uri,
            owner,
            tokenURI: moralisNft.token_uri,
            supply: moralisNft.amount || "1",
            type: moralisNft.contract_type,
            tokenAddress: moralisNft.token_address,
            chainId,
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
