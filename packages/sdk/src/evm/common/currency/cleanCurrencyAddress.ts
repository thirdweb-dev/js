import { NATIVE_TOKEN_ADDRESS } from "../../constants/currency";
import { isNativeToken } from "./isNativeToken";

/**
 * @internal
 */
export function cleanCurrencyAddress(currencyAddress: string): string {
  if (isNativeToken(currencyAddress)) {
    return NATIVE_TOKEN_ADDRESS;
  }
  return currencyAddress;
}
