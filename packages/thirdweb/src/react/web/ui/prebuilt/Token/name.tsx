"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type React from "react";
import type { JSX } from "react";
import { getChainMetadata } from "../../../../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { getContract } from "../../../../../contract/contract.js";
import { getContractMetadata } from "../../../../../extensions/common/read/getContractMetadata.js";
import { name } from "../../../../../extensions/common/read/name.js";
import { useTokenContext } from "./provider.js";

/**
 * Props for the TokenName component
 * @component
 * @token
 */
export interface TokenNameProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * This prop can be a string or a (async) function that resolves to a string, representing the name of the token
   * This is particularly useful if you already have a way to fetch the token name.
   */
  nameResolver?: string | (() => string) | (() => Promise<string>);
  /**
   * A function to format the name's display value
   * Particularly useful to avoid overflowing-UI issues
   *
   * ```tsx
   * <TokenName formatFn={(str: string) => doSomething()} />
   * ```
   */
  formatFn?: (str: string) => string;
  /**
   * This component will be shown while the name of the token is being fetched
   * If not passed, the component will return `null`.
   *
   * You can/should pass a loading sign or spinner to this prop.
   * @example
   * ```tsx
   * <TokenName loadingComponent={<Spinner />} />
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
   * <TokenName fallbackComponent={"Failed to load"}
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
 * This component fetches then shows the name of a token. For ERC20 tokens, it calls the `name` function in the ERC20 contract.
 * It inherits all the attributes of a HTML <span> component, hence you can style it just like how you would style a normal <span>
 *
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { TokenProvider, TokenName } from "thirdweb/react";
 * import { ethereum } from "thirdweb/chains";
 *
 * <TokenProvider {...props}>
 *   <TokenName  />
 * </TokenProvider>
 * ```
 * Result:
 * ```html
 * <span>Ether</span>
 * ```
 *
 * ### Custom name resolver
 * By default TokenName will call the `name` method of the token contract.
 * However if you have a different way to fetch the name, you can pass the function to the `nameResolver` prop.
 * Note: nameResolver should either be a string or a function (async) that returns a string.
 * ```tsx
 * async function fetchNameMethod() {
 *   // your own fetching logic
 *   return "the token name";
 * }
 *
 * <TokenName nameResolver={fetchNameMethod} />
 * ```
 *
 * Alternatively you can also pass in a string directly:
 * ```tsx
 * <TokenName nameResolver="USD Coin Circle" />
 * ```
 *
 *
 * ### Format the name (capitalize, truncate, etc.)
 * The TokenName component accepts a `formatFn` which takes in a string and outputs a string
 * The function is used to modify the name of the token
 *
 * ```tsx
 * const concatStr = (str: string):string => str + "Token"
 *
 * <TokenName formatFn={concatStr} />
 * ```
 *
 * Result:
 * ```html
 * <span>Ether Token</span>
 * ```
 *
 * ### Show a loading sign when the name is being fetched
 * ```tsx
 * import { TokenProvider, TokenName } from "thirdweb/react";
 *
 * <TokenProvider address="0x...">
 *   <TokenName loadingComponent={<Spinner />} />
 * </TokenProvider>
 * ```
 *
 * ### Fallback to something when the name fails to resolve
 * ```tsx
 * <TokenProvider address="0x...">
 *   <TokenName fallbackComponent={"Failed to load"} />
 * </TokenProvider>
 * ```
 *
 * ### Custom query options for useQuery
 * This component uses `@tanstack-query`'s useQuery internally.
 * You can use the `queryOptions` prop for more fine-grained control
 * ```tsx
 * <TokenName
 *   queryOptions={{
 *     enabled: isEnabled,
 *     retry: 4,
 *   }}
 * />
 * ```
 *
 * @component
 * @token
 * @beta
 */
export function TokenName({
  nameResolver,
  formatFn,
  loadingComponent,
  fallbackComponent,
  queryOptions,
  ...restProps
}: TokenNameProps) {
  const { address, client, chain } = useTokenContext();
  const nameQuery = useQuery({
    queryKey: ["_internal_token_name_", chain.id, address] as const,
    queryFn: async () => {
      if (typeof nameResolver === "string") {
        return nameResolver;
      }
      if (typeof nameResolver === "function") {
        return nameResolver();
      }
      if (address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()) {
        // Don't wanna use `getChainNativeCurrencyName` because it has some side effect (it catches error and defaults to "ETH")
        return getChainMetadata(chain).then((data) => data.nativeCurrency.name);
      }
      // Try to fetch the name from both the `name()` function and the contract metadata
      // then prioritize the `name()`
      const contract = getContract({ address, client, chain });
      const [_name, contractMetadata] = await Promise.all([
        name({ contract }),
        getContractMetadata({ contract }),
      ]);
      if (!_name && !contractMetadata.name) {
        throw new Error(
          "Failed to resolve name from both name() and contract metadata",
        );
      }

      return _name || contractMetadata.name;
    },
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
