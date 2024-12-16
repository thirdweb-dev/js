"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { JSX } from "react";
import { getFunctionId } from "../../../../../utils/function-id.js";
import { getWalletInfo } from "../../../../../wallets/__generated__/getWalletInfo.js";
import type { WalletId } from "../../../../../wallets/wallet-types.js";
import { useWalletContext } from "./provider.js";

/**
 * Props for the WalletName component
 * @component
 * @wallet
 */
export interface WalletNameProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * This component will be shown while the name of the wallet name is being fetched
   * If not passed, the component will return `null`.
   *
   * You can/should pass a loading sign or spinner to this prop.
   * @example
   * ```tsx
   * <WalletName loadingComponent={<Spinner />} />
   * ```
   */
  loadingComponent?: JSX.Element;
  /**
   * This component will be shown if the name fails to be retreived
   * If not passed, the component will return `null`.
   *
   * You can/should pass a descriptive text/component to this prop, indicating that the
   * name was not fetched succesfully
   * @example
   * ```tsx
   * <WalletName fallbackComponent={<span>Failed to load</span>}
   * />
   * ```
   */
  fallbackComponent?: JSX.Element;
  /**
   * Optional `useQuery` params
   */
  queryOptions?: Omit<UseQueryOptions<string>, "queryFn" | "queryKey">;
  /**
   * A function to format the name's display value
   * ```tsx
   * <WalletName formatFn={(str: string) => doSomething()} />
   * ```
   */
  formatFn?: (str: string) => string;
}

/**
 * This component fetches then shows the name of a wallet.
 * It inherits all the attributes of a HTML <span> component, hence you can style it just like how you would style a normal <span>
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { WalletProvider, WalletName } from "thirdweb/react";
 *
 * <WalletProvider id="io.metamask">
 *   <WalletName  />
 * </WalletProvider>
 * ```
 * Result:
 * ```html
 * <span>MetaMask</span>
 * ```
 *
 * ### Show a loading sign when the name is being fetched
 * ```tsx
 * import { WalletProvider, WalletName } from "thirdweb/react";
 *
 * <WalletProvider {...props}>
 *   <WalletName loadingComponent={<Spinner />} />
 * </WalletProvider>
 * ```
 *
 * ### Fallback to something when the name fails to resolve
 * ```tsx
 * <WalletProvider {...props}>
 *   <WalletName fallbackComponent={<span>Failed to load</span>} />
 * </WalletProvider>
 * ```
 *
 * ### Custom query options for useQuery
 * This component uses `@tanstack-query`'s useQuery internally.
 * You can use the `queryOptions` prop for more fine-grained control
 * ```tsx
 * <WalletName
 *   queryOptions={{
 *     enabled: isEnabled,
 *     retry: 4,
 *   }}
 * />
 * @component
 * @beta
 * @wallet
 */
export function WalletName({
  loadingComponent,
  fallbackComponent,
  queryOptions,
  formatFn,
  ...restProps
}: WalletNameProps) {
  const nameQuery = useWalletName({ queryOptions, formatFn });
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
function useWalletName(props: {
  formatFn?: (str: string) => string;
  queryOptions?: Omit<UseQueryOptions<string>, "queryFn" | "queryKey">;
}) {
  const { id } = useWalletContext();
  const nameQuery = useQuery({
    queryKey: getQueryKeys({ id, formatFn: props.formatFn }),
    queryFn: async () => fetchWalletName({ id, formatFn: props.formatFn }),
    ...props.queryOptions,
  });
  return nameQuery;
}

/**
 * @internal Exported for tests only
 */
export function getQueryKeys(props: {
  id: WalletId;
  formatFn?: (str: string) => string;
}) {
  if (typeof props.formatFn === "function") {
    return [
      "walletName",
      props.id,
      { resolver: getFunctionId(props.formatFn) },
    ] as const;
  }
  return ["walletName", props.id] as const;
}

/**
 * @internal Exported for tests only
 */
export async function fetchWalletName(props: {
  id: WalletId;
  formatFn?: (str: string) => string;
}) {
  const info = await getWalletInfo(props.id);
  if (typeof props.formatFn === "function") {
    return props.formatFn(info.name);
  }
  return info.name;
}
