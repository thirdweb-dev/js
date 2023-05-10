import { handleArbitraryTokenURI, shouldDownloadURI } from "./tokenUri";
import { WalletNFT } from "./types";
import { ChainId } from "@thirdweb-dev/sdk/evm";
import { StorageSingleton } from "lib/sdk";

const moralisUrlMap = {
  // fantom
  [ChainId.Fantom]: `https://deep-index.moralis.io/api/v2/`,
  // fantom testnet is not supported...

  // avalanche
  [ChainId.Avalanche]: `https://deep-index.moralis.io/api/v2/`,
  [ChainId.AvalancheFujiTestnet]: `https://deep-index.moralis.io/api/v2/`,

  // binance
  [ChainId.BinanceSmartChainMainnet]: `https://deep-index.moralis.io/api/v2/`,
  [ChainId.BinanceSmartChainTestnet]: `https://deep-index.moralis.io/api/v2/`,

  // Sepolia
  11155111: `https://deep-index.moralis.io/api/v2/`,
  // palm
  11297108109: `https://deep-index.moralis.io/api/v2/`,
  // cronos
  25: `https://deep-index.moralis.io/api/v2/`,
  // cronos testnet
  338: `https://deep-index.moralis.io/api/v2/`,
} as const;

type MoralisSupportedChainId = keyof typeof moralisUrlMap;

export function isMoralisSupported(
  chainId: number,
): chainId is MoralisSupportedChainId {
  return chainId in moralisUrlMap;
}

export function generateMoralisURL(
  chainId: MoralisSupportedChainId,
  owner: string,
) {
  const url = new URL(`${moralisUrlMap[chainId]}/${owner}/nft`);

  url.searchParams.append("chain", `0x${chainId.toString(16)}`);
  url.searchParams.append("format", "hex");

  return url.toString();
}

export async function transformMoralisResponseToNFT(
  moralisResponse: MoralisResponse,
  owner: string,
): Promise<WalletNFT[]> {
  return (
    await Promise.all(
      moralisResponse.result.map(async (moralisNft) => {
        try {
          return {
            contractAddress: moralisNft.token_address,
            tokenId: parseInt(moralisNft.token_id, 16),
            metadata: shouldDownloadURI(moralisNft.token_uri)
              ? await StorageSingleton.downloadJSON(
                  handleArbitraryTokenURI(moralisNft.token_uri),
                )
              : moralisNft.token_uri,
            owner,
            supply: moralisNft.amount || "1",
            type: moralisNft.contract_type,
          } as WalletNFT;
        } catch (e) {
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
