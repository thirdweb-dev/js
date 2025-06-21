"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { JSX } from "react";
import { getChainMetadata } from "../../../../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { getContract } from "../../../../../contract/contract.js";
import { getContractMetadata } from "../../../../../extensions/common/read/getContractMetadata.js";
import { getFunctionId } from "../../../../../utils/function-id.js";
import { resolveScheme } from "../../../../../utils/ipfs.js";
import { useTokenContext } from "./provider.js";

/**
 * Props for the TokenIcon component
 * @component
 * @token
 */
export interface TokenIconProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /**
   * This prop can be a string or a (async) function that resolves to a string, representing the icon url of the token
   * This is particularly useful if you already have a way to fetch the token icon.
   */
  iconResolver?: string | (() => string) | (() => Promise<string>);
  /**
   * This component will be shown while the avatar of the icon is being fetched
   * If not passed, the component will return `null`.
   *
   * You can pass a loading sign or spinner to this prop.
   * @example
   * ```tsx
   * <TokenIcon loadingComponent={<Spinner />} />
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
   * <TokenIcon fallbackComponent={<DummyImage />} />
   * ```
   */
  fallbackComponent?: JSX.Element;

  /**
   * Optional query options for `useQuery`
   */
  queryOptions?: Omit<UseQueryOptions<string>, "queryFn" | "queryKey">;
}

/**
 * This component tries to resolve the icon of a given token, then return an image.
 * @returns an <img /> with the src of the token icon
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { TokenProvider, TokenIcon } from "thirdweb/react";
 *
 * <TokenProvider address="0x-token-address" chain={chain} client={client}>
 *   <TokenIcon />
 * </TokenProvider>
 * ```
 *
 * Result: An <img /> component with the src of the icon
 * ```html
 * <img src="token-icon.png" />
 * ```
 *
 * ### Override the icon with the `iconResolver` prop
 * If you already have the icon url, you can skip the network requests and pass it directly to the TokenIcon
 * ```tsx
 * <TokenIcon iconResolver="/usdc.png" />
 * ```
 *
 * You can also pass in your own custom (async) function that retrieves the icon url
 * ```tsx
 * const getIcon = async () => {
 *   const icon = getIconFromCoinMarketCap(tokenAddress, etc);
 *   return icon;
 * };
 *
 * <TokenIcon iconResolver={getIcon} />
 * ```
 *
 * ### Show a loading sign while the icon is being loaded
 * ```tsx
 * <TokenIcon loadingComponent={<Spinner />} />
 * ```
 *
 * ### Fallback to a dummy image if the token icon fails to resolve
 * ```tsx
 * <TokenIcon fallbackComponent={<img src="blank-image.png" />} />
 * ```
 *
 * ### Usage with queryOptions
 * TokenIcon uses useQuery() from tanstack query internally.
 * It allows you to pass a custom queryOptions of your choice for more control of the internal fetching logic
 * ```tsx
 * <TokenIcon queryOptions={{ enabled: someLogic, retry: 3, }} />
 * ```
 *
 * @component
 * @token
 * @beta
 */
export function TokenIcon({
  iconResolver,
  loadingComponent,
  fallbackComponent,
  queryOptions,
  ...restProps
}: TokenIconProps) {
  const { address, client, chain } = useTokenContext();
  const iconQuery = useQuery({
    queryFn: async () => {
      if (typeof iconResolver === "string") {
        return iconResolver;
      }
      if (typeof iconResolver === "function") {
        return iconResolver();
      }
      if (address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()) {
        const possibleUrl = await getChainMetadata(chain).then(
          (data) => data.icon?.url,
        );
        if (!possibleUrl) {
          throw new Error("Failed to resolve icon for native token");
        }
        return resolveScheme({ client, uri: possibleUrl });
      }

      // Try to get the icon from the contractURI
      const contractMetadata = await getContractMetadata({
        contract: getContract({
          address,
          chain,
          client,
        }),
      });

      if (
        !contractMetadata.image ||
        typeof contractMetadata.image !== "string"
      ) {
        throw new Error("Failed to resolve token icon from contract metadata");
      }

      return resolveScheme({
        client,
        uri: contractMetadata.image,
      });
    },
    queryKey: [
      "_internal_token_icon_",
      chain.id,
      address,
      {
        resolver:
          typeof iconResolver === "string"
            ? iconResolver
            : typeof iconResolver === "function"
              ? getFunctionId(iconResolver)
              : undefined,
      },
    ] as const,
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
