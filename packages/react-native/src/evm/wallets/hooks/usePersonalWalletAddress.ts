import { useWallet } from "@thirdweb-dev/react-core";
import { AbstractClientWallet, SmartWallet } from "@thirdweb-dev/wallets";
import { useEffect, useState } from "react";

export const usePersonalWalletAddress = () => {
  const [personalWalletAddress, setPersonalWalletAddress] = useState<
    string | undefined
  >();
  const activeWallet = useWallet();

  useEffect(() => {
    (async () => {
      if (activeWallet?.walletId === SmartWallet.id) {
        const address = await (
          activeWallet.getPersonalWallet() as AbstractClientWallet
        ).getAddress();
        setPersonalWalletAddress(address);
      }
    })();
  }, [activeWallet]);

  return personalWalletAddress;
};
