import { useEffect, useState } from "react";
import { useWallet } from "../../core/hooks/wallet-hooks";

export const usePersonalWalletAddress = () => {
  const [personalWalletAddress, setPersonalWalletAddress] = useState<
    string | undefined
  >();
  const activeWallet = useWallet();

  useEffect(() => {
    (async () => {
      const possiblePersonalWallet = activeWallet?.getPersonalWallet();

      if (!possiblePersonalWallet) {
        setPersonalWalletAddress(undefined);
        return;
      }

      const address = await (
        await possiblePersonalWallet?.getSigner()
      )?.getAddress();
      setPersonalWalletAddress(address);
    })();
  }, [activeWallet]);

  return personalWalletAddress;
};
