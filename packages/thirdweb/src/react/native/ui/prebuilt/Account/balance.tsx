"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { Text, type TextProps } from "react-native";
import type { Chain } from "../../../../../chains/types.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import { useActiveWalletChain } from "../../../../../react/core/hooks/wallets/useActiveWalletChain.js";
import { getAddress } from "../../../../../utils/address.js";
import { useAccountContext } from "../../../../core/account/provider.js";
import {
  type AccountBalanceInfo,
  formatAccountFiatBalance,
  formatAccountTokenBalance,
  loadAccountBalance,
} from "../../../../core/utils/account.js";

/**
 * Props for the AccountBalance component
 * @component
 * @wallet
 */
export interface AccountBalanceProps extends Omit<TextProps, "children"> {
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
  formatFn?: (props: AccountBalanceInfo) => string;
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
  loadingComponent?: React.ComponentType;
  /**
   * This component will be shown if the balance fails to be retreived
   * If not passed, the component will return `null`.
   *
   * You can/should pass a descriptive text/component to this prop, indicating that the
   * balance was not fetched successfully
   * @example
   * ```tsx
   * <AccountBalance
   *   chain={nonExistentChain}
   *   fallbackComponent={"Failed to load"}
   * />
   * ```
   */
  fallbackComponent?: React.ComponentType;
  /**
   * Optional `useQuery` params
   */
  queryOptions?: Omit<
    UseQueryOptions<AccountBalanceInfo>,
    "queryFn" | "queryKey"
  >;

  /**
   * Show the token balance in a supported fiat currency (e.g "USD")
   */
  showBalanceInFiat?: SupportedFiatCurrency;
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
 * The AccountBalance component accepts a `formatFn` which takes in an object of type `AccountBalanceInfo` and outputs a string
 * The function is used to modify the display value of the wallet balance (either in crypto or fiat)
 *
 * ```tsx
 * import type { AccountBalanceInfo } from "thirdweb/react";
 * import { formatNumber } from "thirdweb/utils";
 *
 * const format = (props: AccountInfoBalance):string => `${formatNumber(props.balance, 1)} ${props.symbol.toLowerCase()}`
 *
 * <AccountBalance formatFn={format} />
 * ```
 *
 * Result:
 * ```html
 * <span>1.1 eth</span> // the balance is rounded up to 1 decimal and the symbol is lowercased
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
  loadingComponent,
  fallbackComponent,
  queryOptions,
  formatFn,
  showBalanceInFiat,
  ...restProps
}: AccountBalanceProps) {
  const { address, client } = useAccountContext();
  const walletChain = useActiveWalletChain();
  const chainToLoad = chain || walletChain;
  const balanceQuery = useQuery({
    queryFn: async (): Promise<AccountBalanceInfo> =>
      loadAccountBalance({
        address: getAddress(address),
        chain: chainToLoad,
        client,
        showBalanceInFiat,
        tokenAddress: tokenAddress ? getAddress(tokenAddress) : undefined,
      }),
    queryKey: [
      "internal_account_balance",
      chainToLoad?.id || -1,
      address,
      { tokenAddress },
      showBalanceInFiat,
    ] as const,
    retry: false,
    ...queryOptions,
  });

  if (balanceQuery.isLoading) {
    return loadingComponent || null;
  }

  if (balanceQuery.data === undefined) {
    return fallbackComponent || null;
  }

  // Prioritize using the formatFn from users
  if (formatFn) {
    return <Text {...restProps}>{formatFn(balanceQuery.data)}</Text>;
  }

  if (showBalanceInFiat) {
    return (
      <Text {...restProps}>
        {formatAccountFiatBalance({ ...balanceQuery.data, decimals: 2 })}
      </Text>
    );
  }

  return (
    <Text {...restProps}>
      {formatAccountTokenBalance({
        ...balanceQuery.data,
        decimals: balanceQuery.data.balance < 1 ? 3 : 2,
      })}
    </Text>
  );
}
