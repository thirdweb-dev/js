"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { Image, type ImageProps } from "react-native";
import { resolveAvatar } from "../../../../../extensions/ens/resolve-avatar.js";
import {
  type ResolveNameOptions,
  resolveName,
} from "../../../../../extensions/ens/resolve-name.js";
import { getSocialProfiles } from "../../../../../social/profiles.js";
import type { SocialProfile } from "../../../../../social/types.js";
import { parseAvatarRecord } from "../../../../../utils/ens/avatar.js";
import { useAccountContext } from "../../../../core/account/provider.js";
/**
 * Props for the AccountAvatar component
 * @component
 * @wallet
 */
export interface AccountAvatarProps
  extends Omit<ImageProps, "source">,
    Omit<ResolveNameOptions, "client" | "address"> {
  /**
   * Use this prop to prioritize the social profile that you want to display
   * This is useful for a wallet containing multiple social profiles.
   * This component inherits all attributes of a HTML's <img />, so you can interact with it just like a normal <img />
   *
   * @example
   * If you have ENS, Lens and Farcaster profiles linked to your wallet
   * you can prioritize showing the image for Lens by:
   * ```tsx
   * <AccountAvatar
   *   socialType="lens" // Choose between: "farcaster" | "lens" | "ens"
   * />
   * ```
   */
  socialType?: SocialProfile["type"];

  /**
   * This component will be shown while the avatar of the account is being fetched
   * If not passed, the component will return `null`.
   *
   * You can pass a loading sign or spinner to this prop.
   * @example
   * ```tsx
   * <AccountAvatar loadingComponent={<Spinner />} />
   * ```
   */
  loadingComponent?: React.ComponentType;
  /**
   * This component will be shown if the request for fetching the avatar is done
   * but could not retreive any result.
   * You can pass a dummy avatar/image to this prop.
   *
   * If not passed, the component will return `null`
   *
   * @example
   * ```tsx
   * <AccountAvatar fallbackComponent={<DummyImage />} />
   * ```
   */
  fallbackComponent?: React.ComponentType;

  /**
   * Optional query options for `useQuery`
   */
  queryOptions?: Omit<UseQueryOptions<string>, "queryFn" | "queryKey">;
}

/**
 * The component for showing the avatar of the account.
 * If fetches all the social profiles linked to your wallet, including: Farcaster, ENS, Lens (more to be added)
 * You can choose which social profile you want to display. Defaults to the first item in the list.
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { AccountProvider, AccountAvatar } from "thirdweb/react";
 *
 * <AccountProvider address="0x...">
 *   <AccountAvatar />
 * </AccountProvider>
 * ```
 * Result: An <img /> component, if the avatar is resolved successfully
 * ```html
 * <img alt="" src="resolved-url-for-the-avatar" />
 * ```
 *
 * ### Show a loading sign when the avatar is being resolved
 * ```tsx
 * import { AccountProvider, AccountAvatar } from "thirdweb/react";
 *
 * <AccountProvider address="0x...">
 *   <AccountAvatar
 *     loadingComponent={<YourLoadingComponent />}
 *   />
 * </AccountProvider>
 * ```
 *
 * ### Fallback to something when the avatar fails to resolve
 * ```tsx
 * import { AccountProvider, AccountAvatar } from "thirdweb/react";
 *
 * <AccountProvider address="0x...">
 *   <AccountAvatar
 *     fallbackComponent={<DummyImage />}
 *   />
 * </AccountProvider>
 * ```
 *
 * ### Select a social profile to display
 * If you wallet associates with more than one social profiles (Lens, Farcaster, ENS, etc.)
 * You can specify which service you want to prioritize using the `socialType` props
 * ```tsx
 * import { AccountProvider, AccountAvatar } from "thirdweb/react";
 *
 * <AccountProvider address="0x...">
 *   <AccountAvatar
 *     // Choose between: "farcaster" | "lens" | "ens"
 *     socialType={"ens"}
 *   />
 * </AccountProvider>
 * ```
 *
 * ### Custom ENS resolver chain
 * This component shares the same props with the ENS extension `resolveAvatar`
 * ```tsx
 * import { AccountProvider, AccountAvatar } from "thirdweb/react";
 * import { base } from "thirdweb/chains";
 *
 * <AccountProvider address="0x...">
 *   <AccountAvatar
 *     resolverAddress={"0x..."}
 *     resolverChain={base}
 *   />
 * </AccountProvider>
 * ```
 *
 * ### Custom query options for useQuery
 * This component uses `@tanstack-query`'s useQuery internally.
 * You can use the `queryOptions` prop for more fine-grained control
 * ```tsx
 * <AccountAvatar
 *   queryOptions={{
 *     enabled: isEnabled,
 *     retry: 3,
 *   }}
 * />
 * ```
 * @returns An <img /> if the avatar is resolved successfully
 * @component
 * @wallet
 * @beta
 */
export function AccountAvatar({
  socialType,
  resolverAddress,
  resolverChain,
  loadingComponent,
  fallbackComponent,
  queryOptions,
  ...restProps
}: AccountAvatarProps) {
  const { address, client } = useAccountContext();
  const avatarQuery = useQuery({
    queryFn: async (): Promise<string> => {
      const [socialData, ensName] = await Promise.all([
        getSocialProfiles({ address, client }),
        resolveName({
          address: address || "",
          client,
          resolverAddress,
          resolverChain,
        }),
      ]);

      const uri = socialData?.filter(
        (p) => p.avatar && (socialType ? p.type === socialType : true),
      )[0]?.avatar;

      const [resolvedSocialAvatar, resolvedENSAvatar] = await Promise.all([
        uri ? parseAvatarRecord({ client, uri }) : undefined,
        ensName
          ? resolveAvatar({
              client,
              name: ensName,
            })
          : undefined,
      ]);

      // If no social image + ens name found -> exit and show <Blobbie />
      if (!resolvedSocialAvatar && !resolvedENSAvatar) {
        throw new Error("Failed to resolve social + ens avatar");
      }

      // else, prioritize the social image first
      if (resolvedSocialAvatar) {
        return resolvedSocialAvatar;
      }

      if (resolvedENSAvatar) {
        return resolvedENSAvatar;
      }

      throw new Error("Failed to resolve social + ens avatar");
    },
    queryKey: [
      "account-avatar",
      address,
      { socialType },
      { resolverAddress, resolverChain },
    ],
    retry: false,
    ...queryOptions,
  });

  if (avatarQuery.isLoading) {
    return loadingComponent || null;
  }

  if (!avatarQuery.data) {
    return fallbackComponent || null;
  }

  return <Image source={{ uri: avatarQuery.data }} {...restProps} />;
}
