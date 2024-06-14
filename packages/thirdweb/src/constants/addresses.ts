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
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * @deprecated Use {@link ZERO_ADDRESS}.
 */
export const ADDRESS_ZERO = ZERO_ADDRESS;
