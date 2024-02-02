import { wideModalScreenThreshold } from "../../wallet/ConnectWallet/constants";

/**
 * Return true if the current screen size can fit the the wide connect modal
 * @internal
 */
export function canFitWideModal(): boolean {
  return window.innerWidth >= wideModalScreenThreshold;
}
