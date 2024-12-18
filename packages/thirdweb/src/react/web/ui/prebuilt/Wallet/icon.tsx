"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { JSX } from "react";
import { getWalletInfo } from "../../../../../wallets/__generated__/getWalletInfo.js";
import type { WalletId } from "../../../../../wallets/wallet-types.js";
import { useWalletContext } from "./provider.js";

export interface WalletIconProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /**
   * This component will be shown while the icon of the wallet is being fetched
   * If not passed, the component will return `null`.
   *
   * You can/should pass a loading sign or spinner to this prop.
   * @example
   * ```tsx
   * <WalletIcon loadingComponent={<Spinner />} />
   * ```
   */
  loadingComponent?: JSX.Element;
  /**
   * This component will be shown if the icon fails to be retreived
   * If not passed, the component will return `null`.
   *
   * You can/should pass a descriptive text/component to this prop, indicating that the
   * icon was not fetched succesfully
   * @example
   * ```tsx
   * <WalletIcon fallbackComponent={<span>Failed to load</span>}
   * />
   * ```
   */
  fallbackComponent?: JSX.Element;
  /**
   * Optional `useQuery` params
   */
  queryOptions?: Omit<UseQueryOptions<string>, "queryFn" | "queryKey">;
}

/**
 * This component tries to resolve the icon of a given wallet, then return an image.
 * @returns an <img /> with the src of the wallet icon
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { WalletProvider, WalletIcon } from "thirdweb/react";
 *
 * <WalletProvider id="io.metamask">
 *   <WalletIcon />
 * </WalletProvider>
 * ```
 *
 * Result: An <img /> component with the src of the icon
 * ```html
 * <img src="metamask-icon.png" />
 * ```
 *
 * ### Show a loading sign while the icon is being loaded
 * ```tsx
 * <WalletIcon loadingComponent={<Spinner />} />
 * ```
 *
 * ### Fallback to a dummy image if the wallet icon fails to resolve
 * ```tsx
 * <WalletIcon fallbackComponent={<img src="blank-image.png" />} />
 * ```
 *
 * ### Usage with queryOptions
 * WalletIcon uses useQuery() from tanstack query internally.
 * It allows you to pass a custom queryOptions of your choice for more control of the internal fetching logic
 * ```tsx
 * <WalletIcon queryOptions={{ enabled: someLogic, retry: 3, }} />
 * ```
 *
 * @component
 * @wallet
 * @beta
 */
export function WalletIcon({
  loadingComponent,
  fallbackComponent,
  queryOptions,
  ...restProps
}: WalletIconProps) {
  const imageQuery = useWalletIcon({ queryOptions });
  if (imageQuery.isLoading) {
    return loadingComponent || null;
  }
  if (!imageQuery.data) {
    return fallbackComponent || null;
  }
  return <img src={imageQuery.data} {...restProps} alt={restProps.alt} />;
}

/**
 * @internal
 */
function useWalletIcon(props: {
  queryOptions?: Omit<UseQueryOptions<string>, "queryFn" | "queryKey">;
}) {
  const { id } = useWalletContext();
  const imageQuery = useQuery({
    queryKey: ["walletIcon", id],
    queryFn: async () => fetchWalletImage({ id }),
    ...props.queryOptions,
  });
  return imageQuery;
}

/**
 * @internal Exported for tests only
 */
export async function fetchWalletImage(props: {
  id: WalletId;
}) {
  const image_src = await getWalletInfo(props.id, true);
  return image_src;
}
