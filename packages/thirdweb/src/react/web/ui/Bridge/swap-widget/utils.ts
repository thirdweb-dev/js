import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { getAddress } from "../../../../../utils/address.js";
import type { TokenSelection } from "./types.js";

export function cleanedChainName(name: string) {
  return name.replace("Mainnet", "");
}

export function isTokenSelectionNativeToken(token: TokenSelection) {
  if (!token.tokenAddress) {
    return true;
  }
  return getAddress(token.tokenAddress) === getAddress(NATIVE_TOKEN_ADDRESS);
}
