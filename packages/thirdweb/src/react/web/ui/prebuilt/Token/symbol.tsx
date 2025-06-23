"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type React from "react";
import type { JSX } from "react";
import type { Chain } from "../../../../../chains/types.js";
import { getChainMetadata } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { getContract } from "../../../../../contract/contract.js";
import { getContractMetadata } from "../../../../../extensions/common/read/getContractMetadata.js";
import { symbol } from "../../../../../extensions/common/read/symbol.js";
import { getFunctionId } from "../../../../../utils/function-id.js";
import { useTokenContext } from "./provider.js";

/**
 * Props for the TokenSymbol component
 * @component
 * @token
 */
export interface TokenSymbolProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * This prop can be a string or a (async) function that resolves to a string, representing the symbol of the token
   * This is particularly useful if you already have a way to fetch the token symbol.
   */
  symbolResolver?: string | (() => string) | (() => Promise<string>);
  /**
   * A function to format the symbol's value
   * Particularly useful to avoid overflowing-UI issues
   *
   * ```tsx
   * <TokenSymbol formatFn={(str: string) => doSomething()} />
   * ```
   */
  formatFn?: (str: string) => string;
  /**
   * This component will be shown while the symbol of the token is being fetched
   * If not passed, the component will return `null`.
   *
   * You can/should pass a loading sign or spinner to this prop.
   * @example
   * ```tsx
   * <TokenSymbol loadingComponent={<Spinner />} />
   * ```
   */
  loadingComponent?: JSX.Element;
  /**
   * This component will be shown if the symbol fails to be retreived
   * If not passed, the component will return `null`.
   *
   * You can/should pass a descriptive text/component to this prop, indicating that the
   * symbol was not fetched successfully
   * @example
   * ```tsx
   * <TokenSymbol fallbackComponent={"Failed to load"}
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
 * This component fetches then shows the symbol of a token. For ERC20 tokens, it calls the `symbol` function in the ERC20 contract.
 * It inherits all the attributes of a HTML <span> component, hence you can style it just like how you would style a normal <span>
 *
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { TokenProvider, TokenSymbol } from "thirdweb/react";
 * import { ethereum } from "thirdweb/chains";
 *
 * <TokenProvider {...props}>
 *   <TokenSymbol  />
 * </TokenProvider>
 * ```
 * Result:
 * ```html
 * <span>ETH</span>
 * ```
 *
 * ### Custom symbol resolver
 * By default, TokenSymbol calls the `symbol` function of your contract,
 * however, if your token as an unconventional way to fetch the symbol, you can pass the custom logic to the `symbolResolver` prop.
 * It can either be a string or a function (async) that returns or resolves to a string.
 * ```tsx
 * async function getSymbol() {
 *   // your own fetching logic
 *   return "the symbol";
 * }
 *
 * <TokenSymbol symbolResolver={getSymbol} />
 * ```
 * Alternatively, you can pass in a string directly:
 * ```tsx
 * <TokenSymbol symbolResolver="USDC.e" />
 * ```
 *
 * ### Format the symbol (capitalize, truncate, etc.)
 * The TokenSymbol component accepts a `formatFn` which takes in a string and outputs a string
 * The function is used to modify the symbol of the token
 *
 * ```tsx
 * const concatStr = (str: string):string => str + "Token"
 *
 * <TokenSymbol formatFn={concatStr} />
 * ```
 *
 * Result:
 * ```html
 * <span>Ether Token</span>
 * ```
 *
 * ### Show a loading sign when the symbol is being fetched
 * ```tsx
 * import { TokenProvider, TokenSymbol } from "thirdweb/react";
 *
 * <TokenProvider address="0x...">
 *   <TokenSymbol loadingComponent={<Spinner />} />
 * </TokenProvider>
 * ```
 *
 * ### Fallback to something when the symbol fails to resolve
 * ```tsx
 * <TokenProvider address="0x...">
 *   <TokenSymbol fallbackComponent={"Failed to load"} />
 * </TokenProvider>
 * ```
 *
 * ### Custom query options for useQuery
 * This component uses `@tanstack-query`'s useQuery internally.
 * You can use the `queryOptions` prop for more fine-grained control
 * ```tsx
 * <TokenSymbol queryOptions={{
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
export function TokenSymbol({
  symbolResolver,
  formatFn,
  loadingComponent,
  fallbackComponent,
  queryOptions,
  ...restProps
}: TokenSymbolProps) {
  const { address, client, chain } = useTokenContext();
  const symbolQuery = useQuery({
    queryFn: async () =>
      fetchTokenSymbol({ address, chain, client, symbolResolver }),
    queryKey: getQueryKeys({ address, chainId: chain.id, symbolResolver }),
    ...queryOptions,
  });

  if (symbolQuery.isLoading) {
    return loadingComponent || null;
  }

  if (!symbolQuery.data) {
    return fallbackComponent || null;
  }

  if (formatFn && typeof formatFn === "function") {
    return <span {...restProps}>{formatFn(symbolQuery.data)}</span>;
  }

  return <span {...restProps}>{symbolQuery.data}</span>;
}

/**
 * @internal Exported for tests only
 */
export async function fetchTokenSymbol(props: {
  address: string;
  client: ThirdwebClient;
  chain: Chain;
  symbolResolver?: string | (() => string) | (() => Promise<string>);
}): Promise<string> {
  const { symbolResolver, address, client, chain } = props;
  if (typeof symbolResolver === "string") {
    return symbolResolver;
  }
  if (typeof symbolResolver === "function") {
    return symbolResolver();
  }
  if (address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()) {
    // Don't wanna use `getChainSymbol` because it has some side effect (it catches error and defaults to "ETH")
    return getChainMetadata(chain).then((data) => data.nativeCurrency.symbol);
  }

  // Try to fetch the symbol from both the `symbol` function and the contract metadata
  // then prioritize its result
  const contract = getContract({ address, chain, client });
  const [_symbol, contractMetadata] = await Promise.all([
    symbol({ contract }).catch(() => undefined),
    getContractMetadata({ contract }).catch(() => undefined),
  ]);
  if (typeof _symbol === "string") {
    return _symbol;
  }
  if (typeof contractMetadata?.symbol === "string") {
    return contractMetadata.symbol;
  }
  throw new Error(
    "Failed to resolve symbol from both symbol() and contract metadata",
  );
}

/**
 * @internal
 */
export function getQueryKeys(props: {
  chainId: number;
  address: string;
  symbolResolver?: string | (() => string) | (() => Promise<string>);
}) {
  const { chainId, address, symbolResolver } = props;
  return [
    "_internal_token_symbol_",
    chainId,
    address,
    {
      resolver:
        typeof symbolResolver === "string"
          ? symbolResolver
          : typeof symbolResolver === "function"
            ? getFunctionId(symbolResolver)
            : undefined,
    },
  ] as const;
}
