import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import { convertCryptoToFiat } from "../../../pay/convert/cryptoToFiat.js";
import {
  getFiatSymbol,
  type SupportedFiatCurrency,
} from "../../../pay/convert/type.js";
import { type Address, isAddress } from "../../../utils/address.js";
import { formatNumber } from "../../../utils/formatNumber.js";
import { shortenLargeNumber } from "../../../utils/shortenLargeNumber.js";
import { getWalletBalance } from "../../../wallets/utils/getWalletBalance.js";

export const COLOR_OPTIONS = [
  ["#fca5a5", "#b91c1c"],
  ["#fdba74", "#c2410c"],
  ["#fcd34d", "#b45309"],
  ["#fde047", "#a16207"],
  ["#a3e635", "#4d7c0f"],
  ["#86efac", "#15803d"],
  ["#67e8f9", "#0e7490"],
  ["#7dd3fc", "#0369a1"],
  ["#93c5fd", "#1d4ed8"],
  ["#a5b4fc", "#4338ca"],
  ["#c4b5fd", "#6d28d9"],
  ["#d8b4fe", "#7e22ce"],
  ["#f0abfc", "#a21caf"],
  ["#f9a8d4", "#be185d"],
  ["#fda4af", "#be123c"],
];

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
    address,
    chain,
    client,
    tokenAddress,
  }).catch(() => undefined);

  if (!tokenBalanceData) {
    throw new Error(
      `Failed to retrieve ${tokenAddress ? `token: ${tokenAddress}` : "native token"} balance for address: ${address} on chainId:${chain.id}`,
    );
  }

  if (showBalanceInFiat) {
    const fiatData = await convertCryptoToFiat({
      chain,
      client,
      fromAmount: Number(tokenBalanceData.displayValue),
      fromTokenAddress: tokenAddress || NATIVE_TOKEN_ADDRESS,
      to: showBalanceInFiat,
    }).catch(() => undefined);

    if (fiatData === undefined) {
      throw new Error(
        `Failed to resolve fiat value for ${tokenAddress ? `token: ${tokenAddress}` : "native token"} on chainId: ${chain.id}`,
      );
    }
    const result = {
      balance: fiatData?.result,
      symbol: getFiatSymbol(showBalanceInFiat),
    };

    return result;
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
