import {
  WalletOptions,
  walletIds,
  WalletConnectOptions,
  WalletConnect as WalletConnectCore,
} from "@thirdweb-dev/wallets";
import { formatDisplayUri } from "../../utils/uri";
import { Linking } from "react-native";
import {
  WalletOptions as WalletOptionsRC,
  ConfiguredWallet,
  ExtraCoreWalletOptions,
} from "@thirdweb-dev/react-core";
import { createAsyncLocalStorage } from "../../../core/AsyncStorage";
import { TW_WC_PROJECT_ID, WC_LINKS } from "../../constants/walletConnect";

type WCOptions = Omit<WalletOptions<WalletConnectOptions>, "qrcode"> & {
  qrcode: false;
} & ExtraCoreWalletOptions;

type WCLinks = {
  native: string;
  universal: string;
};

const WALLET_CONNECT_LINKS = "wallet_connect_links";

export class WalletConnect extends WalletConnectCore {
  static id = walletIds.walletConnect;
  #links?: WCLinks;

  constructor(options: WCOptions) {
    const storage = createAsyncLocalStorage(walletIds.walletConnect);
    super({
      ...options,
      walletId: walletIds.walletConnect,
      walletStorage: storage,
      qrcode: false,
    });

    this.on("open_wallet", this._onWCOpenWallet);

    this.on("disconnect", () => {
      this.removeListener("open_wallet", this._onWCOpenWallet);
    });
  }

  async getConnector() {
    if (!this.#links) {
      await this.initLinks();
    }

    return super.getConnector();
  }

  async initLinks() {
    console.log("initLinks", this.walletStorage);
    const linksStr = await this.walletStorage.getItem(WALLET_CONNECT_LINKS);

    const links = linksStr ? JSON.parse(linksStr) : undefined;

    this.setLinks(links);
  }

  async setLinks(linksP?: WCLinks) {
    console.log("setLinks", linksP);

    this.#links = linksP;

    if (linksP) {
      await this.walletStorage.setItem(
        WALLET_CONNECT_LINKS,
        JSON.stringify(linksP),
      );

      console.log("after stored");
    }
  }

  _onWCOpenWallet(uri?: string) {
    const links = this.#links || WC_LINKS;

    console.log("links", links);
    console.log("uri", uri);

    if (uri) {
      const fullUrl = formatDisplayUri(uri, links);

      console.log("fullUrl.1st", fullUrl);

      Linking.openURL(fullUrl);
    } else {
      const fullUrl = formatDisplayUri("", links);

      console.log("fullUrl", fullUrl);

      Linking.openURL(fullUrl);
    }
  }
}

type WalletConnectConfig = { projectId?: string };

export const walletConnect = (config?: WalletConnectConfig) => {
  const projectId = config?.projectId || TW_WC_PROJECT_ID;
  console.log("projectId", projectId);
  return {
    id: WalletConnect.id,
    meta: WalletConnectCore.meta,
    create: (options: WalletOptionsRC) =>
      new WalletConnect({ ...options, qrcode: false, projectId }),
    config: {
      projectId,
    },
  } satisfies ConfiguredWallet<WalletConnect, WalletConnectConfig>;
};
