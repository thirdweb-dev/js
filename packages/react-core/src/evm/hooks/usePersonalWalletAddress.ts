import { SmartWallet } from "@thirdweb-dev/wallets";
import { useEffect, useState } from "react";
import { useWallet } from "../../core/hooks/wallet-hooks";

export const usePersonalWalletAddress = () => {
  const [personalWalletAddress, setPersonalWalletAddress] = useState<
    string | undefined
  >();
  const activeWallet = useWallet();

  useEffect(() => {
    (async () => {
      if (activeWallet?.walletId === SmartWallet.id) {
        const address = await (
          await activeWallet.getPersonalWallet()?.getSigner()
        )?.getAddress();
        setPersonalWalletAddress(address);
      }
    })();
  }, [activeWallet]);

  return personalWalletAddress;
};
