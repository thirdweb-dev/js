import { useEffect, useState } from "react";
import { useWallet } from "../../core/hooks/wallet-hooks";

export const usePersonalWalletAddress = () => {
  const [personalWalletAddress, setPersonalWalletAddress] = useState<
    string | undefined
  >();
  const activeWallet = useWallet();

  useEffect(() => {
    (async () => {
      if (activeWallet) {
        const possiblePersonalWallet = activeWallet?.getPersonalWallet();
        if (possiblePersonalWallet) {
          const address = await (
            await possiblePersonalWallet?.getSigner()
          )?.getAddress();
          setPersonalWalletAddress(address);
        } else {
          setPersonalWalletAddress(undefined);
        }
      } else {
        setPersonalWalletAddress(undefined);
      }
    })();
  }, [activeWallet]);

  return personalWalletAddress;
};
