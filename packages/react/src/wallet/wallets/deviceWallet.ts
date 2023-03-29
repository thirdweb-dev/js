import type { WalletOptions, Wallet } from "@thirdweb-dev/react-core";
import {
  createAsyncLocalStorage,
  ConnectParams,
  DeviceWalletConnectionArgs,
  DeviceBrowserWallet as DeviceWalletCore,
} from "@thirdweb-dev/wallets";

// ---

const deviceWalletStorage = createAsyncLocalStorage("deviceWallet");
export class DeviceWallet extends DeviceWalletCore {
  static getStoredData() {
    const key = DeviceWalletCore.getDataStorageKey();
    return deviceWalletStorage.getItem(key);
  }

  static getStoredAddress() {
    const key = DeviceWalletCore.getAddressStorageKey();
    return deviceWalletStorage.getItem(key);
  }

  async autoConnect(): Promise<string | undefined> {
    return;
  }

  // enforcing that connectOptions is required and not optional
  connect(connectOptions: ConnectParams<DeviceWalletConnectionArgs>) {
    // do not save params because it contains the password
    return super.connect({ ...connectOptions, saveParams: false });
  }
}

export const deviceWallet = () => {
  return {
    id: DeviceWallet.id,
    meta: DeviceWallet.meta,
    create: (options: WalletOptions) =>
      new DeviceWallet({
        ...options,
        storage: deviceWalletStorage,
        storageType: "asyncStore",
      }),
  } satisfies Wallet;
};
