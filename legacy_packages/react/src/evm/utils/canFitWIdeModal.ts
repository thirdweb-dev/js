import { wideModalScreenThreshold } from "../../wallet/ConnectWallet/constants";

/**
 * Return true if the current screen size can fit the the wide connect modal
 * @internal
 */
export function canFitWideModal(): boolean {
  if (typeof window !== "undefined") {
    return window.innerWidth >= wideModalScreenThreshold;
  }
  return false;
}
