import { NATIVE_TOKEN_ADDRESS } from "../../constants/currency";
import { isNativeToken } from "./isNativeToken";

export function cleanCurrencyAddress(currencyAddress: string): string {
  if (isNativeToken(currencyAddress)) {
    return NATIVE_TOKEN_ADDRESS;
  }
  return currencyAddress;
}
