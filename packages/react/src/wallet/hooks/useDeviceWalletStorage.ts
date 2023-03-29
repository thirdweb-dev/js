import { DeviceWallet } from "../wallets/deviceWallet";
import { useEffect, useState } from "react";

type DeviceWalletStorage = {
  data: string | null;
  address: string | null;
};

export function useDeviceWalletStorage() {
  const [_deviceWalletStorage, _setDeviceWalletStorage] = useState<
    DeviceWalletStorage | undefined
  >(undefined);

  useEffect(() => {
    Promise.all([
      DeviceWallet.getStoredData(),
      DeviceWallet.getStoredAddress(),
    ]).then(([_data, _address]) => {
      _setDeviceWalletStorage({
        data: _data,
        address: _address,
      });
    });
  }, []);

  return _deviceWalletStorage;
}
