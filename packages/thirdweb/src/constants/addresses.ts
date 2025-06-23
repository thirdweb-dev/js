import { getAddress } from "src/utils/address.js";

/**
 * The address of the native token.
 */
export const NATIVE_TOKEN_ADDRESS =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

/**
 * @internal
 */
export function isNativeTokenAddress(address: string) {
  return getAddress(address) === getAddress(NATIVE_TOKEN_ADDRESS);
}

/**
 * The zero address in Ethereum, represented as a hexadecimal string.
 */
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
