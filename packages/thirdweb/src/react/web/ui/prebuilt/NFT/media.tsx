"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { JSX } from "react";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { getFunctionId } from "../../../../../utils/function-id.js";
import { MediaRenderer } from "../../MediaRenderer/MediaRenderer.js";
import type { MediaRendererProps } from "../../MediaRenderer/types.js";
import { useNFTContext } from "./provider.js";
import { getNFTInfo } from "./utils.js";

/**
 * @component
 * @beta
 * @wallet
 */
export type NFTMediaInfo = {
  src: string;
  poster: string | undefined;
};

/**
 * @component
 * @beta
 * @wallet
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
  queryOptions?: Omit<UseQueryOptions<NFTMediaInfo>, "queryFn" | "queryKey">;
  /**
   * This prop can be a string or a (async) function that resolves to a string, representing the media url of the NFT
   * This is particularly useful if you already have a way to fetch the image.
   * In case of function, the function must resolve to an object of type `NFTMediaInfo`
   */
  mediaResolver?:
    | NFTMediaInfo
    | (() => NFTMediaInfo)
    | (() => Promise<NFTMediaInfo>);
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
 *
 * ### Override the media with the `mediaResolver` prop
 * If you already have the url, you can skip the network requests and pass it directly to the NFTMedia
 * ```tsx
 * <NFTMedia mediaResolver={{
 *   src: "/cat_video.mp4",
 *   // Poster is applicable to medias that are videos and audios
 *   poster: "/cat-image.png",
 * }} />
 * ```
 *
 * You can also pass in your own custom (async) function that retrieves the media url
 * ```tsx
 * const getMedia = async () => {
 *   const url = getNFTMedia(props);
 *   return url;
 * };
 *
 * <NFTMedia mediaResolver={getMedia} />
 * ```
 * @nft
 * @beta
 */
export function NFTMedia({
  loadingComponent,
  fallbackComponent,
  queryOptions,
  mediaResolver,
  ...mediaRendererProps
}: NFTMediaProps) {
  const { contract, tokenId } = useNFTContext();
  const mediaQuery = useQuery({
    queryFn: async (): Promise<NFTMediaInfo> =>
      fetchNftMedia({ contract, mediaResolver, tokenId }),
    queryKey: getQueryKey({
      chainId: contract.chain.id,
      contractAddress: contract.address,
      mediaResolver,
      tokenId,
    }),
    ...queryOptions,
  });

  if (mediaQuery.isLoading) {
    return loadingComponent || null;
  }

  if (!mediaQuery.data) {
    return fallbackComponent || null;
  }

  return (
    <MediaRenderer
      client={contract.client}
      poster={mediaQuery.data.poster}
      src={mediaQuery.data.src}
      {...mediaRendererProps}
    />
  );
}

/**
 * @internal
 */
export function getQueryKey(props: {
  contractAddress: string;
  chainId: number;
  tokenId: bigint;
  mediaResolver?:
    | NFTMediaInfo
    | (() => NFTMediaInfo)
    | (() => Promise<NFTMediaInfo>);
}) {
  const { chainId, tokenId, mediaResolver, contractAddress } = props;
  return [
    "_internal_nft_media_",
    chainId,
    contractAddress,
    tokenId.toString(),
    {
      resolver:
        typeof mediaResolver === "object"
          ? mediaResolver
          : typeof mediaResolver === "function"
            ? getFunctionId(mediaResolver)
            : undefined,
    },
  ] as const;
}

/**
 * @internal Exported for tests only
 */
export async function fetchNftMedia(props: {
  mediaResolver?:
    | NFTMediaInfo
    | (() => NFTMediaInfo)
    | (() => Promise<NFTMediaInfo>);
  contract: ThirdwebContract;
  tokenId: bigint;
}): Promise<{ src: string; poster: string | undefined }> {
  const { mediaResolver, contract, tokenId } = props;
  if (typeof mediaResolver === "object") {
    return mediaResolver;
  }
  if (typeof mediaResolver === "function") {
    return mediaResolver();
  }
  const nft = await getNFTInfo({ contract, tokenId }).catch(() => undefined);
  if (!nft) {
    throw new Error("Failed to resolve NFT info");
  }
  const animation_url = nft.metadata.animation_url;
  const image = nft.metadata.image || nft.metadata.image_url;
  if (animation_url) {
    return {
      poster: image || undefined,
      src: animation_url,
    };
  }
  if (image) {
    return {
      poster: undefined,
      src: image,
    };
  }
  throw new Error("Failed to resolve NFT media");
}
