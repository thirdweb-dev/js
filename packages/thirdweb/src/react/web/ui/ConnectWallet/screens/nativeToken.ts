import type { TokenInfo } from "../defaultTokens.js";

export type NativeToken = { nativeToken: true };

export const NATIVE_TOKEN: NativeToken = { nativeToken: true };

/**
 * @internal
 */
export function isNativeToken(
  token: Partial<TokenInfo> | NativeToken,
): token is NativeToken {
  return "nativeToken" in token;
}

export type ERC20OrNativeToken = TokenInfo | NativeToken;
