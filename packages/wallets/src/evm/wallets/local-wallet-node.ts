import { WalletOptions } from "..";
import { AsyncJsonFileStorage } from "../../core/AsyncJsonFileStorage";
import { LocalWallet, LocalWalletOptions } from "./local-wallet";

/**
 * @wallet
 */
export class LocalWalletNode extends LocalWallet {
  constructor(
    options?: WalletOptions<LocalWalletOptions> & { storageJsonFile?: string },
  ) {
    const storage = new AsyncJsonFileStorage(
      options?.storageJsonFile || "./wallet.json",
    );
    super({ storage, ...options });
  }
}
