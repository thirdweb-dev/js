import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import type { TokenInfo } from "../../../../core/utils/defaultTokens.js";

export type NativeToken = { nativeToken: true };

export const NATIVE_TOKEN: NativeToken = { nativeToken: true };

/**
 * @internal
 */
export function isNativeToken(
  token: Partial<TokenInfo> | NativeToken,
): token is NativeToken {
  return (
    "nativeToken" in token ||
    token.address?.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()
  );
}

export type ERC20OrNativeToken = TokenInfo | NativeToken;
