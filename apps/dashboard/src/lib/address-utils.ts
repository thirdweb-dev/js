import { isEnsName } from "./ens";
import { utils } from "ethers";

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
