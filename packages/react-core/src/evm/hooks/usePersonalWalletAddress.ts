import { useEffect, useState } from "react";
import { useWallet } from "../../core/hooks/wallet-hooks";

/**
 * Hook for getting the address of the personal wallet connected to the current wallet connection.
 *
 * This is only relevant if the current connected wallet uses a personal wallet - For Example - Smart Wallet and Safe.
 * @walletConnection
 */
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
