import { TW_WC_PROJECT_ID } from "@thirdweb-dev/react-core";
import type { ExtraCoreWalletOptions } from "@thirdweb-dev/react-core";
import {
  DeviceWalletOptions as DeviceWalletCoreOptions,
  MetamaskWalletOptions as MetamaskCoreOptions,
  WalletConnectOptions,
  WalletConnectV1Options,
  WalletOptions,
  CoinbaseWalletOptions as CoinbaseWalletOptionsCore,
  PaperWalletOptions as PaperWalletOptionsCore,
  assertWindowEthereum,
  createAsyncLocalStorage,
} from "@thirdweb-dev/wallets";
import {
  CoinbaseWallet as CoinbaseWalletCore,
  DeviceBrowserWallet as DeviceWalletCore,
  MetaMask as MetamaskWalletCore,
  WalletConnect as WalletConnectCore,
  WalletConnectV1 as WalletConnectV1Core,
  PaperWallet as PaperWalletCore,
} from "@thirdweb-dev/wallets";

// Metamask ----------------------------------------

type MetamaskWalletOptions = Omit<
  MetamaskCoreOptions,
  "connectorStorage" | "walletStorage"
> &
  ExtraCoreWalletOptions;

export class MetamaskWallet extends MetamaskWalletCore {
  isInjected: boolean;
  constructor(options: MetamaskWalletOptions) {
    super({
      ...options,
    });
    if (assertWindowEthereum(globalThis.window)) {
      this.isInjected = !!globalThis.window.ethereum?.isMetaMask;
    } else {
      this.isInjected = false;
    }
  }
}

// WalletConnect v1 ----------------------------------------

type WC1Options = Omit<
  WalletOptions<WalletConnectV1Options>,
  "qrcode" | "walletStorage"
> &
  ExtraCoreWalletOptions;
export class WalletConnectV1 extends WalletConnectV1Core {
  constructor(options: WC1Options) {
    super({
      ...options,
      qrcode: true,
      dappMetadata: {
        ...options.dappMetadata,
        isDarkMode: options.theme === "dark",
      },
    });
  }
}

// WalletConnect v2 ----------------------------------------

type WC2Options = Omit<
  WalletOptions<WalletConnectOptions>,
  "projectId" | "qrcode" | "walletStorage"
> &
  ExtraCoreWalletOptions;

export class WalletConnect extends WalletConnectCore {
  constructor(options: WC2Options) {
    super({
      ...options,
      qrcode: true,
      projectId: TW_WC_PROJECT_ID,
      dappMetadata: {
        ...options.dappMetadata,
        isDarkMode: options.theme === "dark",
      },
    });
  }
}

// Device Wallet ----------------------------------------

const deviceWalletStorage = createAsyncLocalStorage("deviceWallet");

type DeviceWalletOptions = Omit<
  WalletOptions<DeviceWalletCoreOptions>,
  "storage" | "storageType" | "walletStorage"
> &
  ExtraCoreWalletOptions;

export class DeviceWallet extends DeviceWalletCore {
  constructor(options: DeviceWalletOptions) {
    super({
      ...options,
      storage: deviceWalletStorage,
      storageType: "asyncStore",
    });
  }

  static getStoredData() {
    const key = DeviceWalletCore.getDataStorageKey();
    return deviceWalletStorage.getItem(key);
  }

  static getStoredAddress() {
    const key = DeviceWalletCore.getAddressStorageKey();
    return deviceWalletStorage.getItem(key);
  }
}

// Coinbase Wallet ----------------------------------------

type CoinbaseWalletOptions = Omit<CoinbaseWalletOptionsCore, "walletStorage"> &
  ExtraCoreWalletOptions;
export class CoinbaseWallet extends CoinbaseWalletCore {
  constructor(options: CoinbaseWalletOptions) {
    super({
      ...options,

      dappMetadata: {
        ...options.dappMetadata,
        isDarkMode: options.theme === "dark",
      },
    });
  }
}

type PaperWalletOptions = Omit<
  PaperWalletOptionsCore,
  "walletStorage" | "clientId"
> &
  ExtraCoreWalletOptions;
export class PaperWallet extends PaperWalletCore {
  constructor(options: PaperWalletOptions) {
    super({
      ...options,

      // TODO: remove this, it's just for testing and will only work on localhost
      clientId: "62db6ab5-3165-4aac-b7a5-b52bb39e8d69",
      dappMetadata: {
        ...options.dappMetadata,
        isDarkMode: options.theme === "dark",
      },
    });
  }
}
