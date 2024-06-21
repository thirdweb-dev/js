import { utils } from "ethers";
import { isEnsName } from "./ens";

// if a string is a valid address or ens name
export function isPossibleEVMAddress(address?: string, ignoreEns?: boolean) {
  if (!address) {
    return false;
  }
  if (isEnsName(address) && !ignoreEns) {
    return true;
  }
  return utils.isAddress(address);
}
