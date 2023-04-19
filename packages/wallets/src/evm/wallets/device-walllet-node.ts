import { WalletOptions } from "..";
import { AsyncJsonFileStorage } from "../../core/AsyncJsonFileStorage";
import { DeviceWallet, DeviceWalletOptions } from "./device-wallet";

export class DeviceWalletNode extends DeviceWallet {
  constructor(
    options?: WalletOptions<DeviceWalletOptions> & { storageJsonFile?: string },
  ) {
    const storage = new AsyncJsonFileStorage(
      options?.storageJsonFile || "./wallet.json",
    );
    super({ storage, ...options });
  }
}
