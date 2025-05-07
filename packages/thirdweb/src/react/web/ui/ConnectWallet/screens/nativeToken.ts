import {
  NATIVE_TOKEN_ADDRESS,
  ZERO_ADDRESS,
} from "../../../../../constants/addresses.js";
import { type Address, getAddress } from "../../../../../utils/address.js";
import type { TokenInfo } from "../../../../core/utils/defaultTokens.js";

export type NativeToken = { nativeToken: true };

export const NATIVE_TOKEN: NativeToken = { nativeToken: true };

/**
 * @internal
 */
export function isNativeToken(
  token?: Partial<TokenInfo> | NativeToken,
): token is NativeToken {
  return (
    (token &&
      ("nativeToken" in token ||
        token.address?.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase() ||
        token?.address === ZERO_ADDRESS)) ||
    false
  );
}

export function getTokenAddress(token: TokenInfo | NativeToken): Address {
  if (isNativeToken(token)) {
    return NATIVE_TOKEN_ADDRESS;
  }
  return getAddress(token.address);
}

export type ERC20OrNativeToken = TokenInfo | NativeToken;
