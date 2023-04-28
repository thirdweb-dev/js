import {
  useThirdwebWallet,
  useWallets as useWalletsCore,
} from "@thirdweb-dev/react-core";
import { LocalWallet } from "@thirdweb-dev/wallets";
import { useMemo, useRef } from "react";

/**
 *
 * @returns `supportedWallets` configured in the `<ThirdwebProvider/>`
 */
export function useWallets() {
  const context = useThirdwebWallet();
  const guestMode = context?.guestMode;
  const supportedWallets = useWalletsCore();
  const removedGuestWalletRef = useRef(false);

  const wallets = useMemo(() => {
    if (
      guestMode &&
      supportedWallets[supportedWallets.length - 1].id === LocalWallet.id &&
      !removedGuestWalletRef.current
    ) {
      removedGuestWalletRef.current = true;
      return supportedWallets.slice(0, supportedWallets.length - 1);
    }

    return supportedWallets;
  }, [guestMode, supportedWallets]);

  return wallets;
}
