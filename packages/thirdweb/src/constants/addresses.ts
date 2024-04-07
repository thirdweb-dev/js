/**
 * The address of the native token.
 */
export const NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

/**
 * @internal
 */
export function isNativeTokenAddress(address: string) {
  return address.toLowerCase() === NATIVE_TOKEN_ADDRESS;
}

/**
 * The zero address in Ethereum, represented as a hexadecimal string.
 */
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
