"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { JSX } from "react";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { getFunctionId } from "../../../../../utils/function-id.js";
import { useNFTContext } from "./provider.js";
import { getNFTInfo } from "./utils.js";

export interface NFTDescriptionProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  loadingComponent?: JSX.Element;
  fallbackComponent?: JSX.Element;
  /**
   * Optional `useQuery` params
   */
  queryOptions?: Omit<UseQueryOptions<string>, "queryFn" | "queryKey">;
  /**
   * This prop can be a string or a (async) function that resolves to a string, representing the description of the NFT
   * This is particularly useful if you already have a way to fetch the data.
   */
  descriptionResolver?: string | (() => string) | (() => Promise<string>);
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
 * ### Override the description with the `descriptionResolver` prop
 * If you already have the url, you can skip the network requests and pass it directly to the NFTDescription
 * ```tsx
 * <NFTDescription descriptionResolver="The desc of the NFT" />
 * ```
 *
 * You can also pass in your own custom (async) function that retrieves the description
 * ```tsx
 * const getDescription = async () => {
 *   // ...
 *   return description;
 * };
 *
 * <NFTDescription descriptionResolver={getDescription} />
 * ```
 * @component
 * @nft
 * @beta
 */
export function NFTDescription({
  loadingComponent,
  fallbackComponent,
  queryOptions,
  descriptionResolver,
  ...restProps
}: NFTDescriptionProps) {
  const { contract, tokenId } = useNFTContext();
  const descQuery = useQuery({
    queryFn: async (): Promise<string> =>
      fetchNftDescription({ contract, descriptionResolver, tokenId }),
    queryKey: [
      "_internal_nft_description_",
      contract.chain.id,
      contract.address,
      tokenId.toString(),
      {
        resolver:
          typeof descriptionResolver === "string"
            ? descriptionResolver
            : typeof descriptionResolver === "function"
              ? getFunctionId(descriptionResolver)
              : undefined,
      },
    ],
    ...queryOptions,
  });

  if (descQuery.isLoading) {
    return loadingComponent || null;
  }

  if (!descQuery.data) {
    return fallbackComponent || null;
  }

  return <span {...restProps}>{descQuery.data}</span>;
}

/**
 * @internal Exported for tests
 */
export async function fetchNftDescription(props: {
  descriptionResolver?: string | (() => string) | (() => Promise<string>);
  contract: ThirdwebContract;
  tokenId: bigint;
}): Promise<string> {
  const { descriptionResolver, contract, tokenId } = props;
  if (typeof descriptionResolver === "string") {
    return descriptionResolver;
  }
  if (typeof descriptionResolver === "function") {
    return descriptionResolver();
  }
  const nft = await getNFTInfo({ contract, tokenId }).catch(() => undefined);
  if (!nft) {
    throw new Error("Failed to resolve NFT info");
  }
  if (typeof nft.metadata.description !== "string") {
    throw new Error("Failed to resolve NFT description");
  }
  return nft.metadata.description;
}
