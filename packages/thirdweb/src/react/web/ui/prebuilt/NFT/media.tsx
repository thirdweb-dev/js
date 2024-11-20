import type { UseQueryOptions } from "@tanstack/react-query";
import type { JSX } from "react";
import type { NFT } from "../../../../../utils/nft/parseNft.js";
import { MediaRenderer } from "../../MediaRenderer/MediaRenderer.js";
import type { MediaRendererProps } from "../../MediaRenderer/types.js";
import { useNftInfo } from "./hooks.js";
import { useNFTContext } from "./provider.js";

/**
 * @component
 * The props for the <NFTMedia /> component
 * It is similar to the [`MediaRendererProps`](https://portal.thirdweb.com/references/typescript/v5/MediaRendererProps)
 * (excluding `src`, `poster` and `client`) that you can
 * use to style the NFTMedia
 */
export type NFTMediaProps = Omit<
  MediaRendererProps,
  "src" | "poster" | "client"
> & {
  loadingComponent?: JSX.Element;
  fallbackComponent?: JSX.Element;
  /**
   * Optional `useQuery` params
   */
  queryOptions?: Omit<UseQueryOptions<NFT>, "queryFn" | "queryKey">;
};

/**
 * This component fetches and displays an NFT's media. It uses thirdweb [`MediaRenderer`](https://portal.thirdweb.com/refernces/typescript/v5/MediaRenderer) under the hood
 * so you can style it just like how you would style a MediaRenderer.
 * @returns A MediaRenderer component
 *
 * @component
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { NFTProvider, NFTMedia } from "thirdweb/react";
 *
 * <NFTProvider>
 *   <NFTMedia />
 * </NFTProvider>
 * ```
 *
 * ### Show a loading sign while the media is being fetched
 * ```tsx
 * import { NFTProvider, NFTMedia } from "thirdweb/react";
 *
 * <NFTProvider>
 *   <NFTMedia loadingComponent={<YourLoadingSign />} />
 * </NFTProvider>
 * ```
 *
 * ### Show something in case the media failed to resolve
 * ```tsx
 * import { NFTProvider, NFTMedia } from "thirdweb/react";
 *
 * <NFTProvider>
 *   <NFTMedia fallbackComponent={<span>Failed to load media</span>} />
 * </NFTProvider>
 * ```
 *
 * ### Custom query options for useQuery (tanstack-query)
 * ```tsx
 * import { NFTProvider, NFTMedia } from "thirdweb/react";
 *
 * <NFTProvider>
 *   <NFTMedia queryOptions={{ retry: 3, enabled: false, }} />
 * </NFTProvider>
 * ```
 *
 * ### Basic stylings
 *
 * You can style NFTMedia with the `style` and `className` props.
 *
 * ```tsx
 * <NFTMedia style={{ borderRadius: "8px" }} className="mx-auto" />
 * ```
 * @nft
 * @beta
 */
export function NFTMedia({
  loadingComponent,
  fallbackComponent,
  queryOptions,
  ...mediaRendererProps
}: NFTMediaProps) {
  const { contract, tokenId } = useNFTContext();
  const nftQuery = useNftInfo({
    contract,
    tokenId,
    queryOptions,
  });

  if (nftQuery.isLoading) {
    return loadingComponent || null;
  }

  if (!nftQuery.data) {
    return fallbackComponent || null;
  }

  const animation_url = nftQuery.data.metadata.animation_url;
  const image =
    nftQuery.data.metadata.image || nftQuery.data.metadata.image_url;

  if (!animation_url && !image) {
    return fallbackComponent || null;
  }

  return (
    <MediaRenderer
      client={contract.client}
      src={animation_url || image}
      poster={image}
      {...mediaRendererProps}
    />
  );
}
