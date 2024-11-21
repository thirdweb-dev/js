import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getNFT as getNFT721 } from "../../../../../extensions/erc721/read/getNFT.js";
import { getNFT as getNFT1155 } from "../../../../../extensions/erc1155/read/getNFT.js";
import type { NFT } from "../../../../../utils/nft/parseNft.js";
import type { NFTProviderProps } from "./provider.js";

/**
 * @internal Only used for the NFT prebuilt components
 */
export function useNftInfo(
  props: NFTProviderProps & {
    queryOptions?: Omit<UseQueryOptions<NFT>, "queryFn" | "queryKey">;
  },
) {
  return useQuery({
    queryKey: [
      "__nft_component_internal__",
      props.contract.chain.id,
      props.contract.address,
      props.tokenId.toString(),
    ],
    queryFn: () =>
      getNFTInfo({ contract: props.contract, tokenId: props.tokenId }),
    ...props.queryOptions,
  });
}

/**
 * @internal
 */
export async function getNFTInfo(options: NFTProviderProps): Promise<NFT> {
  const nft = await Promise.allSettled([
    getNFT721(options),
    getNFT1155(options),
  ]).then(([possibleNFT721, possibleNFT1155]) => {
    // getNFT extension always return an NFT object
    // so we need to check if the tokenURI exists
    if (
      possibleNFT721.status === "fulfilled" &&
      possibleNFT721.value.tokenURI
    ) {
      return possibleNFT721.value;
    }
    if (
      possibleNFT1155.status === "fulfilled" &&
      possibleNFT1155.value.tokenURI
    ) {
      return possibleNFT1155.value;
    }
    throw new Error("Failed to load NFT metadata");
  });
  return nft;
}
