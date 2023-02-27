import {
  MetaMask as MetamaskWalletCore,
  CoinbaseWallet as CoinbaseWalletCore,
  DeviceBrowserWallet as DeviceWalletCore,
  WalletConnect as WalletConnectCore,
  WalletConnectV1 as WalletConnectV1Core,
} from "@thirdweb-dev/wallets";
import type {
  MetamaskWalletOptions,
  WalletConnectV1Options,
  WalletConnectOptions,
  WalletOptions,
} from "@thirdweb-dev/wallets";

export class MetamaskWallet extends MetamaskWalletCore {
  isInjected: boolean;
  constructor(options: MetamaskWalletOptions) {
    super(options);
    this.isInjected = !!window.ethereum?.isMetaMask;
  }
}

export class WalletConnectV1 extends WalletConnectV1Core {
  constructor(options: WalletOptions<WalletConnectV1Options>) {
    super({
      ...options,
      qrcode: true,
    });
  }
}

export class WalletConnect extends WalletConnectCore {
  constructor(options: WalletOptions<WalletConnectOptions>) {
    super({
      ...options,
      qrcode: true,
    });
  }
}

export const CoinbaseWallet = CoinbaseWalletCore;
export const DeviceWallet = DeviceWalletCore;
