import { createAsyncLocalStorage } from "../../../core/AsyncStorage";
import { TW_WC_PROJECT_ID } from "../../constants/walletConnect";
import { ExtraCoreWalletOptions } from "@thirdweb-dev/react-core";
import type {
  DeviceWalletOptions as DeviceWalletCoreOptions,
  WalletConnectOptions,
  WalletConnectV1Options,
  WalletOptions,
} from "@thirdweb-dev/wallets";
import {
  DeviceBrowserWallet as DeviceWalletCore,
  WalletConnect as WalletConnectCore,
  WalletConnectV1 as WalletConnectV1Core,
} from "@thirdweb-dev/wallets";

const DEFAULT_NAME_METADATA = "Dapp powered by Thirdweb";
const DEFAULT_URL_METADATA = "thirdweb.com";

// Metamask ----------------------------------------
type WC1Options = Omit<
  WalletOptions<WalletConnectV1Options>,
  "qrcode" | "walletStorage"
> &
  ExtraCoreWalletOptions;

export class MetamaskWallet extends WalletConnectV1Core {
  constructor(options: WC1Options) {
    const storage = createAsyncLocalStorage("metamask");
    super({
      ...options,
      walletStorage: storage,
      coordinatorStorage: storage,
      qrcode: false,
      dappMetadata: {
        url: options.clientMeta?.url || DEFAULT_URL_METADATA,
        name: options.clientMeta?.name || DEFAULT_NAME_METADATA,
        logoUrl: options.clientMeta?.icons?.[0],
        description: options.clientMeta?.description,
      },
    });
  }
}

// Trust ----------------------------------------

type WC2Options = Omit<
  WalletOptions<WalletConnectOptions>,
  "projectId" | "qrcode" | "walletStorage"
>;

export class TrustWallet extends WalletConnectCore {
  constructor(options: WC2Options) {
    const storage = createAsyncLocalStorage("trustwallet");
    super({
      ...options,
      qrcode: true,
      projectId: TW_WC_PROJECT_ID,
      walletStorage: storage,
      dappMetadata: {
        ...options.dappMetadata,
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
      walletStorage: deviceWalletStorage,
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
