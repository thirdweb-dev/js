import { isEnsName } from "components/contract-components/hooks";
import { isAddress } from "thirdweb";

// if a string is a valid address or ens name
export function isPossibleEVMAddress(address?: string, ignoreEns?: boolean) {
  if (!address) {
    return false;
  }
  if (isEnsName(address) && !ignoreEns) {
    return true;
  }
  return isAddress(address);
}
