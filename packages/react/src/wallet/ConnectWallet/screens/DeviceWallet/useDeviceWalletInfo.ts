import {
  useCreateWalletInstance,
  useSupportedWallet,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { Wallet } from "@thirdweb-dev/react-core";
import type { DeviceWallet } from "@thirdweb-dev/wallets";
import { WalletData } from "@thirdweb-dev/wallets/src/evm/wallets/device-wallet";

export function useDeviceWalletInfo() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const createWalletInstance = useCreateWalletInstance();
  const deviceWalletObj = useSupportedWallet("deviceWallet") as Wallet;
  const [deviceWallet, setDeviceWallet] = useState<DeviceWallet | null>(null);
  const [storageLoading, setStorageLoading] = useState(false);

  useEffect(() => {
    const wallet = createWalletInstance(deviceWalletObj) as DeviceWallet;
    setDeviceWallet(wallet);
    wallet.getSavedData().then((data) => {
      setStorageLoading(false);
      setWalletData(data);
    });
  }, [createWalletInstance, deviceWalletObj]);

  return {
    deviceWallet,
    storageLoading,
    walletData,
    meta: deviceWalletObj.meta,
    refreshSavedData() {
      if (!deviceWallet) {
        return;
      }
      deviceWallet.getSavedData().then((data) => {
        setStorageLoading(false);
        setWalletData(data);
      });
    },
  };
}
