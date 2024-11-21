"use client";

import type { UseQueryOptions } from "@tanstack/react-query";
import type { JSX } from "react";
import type { NFT } from "../../../../../utils/nft/parseNft.js";
import { useNftInfo } from "./hooks.js";
import { useNFTContext } from "./provider.js";

export interface NFTDescriptionProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  loadingComponent?: JSX.Element;
  fallbackComponent?: JSX.Element;
  /**
   * Optional `useQuery` params
   */
  queryOptions?: Omit<UseQueryOptions<NFT>, "queryFn" | "queryKey">;
}

/**
 * This component fetches and displays an NFT's description. It inherits all the attributes of a <span>
 * so you can style it just like how you would style a <span> element.
 * @returns A <span> element containing the description of the NFT
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { NFTProvider, NFTDescription } from "thirdweb/react";
 *
 * <NFTProvider>
 *   <NFTDescription />
 * </NFTProvider>
 * ```
 *
 * ### Show a loading sign while the description is being fetched
 * ```tsx
 * import { NFTProvider, NFTDescription } from "thirdweb/react";
 *
 * <NFTProvider>
 *   <NFTDescription loadingComponent={<YourLoadingSign />} />
 * </NFTProvider>
 * ```
 *
 * ### Show something in case the description failed to resolve
 * ```tsx
 * import { NFTProvider, NFTDescription } from "thirdweb/react";
 *
 * <NFTProvider>
 *   <NFTDescription fallbackComponent={<span>Failed to load description</span>} />
 * </NFTProvider>
 * ```
 *
 * ### Custom query options for useQuery (tanstack-query)
 * ```tsx
 * import { NFTProvider, NFTDescription } from "thirdweb/react";
 *
 * <NFTProvider>
 *   <NFTDescription queryOptions={{ retry: 3, enabled: false, }} />
 * </NFTProvider>
 * ```
 *
 * @component
 * @nft
 * @beta
 */
export function NFTDescription({
  loadingComponent,
  fallbackComponent,
  queryOptions,
  ...restProps
}: NFTDescriptionProps) {
  const { contract, tokenId } = useNFTContext();
  const nftQuery = useNftInfo({
    contract,
    tokenId,
    queryOptions,
  });

  if (nftQuery.isLoading) {
    return loadingComponent || null;
  }

  if (!nftQuery.data?.metadata?.description) {
    return fallbackComponent || null;
  }

  return <span {...restProps}>{nftQuery.data.metadata.description}</span>;
}
