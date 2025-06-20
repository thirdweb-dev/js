"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { Text, type TextProps } from "react-native";
import {
  type ResolveNameOptions,
  resolveName,
} from "../../../../../extensions/ens/resolve-name.js";
import { getSocialProfiles } from "../../../../../social/profiles.js";
import type { SocialProfile } from "../../../../../social/types.js";
import { useAccountContext } from "../../../../core/account/provider.js";

/**
 * Props for the AccountName component
 * @component
 * @wallet
 */
export interface AccountNameProps
  extends Omit<TextProps, "children">,
    Omit<ResolveNameOptions, "client" | "address"> {
  /**
   * A function used to transform (format) the name of the account.
   * it should take in a string and output a string.
   *
   * This function is particularly useful
   */
  formatFn?: (str: string) => string;
  /**
   * Use this prop to prioritize the social profile that you want to display
   * This is useful for a wallet containing multiple social profiles
   */
  socialType?: SocialProfile["type"];
  /**
   * This component will be shown while the name of the account is being fetched
   * If not passed, the component will return `null`.
   *
   * You can pass a loading sign or spinner to this prop.
   * @example
   * ```tsx
   * <AccountName loadingComponent={<Spinner />} />
   * ```
   */
  loadingComponent?: React.ComponentType;
  /**
   * This component will be shown if the request for fetching the name is done but could not retreive any result.
   * You can pass the wallet address as the fallback option if that's the case.
   *
   * If not passed, the component will return `null`
   *
   * @example
   * ```tsx
   * <AccountName fallbackComponent={"0x1234....3f3f"} />
   * ```
   */
  fallbackComponent?: React.ComponentType;
  /**
   * Optional `useQuery` params
   */
  queryOptions?: Omit<UseQueryOptions<string>, "queryFn" | "queryKey">;
}

/**
 * This component is used to display the name of the account.
 * A "name" in this context is the username, or account of the social profiles that the wallet may have.
 * In case a name is not found or failed to resolve, you can always fallback to displaying the wallet address instead by using the `fallbackComponent` prop.
 *
 * This component inherits all attribute of a native HTML <span> element, so you can style it just like how you would style a <span>.
 *
 * @param props
 * @returns A `<span>` containing the name of the account
 * ```html
 * <span>{name}</span>
 * ```
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { AccountProvider, AccountName } from "thirdweb/react";
 *
 * <AccountProvider address="0x1234...3f3f" client={client}>
 *   <AccountName />
 * </AccountProvider>
 * ```
 *
 * ### Show wallet address while social name is being loaded
 * ```tsx
 * <AccountName
 *   loadingComponent={<AccountAddress />}
 * />
 * ```
 *
 *
 * ### Fallback to showing wallet address if fail to resolve social name
 * ```tsx
 * <AccountName
 *   fallbackComponent={<AccountAddress />}
 * />
 * ```
 *
 * ### Transform the account name using `formatFn` prop
 * ```tsx
 * import { isAddress, shortenAddress } from "thirdweb/utils";
 * import { AccountProvider, AccountName } from "thirdweb/react";
 *
 * // Let's say we want the name to be capitalized without using CSS
 * const formatName = (name: string) => name.toUpperCase();
 *
 * return <AccountName formatFn={formatName} />
 * ```
 *
 *
 * ### Custom query options for useQuery
 * This component uses `@tanstack-query`'s useQuery internally.
 * You can use the `queryOptions` prop for more fine-grained control
 * ```tsx
 * <AccountName
 *   queryOptions={{
 *     enabled: isEnabled,
 *     retry: 3
 *   }}
 * />
 * ```
 *
 * @component
 * @wallet
 * @beta
 */
export function AccountName({
  resolverAddress,
  resolverChain,
  socialType,
  formatFn,
  queryOptions,
  loadingComponent,
  fallbackComponent,
  ...restProps
}: AccountNameProps) {
  const { address, client } = useAccountContext();
  const nameQuery = useQuery({
    queryFn: async () => {
      const [socialData, ensName] = await Promise.all([
        getSocialProfiles({ address, client }),
        resolveName({
          address,
          client,
          resolverAddress,
          resolverChain,
        }),
      ]);

      const name =
        socialData?.filter(
          (p) => p.name && (socialType ? p.type === socialType : true),
        )[0]?.name || ensName;

      if (!name) {
        throw new Error("Failed to resolve account name");
      }
      return formatFn ? formatFn(name) : name;
    },
    queryKey: [
      "account-name",
      address,
      { socialType },
      { resolverAddress, resolverChain },
    ],
    retry: false,
    ...queryOptions,
  });

  if (nameQuery.isLoading) {
    return loadingComponent || null;
  }

  if (!nameQuery.data) {
    return fallbackComponent || null;
  }

  return <Text {...restProps}>{nameQuery.data}</Text>;
}
