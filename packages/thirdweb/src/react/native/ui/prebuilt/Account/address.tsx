"use client";

import { Text, type TextProps } from "react-native";
import { useAccountContext } from "../../../../core/account/provider.js";

/**
 * @component
 * @wallet
 */
export interface AccountAddressProps extends Omit<TextProps, "children"> {
  /**
   * The function used to transform (format) the wallet address
   * Specifically useful for shortening the wallet.
   *
   * This function should take in a string and output a string
   */
  formatFn?: (str: string) => string;
  className?: string;
}

/**
 *
 * @returns a <span> containing the full wallet address of the account
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { AccountProvider, AccountAddress } from "thirdweb/react";
 *
 * <AccountProvider address="0x12345674b599ce99958242b3D3741e7b01841DF3" client={TW_CLIENT}>
 *   <AccountAddress />
 * </AccountProvider>
 * ```
 * Result:
 * ```html
 * <span>0x12345674b599ce99958242b3D3741e7b01841DF3</span>
 * ```
 *
 *
 * ### Shorten the address
 * ```tsx
 * import { AccountProvider, AccountAddress } from "thirdweb/react";
 * import { shortenAddress } from "thirdweb/utils";
 *
 * <AccountProvider address="0x12345674b599ce99958242b3D3741e7b01841DF3" client={TW_CLIENT}>
 *   <AccountAddress formatFn={shortenAddress} />
 * </AccountProvider>
 * ```
 * Result:
 * ```html
 * <span>0x1234...1DF3</span>
 * ```
 *
 * @component
 * @wallet
 * @beta
 */
export function AccountAddress({
  formatFn,
  ...restProps
}: AccountAddressProps) {
  const { address } = useAccountContext();
  const value = formatFn ? formatFn(address) : address;
  return <Text {...restProps}>{value}</Text>;
}
