import { isAddress } from "thirdweb";
import { isValidENSName } from "thirdweb/utils";

// if a string is a valid address or ens name
export function isPossibleEVMAddress(address?: string, ignoreEns?: boolean) {
  if (!address) {
    return false;
  }
  if (isValidENSName(address) && !ignoreEns) {
    return true;
  }
  return isAddress(address);
}
