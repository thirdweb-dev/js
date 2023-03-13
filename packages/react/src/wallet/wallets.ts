import { createAsyncLocalStorage } from "../core/WalletStorage";
import { TW_WC_PROJECT_ID } from "@thirdweb-dev/react-core";
import { ExtraCoreWalletOptions } from "@thirdweb-dev/react-core";
import type {
  DeviceWalletOptions as DeviceWalletCoreOptions,
  MetamaskWalletOptions as MetamaskCoreOptions,
  WalletConnectOptions,
  WalletConnectV1Options,
  WalletOptions,
  CoinbaseWalletOptions as CoinbaseWalletOptionsCore,
} from "@thirdweb-dev/wallets";
import {
  CoinbaseWallet as CoinbaseWalletCore,
  DeviceBrowserWallet as DeviceWalletCore,
  MetaMask as MetamaskWalletCore,
  WalletConnect as WalletConnectCore,
  WalletConnectV1 as WalletConnectV1Core,
} from "@thirdweb-dev/wallets";

const walletStorages = {
  metamask: createAsyncLocalStorage("metamask"),
  walletConnect: createAsyncLocalStorage("walletConnect"),
  walletConnectV1: createAsyncLocalStorage("walletConnectV1"),
  deviceWallet: createAsyncLocalStorage("deviceWallet"),
  coinbase: createAsyncLocalStorage("coinbase"),
};

// Metamask ----------------------------------------

type MetamaskWalletOptions = Omit<
  MetamaskCoreOptions,
  "connectorStorage" | "walletStorage"
> &
  ExtraCoreWalletOptions;

const connectorStorage = createAsyncLocalStorage("connector");
export class MetamaskWallet extends MetamaskWalletCore {
  isInjected: boolean;
  constructor(options: MetamaskWalletOptions) {
    super({
      ...options,
      connectorStorage,
      walletStorage: walletStorages.metamask,
    });
    this.isInjected = !!window.ethereum?.isMetaMask;
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
      walletStorage: walletStorages.walletConnectV1,
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
      walletStorage: walletStorages.walletConnect,
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
      walletStorage: walletStorages.deviceWallet,
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
      walletStorage: walletStorages.walletConnect,
      dappMetadata: {
        ...options.dappMetadata,
        isDarkMode: options.theme === "dark",
      },
    });
  }
}
