"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { JSX } from "react";
import type { Chain } from "../../../../../chains/types.js";
import { getChainMetadata } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { getFunctionId } from "../../../../../utils/function-id.js";
import { resolveScheme } from "../../../../../utils/ipfs.js";
import { useChainContext } from "./provider.js";

/**
 * Props for the ChainIcon component
 * @chain
 * @component
 */
export interface ChainIconProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /**
   * You need a ThirdwebClient to resolve the icon which is hosted on IPFS.
   * (since most chain icons are hosted on IPFS, loading them via thirdweb gateway will ensure better performance)
   */
  client: ThirdwebClient;
  /**
   * This prop can be a string or a (async) function that resolves to a string, representing the icon url of the chain
   * This is particularly useful if you already have a way to fetch the chain icon.
   */
  iconResolver?: string | (() => string) | (() => Promise<string>);
  /**
   * This component will be shown while the avatar of the icon is being fetched
   * If not passed, the component will return `null`.
   *
   * You can pass a loading sign or spinner to this prop.
   * @example
   * ```tsx
   * <ChainIcon loadingComponent={<Spinner />} />
   * ```
   */
  loadingComponent?: JSX.Element;
  /**
   * This component will be shown if the request for fetching the avatar is done
   * but could not retreive any result.
   * You can pass a dummy avatar/image to this prop.
   *
   * If not passed, the component will return `null`
   *
   * @example
   * ```tsx
   * <ChainIcon fallbackComponent={<DummyImage />} />
   * ```
   */
  fallbackComponent?: JSX.Element;

  /**
   * Optional query options for `useQuery`
   */
  queryOptions?: Omit<UseQueryOptions<string>, "queryFn" | "queryKey">;
}

/**
 * This component tries to resolve the icon of a given chain, then return an image.
 * @returns an <img /> with the src of the chain icon
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { ChainProvider, ChainIcon } from "thirdweb/react";
 *
 * <ChainProvider chain={chain}>
 *   <ChainIcon />
 * </ChainProvider>
 * ```
 *
 * Result: An <img /> component with the src of the icon
 * ```html
 * <img src="chain-icon.png" />
 * ```
 *
 * ### Override the icon with the `iconResolver` prop
 * If you already have the icon url, you can skip the network requests and pass it directly to the ChainIcon
 * ```tsx
 * <ChainIcon iconResolver="/ethereum-icon.png" />
 * ```
 *
 * You can also pass in your own custom (async) function that retrieves the icon url
 * ```tsx
 * const getIcon = async () => {
 *   const icon = getIconFromCoinMarketCap(chainId, etc);
 *   return icon;
 * };
 *
 * <ChainIcon iconResolver={getIcon} />
 * ```
 *
 * ### Show a loading sign while the icon is being loaded
 * ```tsx
 * <ChainIcon loadingComponent={<Spinner />} />
 * ```
 *
 * ### Fallback to a dummy image if the chain icon fails to resolve
 * ```tsx
 * <ChainIcon fallbackComponent={<img src="blank-image.png" />} />
 * ```
 *
 * ### Usage with queryOptions
 * ChainIcon uses useQuery() from tanstack query internally.
 * It allows you to pass a custom queryOptions of your choice for more control of the internal fetching logic
 * ```tsx
 * <ChainIcon queryOptions={{ enabled: someLogic, retry: 3, }} />
 * ```
 *
 * @component
 * @chain
 * @beta
 */
export function ChainIcon({
  iconResolver,
  loadingComponent,
  fallbackComponent,
  queryOptions,
  client,
  ...restProps
}: ChainIconProps) {
  const { chain } = useChainContext();
  const iconQuery = useQuery({
    queryFn: async () => fetchChainIcon({ chain, client, iconResolver }),
    queryKey: getQueryKeys({ chainId: chain.id, iconResolver }),
    ...queryOptions,
  });

  if (iconQuery.isLoading) {
    return loadingComponent || null;
  }

  if (!iconQuery.data) {
    return fallbackComponent || null;
  }

  return <img src={iconQuery.data} {...restProps} alt={restProps.alt} />;
}

/**
 * @internal Exported for tests only
 */
export async function fetchChainIcon(props: {
  chain: Chain;
  client: ThirdwebClient;
  iconResolver?: string | (() => string) | (() => Promise<string>);
}) {
  const { chain, client, iconResolver } = props;
  if (typeof iconResolver === "string") {
    return iconResolver;
  }
  if (typeof iconResolver === "function") {
    return iconResolver();
  }
  // Check if the chain object already has "icon"
  if (chain.icon?.url) {
    return resolveScheme({ client, uri: chain.icon.url });
  }
  const possibleUrl = await getChainMetadata(chain)
    .then((data) => data.icon?.url)
    .catch(() => undefined);
  if (!possibleUrl) {
    throw new Error("Failed to resolve icon for chain");
  }
  return resolveScheme({ client, uri: possibleUrl });
}

/**
 * @internal
 */
export function getQueryKeys(props: {
  chainId: number;
  iconResolver?: string | (() => string) | (() => Promise<string>);
}) {
  const { chainId, iconResolver } = props;
  return [
    "_internal_chain_icon_",
    chainId,
    {
      resolver:
        typeof iconResolver === "string"
          ? iconResolver
          : typeof iconResolver === "function"
            ? getFunctionId(iconResolver)
            : undefined,
    },
  ] as const;
}
