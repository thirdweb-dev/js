import { NATIVE_TOKEN_ADDRESS } from "../../constants/currency";
import { constants } from "ethers";

export function isNativeToken(tokenAddress: string): boolean {
  return (
    tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS ||
    tokenAddress.toLowerCase() === constants.AddressZero
  );
}
