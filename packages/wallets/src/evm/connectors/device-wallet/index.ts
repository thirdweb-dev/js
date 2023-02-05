import { AbstractBrowserWallet, WalletOptions } from "../../wallets/base";
import type { DeviceWalletConnector } from "./connectors/device-wallet-connector";

export class DeviceBrowserWallet extends AbstractBrowserWallet {
  #connector?: DeviceWalletConnector;

  static id = "deviceWallet" as const;
  public get walletName() {
    return "Device Wallet" as const;
  }

  constructor(options: WalletOptions) {
    super(DeviceBrowserWallet.id, options);
  }

  protected async getConnector(): Promise<DeviceWalletConnector> {
    if (!this.#connector) {
      // import the connector dynamically
      const { DeviceWalletConnector } = await import(
        "./connectors/device-wallet-connector"
      );
      this.#connector = new DeviceWalletConnector({
        chains: this.chains,
        options: {
          name: this.options.appName,
        },
      });
    }
    return this.#connector;
  }
}
