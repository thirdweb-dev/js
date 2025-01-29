"use client";

import type { UseQueryOptions } from "@tanstack/react-query";
import { Image, type ImageProps } from "react-native";
import { SvgXml, type XmlProps } from "react-native-svg";
import type { AuthOption } from "../../../../../wallets/types.js";
import { useWalletIcon } from "../../../../core/utils/walletIcon.js";
import { getAuthProviderImage } from "../../components/WalletImage.js";

export interface WalletIconProps extends Omit<ImageProps, "uri"> {
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
  loadingComponent?: React.ComponentType;
  /**
   * This component will be shown if the icon fails to be retrieved
   * If not passed, the component will return `null`.
   *
   * You can/should pass a descriptive text/component to this prop, indicating that the
   * icon was not fetched successfully
   * @example
   * ```tsx
   * <WalletIcon fallbackComponent={<span>Failed to load</span>}
   * />
   * ```
   */
  fallbackComponent?: React.ComponentType;
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
  return <Image source={{ uri: imageQuery.data }} {...restProps} />;
}

export interface SocialIconProps extends Omit<XmlProps, "xml"> {
  provider: AuthOption | (string & {});
}

/**
 * Social auth provider icon
 * @returns an <img /> component with the src set to the svg
 *
 * @example
 * ```tsx
 * import { SocialIcon } from "thirdweb/react";
 *
 * <SocialIcon provider="google" />
 * ```
 *
 * Result: An <img /> component with the src of the icon
 * ```html
 * <img src="google-icon-svg" />
 * ```
 *
 * @component
 * @wallet
 * @beta
 */
export function SocialIcon({ provider, ...restProps }: SocialIconProps) {
  const src = getAuthProviderImage(provider);
  return <SvgXml xml={src} {...restProps} />;
}
