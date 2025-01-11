"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { Address } from "abitype";
import type React from "react";
import type { JSX } from "react";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { convertCryptoToFiat } from "../../../../../exports/pay.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import { useActiveWalletChain } from "../../../../../react/core/hooks/wallets/useActiveWalletChain.js";
import { isAddress } from "../../../../../utils/address.js";
import { formatNumber } from "../../../../../utils/formatNumber.js";
import { shortenLargeNumber } from "../../../../../utils/shortenLargeNumber.js";
import { getWalletBalance } from "../../../../../wallets/utils/getWalletBalance.js";
import { useAccountContext } from "./provider.js";

/**
 * @component
 * @wallet
 */
export type AccountBalanceInfo = {
  /**
   * Represents either token balance or fiat balance.
   */
  balance: number;
  /**
   * Represents either token symbol or fiat symbol
   */
  symbol: string;
};

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
    queryKey: [
      "internal_account_balance",
      chainToLoad?.id || -1,
      address,
      { tokenAddress },
      showBalanceInFiat,
    ] as const,
    queryFn: async (): Promise<AccountBalanceInfo> =>
      loadAccountBalance({
        chain: chainToLoad,
        client,
        address,
        tokenAddress,
        showBalanceInFiat,
      }),
    retry: false,
    ...queryOptions,
  });

  if (balanceQuery.isLoading) {
    return loadingComponent || null;
  }

  if (!balanceQuery.data) {
    return fallbackComponent || null;
  }

  // Prioritize using the formatFn from users
  if (formatFn) {
    return <span {...restProps}>{formatFn(balanceQuery.data)}</span>;
  }

  if (showBalanceInFiat) {
    return (
      <span {...restProps}>
        {formatAccountFiatBalance({ ...balanceQuery.data, decimals: 0 })}
      </span>
    );
  }

  return (
    <span {...restProps}>
      {formatAccountTokenBalance({
        ...balanceQuery.data,
        decimals: balanceQuery.data.balance < 1 ? 3 : 2,
      })}
    </span>
  );
}

/**
 * @internal Exported for tests
 */
export async function loadAccountBalance(props: {
  chain?: Chain;
  client: ThirdwebClient;
  address: Address;
  tokenAddress?: Address;
  showBalanceInFiat?: SupportedFiatCurrency;
}): Promise<AccountBalanceInfo> {
  const { chain, client, address, tokenAddress, showBalanceInFiat } = props;
  if (!chain) {
    throw new Error("chain is required");
  }

  if (
    tokenAddress &&
    tokenAddress?.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()
  ) {
    throw new Error(`Invalid tokenAddress - cannot be ${NATIVE_TOKEN_ADDRESS}`);
  }

  if (!isAddress(address)) {
    throw new Error("Invalid wallet address. Expected an EVM address");
  }

  if (tokenAddress && !isAddress(tokenAddress)) {
    throw new Error("Invalid tokenAddress. Expected an EVM contract address");
  }

  const tokenBalanceData = await getWalletBalance({
    chain,
    client,
    address,
    tokenAddress,
  }).catch(() => undefined);

  if (!tokenBalanceData) {
    throw new Error(
      `Failed to retrieve ${tokenAddress ? `token: ${tokenAddress}` : "native token"} balance for address: ${address} on chainId:${chain.id}`,
    );
  }

  if (showBalanceInFiat) {
    const fiatData = await convertCryptoToFiat({
      fromAmount: Number(tokenBalanceData.displayValue),
      fromTokenAddress: tokenAddress || NATIVE_TOKEN_ADDRESS,
      to: showBalanceInFiat,
      chain,
      client,
    }).catch(() => undefined);

    if (fiatData === undefined) {
      throw new Error(
        `Failed to resolve fiat value for ${tokenAddress ? `token: ${tokenAddress}` : "native token"} on chainId: ${chain.id}`,
      );
    }
    return {
      balance: fiatData?.result,
      symbol:
        new Intl.NumberFormat("en", {
          style: "currency",
          currency: showBalanceInFiat,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
          .formatToParts(0)
          .find((p) => p.type === "currency")?.value ||
        showBalanceInFiat.toUpperCase(),
    };
  }

  return {
    balance: Number(tokenBalanceData.displayValue),
    symbol: tokenBalanceData.symbol,
  };
}

/**
 * Format the display balance for both crypto and fiat, in the Details button and Modal
 * If both crypto balance and fiat balance exist, we have to keep the string very short to avoid UI issues.
 * @internal
 * Used internally for the Details button and the Details Modal
 */
export function formatAccountTokenBalance(
  props: AccountBalanceInfo & { decimals: number },
): string {
  const formattedTokenBalance = formatNumber(props.balance, props.decimals);
  return `${formattedTokenBalance} ${props.symbol}`;
}

/**
 * Used internally for the Details button and Details Modal
 * @internal
 */
export function formatAccountFiatBalance(
  props: AccountBalanceInfo & { decimals: number },
) {
  const num = formatNumber(props.balance, props.decimals);
  // Need to keep them short to avoid UI overflow issues
  const formattedFiatBalance = shortenLargeNumber(num);
  return `${props.symbol}${formattedFiatBalance}`;
}
