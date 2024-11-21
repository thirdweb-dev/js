import type { UseQueryOptions } from "@tanstack/react-query";
import type { JSX } from "react";
import type { NFT } from "../../../../../utils/nft/parseNft.js";
import { useNftInfo } from "./hooks.js";
import { useNFTContext } from "./provider.js";

export interface NFTNameProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  loadingComponent?: JSX.Element;
  fallbackComponent?: JSX.Element;
  /**
   * Optional `useQuery` params
   */
  queryOptions?: Omit<UseQueryOptions<NFT>, "queryFn" | "queryKey">;
}

/**
 * This component fetches and displays an NFT's name. It takes in a `className` and `style` props
 * so you can style it just like how you would style a <span> element.
 * @returns A <span> element containing the name of the NFT
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { NFTProvider, NFTName } from "thirdweb/react";
 *
 * <NFTProvider>
 *   <NFTName />
 * </NFTProvider>
 * ```
 *
 * ### Show a loading sign while the name is being fetched
 * ```tsx
 * import { NFTProvider, NFTName } from "thirdweb/react";
 *
 * <NFTProvider>
 *   <NFTName loadingComponent={<YourLoadingSign />} />
 * </NFTProvider>
 * ```
 *
 * ### Show something in case the name failed to resolve
 * ```tsx
 * import { NFTProvider, NFTName } from "thirdweb/react";
 *
 * <NFTProvider>
 *   <NFTName fallbackComponent={<span>Failed to load name</span>} />
 * </NFTProvider>
 * ```
 *
 * ### Custom query options for useQuery (tanstack-query)
 * ```tsx
 * import { NFTProvider, NFTName } from "thirdweb/react";
 *
 * <NFTProvider>
 *   <NFTName queryOptions={{ retry: 3, enabled: false, }} />
 * </NFTProvider>
 * ```
 *
 * @nft
 * @component
 * @beta
 */
export function NFTName({
  loadingComponent,
  fallbackComponent,
  queryOptions,
  ...restProps
}: NFTNameProps) {
  const { contract, tokenId } = useNFTContext();

  const nftQuery = useNftInfo({
    contract,
    tokenId,
    queryOptions,
  });

  if (nftQuery.isLoading) {
    return loadingComponent || null;
  }

  if (!nftQuery.data?.metadata?.name) {
    return fallbackComponent || null;
  }
  return <span {...restProps}>{nftQuery.data.metadata.name}</span>;
}
