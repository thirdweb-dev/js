"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type React from "react";
import type { JSX } from "react";
import type { Chain } from "../../../../../chains/types.js";
import { useActiveWalletChain } from "../../../../../react/core/hooks/wallets/useActiveWalletChain.js";
import {
  type GetWalletBalanceResult,
  getWalletBalance,
} from "../../../../../wallets/utils/getWalletBalance.js";
import { useAccountContext } from "./provider.js";

/**
 * Props for the AccountBalance component
 * @component
 * @wallet
 */
export interface AccountBalanceProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * The network to fetch balance on
   * If not passed, the component will use the current chain that the wallet is connected to (`useActiveWalletChain()`)
   */
  chain?: Chain;
  /**
   * By default this component will fetch the balance for the native token on a given chain
   * If you want to fetch balance for an ERC20 token, use the `tokenAddress` props
   */
  tokenAddress?: string;
  /**
   * A function to format the balance's display value
   * use this function to transform the balance display value like round up the number
   * Particularly useful to avoid overflowing-UI issues
   */
  formatFn?: (num: number) => number;
  /**
   * This component will be shown while the balance of the account is being fetched
   * If not passed, the component will return `null`.
   *
   * You can/should pass a loading sign or spinner to this prop.
   * @example
   * ```tsx
   * <AccountBalance
   *   chain={ethereum}
   *   loadingComponent={<Spinner />}
   * />
   * ```
   */
  loadingComponent?: JSX.Element;
  /**
   * This component will be shown if the balance fails to be retreived
   * If not passed, the component will return `null`.
   *
   * You can/should pass a descriptive text/component to this prop, indicating that the
   * balance was not fetched succesfully
   * @example
   * ```tsx
   * <AccountBalance
   *   chain={nonExistentChain}
   *   fallbackComponent={"Failed to load"}
   * />
   * ```
   */
  fallbackComponent?: JSX.Element;
  /**
   * Optional `useQuery` params
   */
  queryOptions?: Omit<
    UseQueryOptions<GetWalletBalanceResult>,
    "queryFn" | "queryKey"
  >;
}

/**
 * This component fetches and shows the balance of the wallet address on a given chain.
 * It inherits all the attributes of a HTML <span> component, hence you can style it just like how you would style a normal <span>
 *
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { AccountProvider, AccountBalance } from "thirdweb/react";
 * import { ethereum } from "thirdweb/chains";
 *
 * <AccountProvider address="0x...">
 *   <AccountBalance chain={ethereum} />
 * </AccountProvider>
 * ```
 * Result:
 * ```html
 * <span>1.091435 ETH</span>
 * ```
 *
 *
 * ### Format the balance (round up, shorten etc.)
 * The AccountBalance component accepts a `formatFn` which takes in a number and outputs a number
 * The function is used to modify the display value of the wallet balance
 *
 * ```tsx
 * const roundTo1Decimal = (num: number):number => Math.round(num * 10) / 10;
 *
 * <AccountBalance formatFn={roundTo1Decimal} />
 * ```
 *
 * Result:
 * ```html
 * <span>1.1 ETH</span>
 * ```
 *
 * ### Show a loading sign when the balance is being fetched
 * ```tsx
 * import { AccountProvider, AccountBalance } from "thirdweb/react";
 *
 * <AccountProvider address="0x...">
 *   <AccountBalance
 *     chain={ethereum}
 *     loadingComponent={<Spinner />}
 *   />
 * </AccountProvider>
 * ```
 *
 * ### Fallback to something when the balance fails to resolve
 * ```tsx
 * <AccountProvider address="0x...">
 *   <AccountBalance
 *     chain={nonExistentChain}
 *     fallbackComponent={"Failed to load"}
 *   />
 * </AccountProvider>
 * ```
 *
 * ### Custom query options for useQuery
 * This component uses `@tanstack-query`'s useQuery internally.
 * You can use the `queryOptions` prop for more fine-grained control
 * ```tsx
 * <AccountBalance
 *   queryOptions={{
 *     enabled: isEnabled,
 *     retry: 4,
 *   }}
 * />
 * ```
 *
 * @component
 * @wallet
 * @beta
 */
export function AccountBalance({
  chain,
  tokenAddress,
  formatFn,
  loadingComponent,
  fallbackComponent,
  queryOptions,
  ...restProps
}: AccountBalanceProps) {
  const { address, client } = useAccountContext();
  const walletChain = useActiveWalletChain();
  const chainToLoad = chain || walletChain;
  const balanceQuery = useQuery({
    queryKey: [
      "walletBalance",
      chainToLoad?.id || -1,
      address || "0x0",
      { tokenAddress },
    ] as const,
    queryFn: async () => {
      if (!chainToLoad) {
        throw new Error("chain is required");
      }
      if (!client) {
        throw new Error("client is required");
      }
      return getWalletBalance({
        chain: chainToLoad,
        client,
        address,
        tokenAddress,
      });
    },
    ...queryOptions,
  });

  if (balanceQuery.isLoading) {
    return loadingComponent || null;
  }

  if (!balanceQuery.data) {
    return fallbackComponent || null;
  }

  const displayValue = formatFn
    ? formatFn(Number(balanceQuery.data.displayValue))
    : balanceQuery.data.displayValue;

  return (
    <span {...restProps}>
      {displayValue} {balanceQuery.data.symbol}
    </span>
  );
}
