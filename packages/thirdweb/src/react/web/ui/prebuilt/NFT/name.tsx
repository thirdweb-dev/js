"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { JSX } from "react";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { getFunctionId } from "../../../../../utils/function-id.js";
import { useNFTContext } from "./provider.js";
import { getNFTInfo } from "./utils.js";

export interface NFTNameProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  loadingComponent?: JSX.Element;
  fallbackComponent?: JSX.Element;
  /**
   * Optional `useQuery` params
   */
  queryOptions?: Omit<UseQueryOptions<string>, "queryFn" | "queryKey">;
  /**
   * This prop can be a string or a (async) function that resolves to a string, representing the name of the NFT
   * This is particularly useful if you already have a way to fetch the name of the NFT.
   */
  nameResolver?: string | (() => string) | (() => Promise<string>);
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
 * ### Override the name with the `nameResolver` prop
 * If you already have the name, you can skip the network requests and pass it directly to the NFTName
 * ```tsx
 * <NFTName nameResolver="Doodles #1" />
 * ```
 *
 * You can also pass in your own custom (async) function that retrieves the name
 * ```tsx
 * const getName = async () => {
 *   // ...
 *   return name;
 * };
 *
 * <NFTName nameResolver={getName} />
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
  nameResolver,
  ...restProps
}: NFTNameProps) {
  const { contract, tokenId } = useNFTContext();

  const nameQuery = useQuery({
    queryFn: async (): Promise<string> =>
      fetchNftName({ contract, nameResolver, tokenId }),
    queryKey: getQueryKey({
      chainId: contract.chain.id,
      contractAddress: contract.address,
      nameResolver,
      tokenId,
    }),
    ...queryOptions,
  });

  if (nameQuery.isLoading) {
    return loadingComponent || null;
  }

  if (!nameQuery.data) {
    return fallbackComponent || null;
  }
  return <span {...restProps}>{nameQuery.data}</span>;
}

/**
 * @internal
 */
export function getQueryKey(props: {
  contractAddress: string;
  chainId: number;
  tokenId: bigint;
  nameResolver?: string | (() => string) | (() => Promise<string>);
}) {
  const { chainId, tokenId, nameResolver, contractAddress } = props;
  return [
    "_internal_nft_name_",
    chainId,
    contractAddress,
    tokenId.toString(),
    {
      resolver:
        typeof nameResolver === "string"
          ? nameResolver
          : typeof nameResolver === "function"
            ? getFunctionId(nameResolver)
            : undefined,
    },
  ] as const;
}

/**
 * @internal Exported for tests
 */
export async function fetchNftName(props: {
  nameResolver?: string | (() => string) | (() => Promise<string>);
  contract: ThirdwebContract;
  tokenId: bigint;
}): Promise<string> {
  const { nameResolver, contract, tokenId } = props;
  if (typeof nameResolver === "string") {
    return nameResolver;
  }
  if (typeof nameResolver === "function") {
    return nameResolver();
  }
  const nft = await getNFTInfo({ contract, tokenId }).catch(() => undefined);
  if (!nft) {
    throw new Error("Failed to resolve NFT info");
  }
  if (typeof nft.metadata.name !== "string") {
    throw new Error("Failed to resolve NFT name");
  }
  return nft.metadata.name;
}
