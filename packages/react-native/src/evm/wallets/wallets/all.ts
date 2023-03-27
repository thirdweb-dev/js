import { createAsyncLocalStorage } from "../../../core/AsyncStorage";
import { TW_WC_PROJECT_ID } from "../../constants/walletConnect";
import { formatDisplayUri } from "../../utils/uri";
import { ExtraCoreWalletOptions } from "@thirdweb-dev/react-core";
import type {
  WalletConnectOptions,
  WalletConnectV1Options,
  WalletOptions,
} from "@thirdweb-dev/wallets";
import {
  WalletOptions as WalletOptionsRC,
  Wallet,
} from "@thirdweb-dev/react-core";
import {
  WalletConnect as WalletConnectCore,
  WalletConnectV1 as WalletConnectV1Core,
} from "@thirdweb-dev/wallets";
import { Linking } from "react-native";

// Metamask ----------------------------------------
type WC1Options = Omit<
  WalletOptions<WalletConnectV1Options>,
  "qrcode" | "walletStorage"
> &
  ExtraCoreWalletOptions;

export class MetaMaskWallet extends WalletConnectV1Core {
  static id = "metamask" as const;
  static meta = {
    id: "metamask",
    name: "MetaMask",
    iconURL:
      "https://registry.walletconnect.org/v2/logo/md/5195e9db-94d8-4579-6f11-ef553be95100",
    links: {
      native: "metamask:",
      universal: "https://metamask.app.link",
    },
  };

  constructor(options: WC1Options) {
    const storage = createAsyncLocalStorage("metamask");
    super({
      ...options,
      walletId: "metamask",
      walletStorage: storage,
      qrcode: false,
    });

    this.on("open_wallet", this._onWCOpenWallet);

    this.on("disconnect", () => {
      this.removeListener("open_wallet", this._onWCOpenWallet);
    });
  }

  _onWCOpenWallet(uri?: string) {
    const links = MetaMaskWallet.meta.links;

    if (uri) {
      const fullUrl = formatDisplayUri(uri, links);

      Linking.openURL(fullUrl);
    } else {
      const fullUrl = formatDisplayUri("", links);

      Linking.openURL(fullUrl);
    }
  }
}

export const metamaskWallet = () => {
  return {
    id: MetaMaskWallet.id,
    meta: MetaMaskWallet.meta,
    create: (options: WalletOptionsRC) => new MetaMaskWallet(options),
  } satisfies Wallet;
};

// Rainbow ----------------------------------------

export class RainbowWallet extends WalletConnectV1Core {
  static id = "rainbow" as const;
  static meta = {
    id: "rainbow",
    name: "Rainbow",
    iconURL:
      "https://registry.walletconnect.org/v2/logo/md/7a33d7f1-3d12-4b5c-f3ee-5cd83cb1b500",
    links: {
      native: "rainbow:",
      universal: "https://rnbwapp.com",
    },
  };

  constructor(options: WC1Options) {
    const storage = createAsyncLocalStorage("rainbow");
    super({
      ...options,
      walletId: "rainbow",
      walletStorage: storage,
      qrcode: false,
    });
    this.on("open_wallet", this._onWCOpenWallet);

    this.on("disconnect", () => {
      this.removeListener("open_wallet", this._onWCOpenWallet);
    });
  }

  _onWCOpenWallet(uri?: string) {
    const links = RainbowWallet.meta.links;

    if (uri) {
      const fullUrl = formatDisplayUri(uri, links);

      Linking.openURL(fullUrl);
    } else {
      const fullUrl = formatDisplayUri("", links);

      Linking.openURL(fullUrl);
    }
  }
}

export const rainbowWallet = () => {
  return {
    id: RainbowWallet.id,
    meta: RainbowWallet.meta,
    create: (options: WalletOptionsRC) => new RainbowWallet(options),
  } satisfies Wallet;
};

// Trust ----------------------------------------

type WC2Options = Omit<
  WalletOptions<WalletConnectOptions>,
  "projectId" | "qrcode" | "walletStorage"
>;

export class TrustWallet extends WalletConnectCore {
  static id = "trust" as const;
  static meta = {
    id: "trust",
    name: "Trust Wallet",
    iconURL:
      "https://registry.walletconnect.org/v2/logo/md/0528ee7e-16d1-4089-21e3-bbfb41933100",
    links: {
      native: "trust:",
      universal: "https://link.trustwallet.com",
    },
  };

  constructor(options: WC2Options) {
    const storage = createAsyncLocalStorage("trustwallet");
    super({
      ...options,
      walletId: "trust",
      qrcode: false,
      projectId: TW_WC_PROJECT_ID,
      walletStorage: storage,
    });

    this.on("open_wallet", this._onWCOpenWallet);

    this.on("disconnect", () => {
      this.removeListener("open_wallet", this._onWCOpenWallet);
    });
  }

  _onWCOpenWallet(uri?: string) {
    const links = TrustWallet.meta.links;

    if (uri) {
      const fullUrl = formatDisplayUri(uri, links);

      Linking.openURL(fullUrl);
    } else {
      const fullUrl = formatDisplayUri("", links);

      Linking.openURL(fullUrl);
    }
  }
}

export const trustWallet = () => {
  return {
    id: TrustWallet.id,
    meta: TrustWallet.meta,
    create: (options: WalletOptionsRC) => new TrustWallet(options),
  } satisfies Wallet;
};
