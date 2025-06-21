"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type React from "react";
import type { JSX } from "react";
import type { Chain } from "../../../../../chains/types.js";
import { getChainMetadata } from "../../../../../chains/utils.js";
import { getFunctionId } from "../../../../../utils/function-id.js";
import { useChainContext } from "./provider.js";

/**
 * Props for the ChainName component
 * @component
 * @chain
 */
export interface ChainNameProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * This prop can be a string or a (async) function that resolves to a string, representing the name of the chain
   * This is particularly useful if you already have a way to fetch the chain name.
   */
  nameResolver?: string | (() => string) | (() => Promise<string>);
  /**
   * A function to format the name's display value
   * Particularly useful to avoid overflowing-UI issues
   *
   * ```tsx
   * <ChainName formatFn={(str: string) => doSomething()} />
   * ```
   */
  formatFn?: (str: string) => string;
  /**
   * This component will be shown while the name of the chain is being fetched
   * If not passed, the component will return `null`.
   *
   * You can/should pass a loading sign or spinner to this prop.
   * @example
   * ```tsx
   * <ChainName loadingComponent={<Spinner />} />
   * ```
   */
  loadingComponent?: JSX.Element;
  /**
   * This component will be shown if the name fails to be retreived
   * If not passed, the component will return `null`.
   *
   * You can/should pass a descriptive text/component to this prop, indicating that the
   * name was not fetched successfully
   * @example
   * ```tsx
   * <ChainName fallbackComponent={<span>Failed to load</span>}
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
 * This component fetches then shows the name of a chain.
 * It inherits all the attributes of a HTML <span> component, hence you can style it just like how you would style a normal <span>
 *
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { ChainProvider, ChainName } from "thirdweb/react";
 * import { ethereum } from "thirdweb/chains";
 *
 * <ChainProvider {...props}>
 *   <ChainName  />
 * </ChainProvider>
 * ```
 * Result:
 * ```html
 * <span>Ethereum Mainnet</span>
 * ```
 *
 * ### Custom name resolver
 * By default ChainName will call the thirdweb API to retrieve the chain name.
 * However if you have a different way to fetch the name, you can pass the function to the `nameResolver` prop.
 * Note: nameResolver should either be a string or a function (async) that returns a string.
 * ```tsx
 * async function fetchNameMethod() {
 *   // your own fetching logic
 *   return "the chain name";
 * }
 *
 * <ChainName nameResolver={fetchNameMethod} />
 * ```
 *
 * Alternatively you can also pass in a string directly:
 * ```tsx
 * <ChainName nameResolver="ETH Mainnet" />
 * ```
 *
 *
 * ### Format the name (capitalize, truncate, etc.)
 * The ChainName component accepts a `formatFn` which takes in a string and outputs a string
 * The function is used to modify the name of the chain
 *
 * ```tsx
 * const concatStr = (str: string):string => str + "Network"
 *
 * <ChainProvider {...props}>
 *   <ChainName formatFn={concatStr} />
 * </ChainProvider>
 * ```
 *
 * Result:
 * ```html
 * <span>Ethereum Mainnet Network</span>
 * ```
 *
 * ### Show a loading sign when the name is being fetched
 * ```tsx
 * import { ChainProvider, ChainName } from "thirdweb/react";
 *
 * <ChainProvider {...props}>
 *   <ChainName loadingComponent={<Spinner />} />
 * </ChainProvider>
 * ```
 *
 * ### Fallback to something when the name fails to resolve
 * ```tsx
 * <ChainProvider {...props}>
 *   <ChainName fallbackComponent={"Failed to load"} />
 * </ChainProvider>
 * ```
 *
 * ### Custom query options for useQuery
 * This component uses `@tanstack-query`'s useQuery internally.
 * You can use the `queryOptions` prop for more fine-grained control
 * ```tsx
 * <ChainName
 *   queryOptions={{
 *     enabled: isEnabled,
 *     retry: 4,
 *   }}
 * />
 * ```
 *
 * @component
 * @chain
 * @beta
 */
export function ChainName({
  nameResolver,
  formatFn,
  loadingComponent,
  fallbackComponent,
  queryOptions,
  ...restProps
}: ChainNameProps) {
  const { chain } = useChainContext();
  const nameQuery = useQuery({
    queryFn: async () => fetchChainName({ chain, nameResolver }),
    queryKey: getQueryKeys({ chainId: chain.id, nameResolver }),
    ...queryOptions,
  });

  if (nameQuery.isLoading) {
    return loadingComponent || null;
  }

  if (!nameQuery.data) {
    return fallbackComponent || null;
  }

  const displayValue = formatFn ? formatFn(nameQuery.data) : nameQuery.data;

  return <span {...restProps}>{displayValue}</span>;
}

/**
 * @internal Exported for tests only
 */
export async function fetchChainName(props: {
  chain: Chain;
  nameResolver?: string | (() => string) | (() => Promise<string>);
}) {
  const { nameResolver, chain } = props;
  if (typeof nameResolver === "string") {
    return nameResolver;
  }
  if (typeof nameResolver === "function") {
    return nameResolver();
  }
  if (chain.name) {
    return chain.name;
  }
  return getChainMetadata(chain).then((data) => data.name);
}

/**
 * @internal Exported for tests
 */
export function getQueryKeys(props: {
  chainId: number;
  nameResolver?: string | (() => string) | (() => Promise<string>);
}) {
  if (typeof props.nameResolver === "function") {
    return [
      "_internal_chain_name_",
      props.chainId,
      { resolver: getFunctionId(props.nameResolver) },
    ] as const;
  }
  return ["_internal_chain_name_", props.chainId] as const;
}
