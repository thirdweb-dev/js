import { MMKV } from "react-native-mmkv";
import { WC2Options, WalletConnectBase } from "./WalletConnectBase";
import { WALLETCONNECT_ICON } from "../../../assets/svgs";

const PREFIX = "__TW__WALLET__CONNECT__";

export class WalletConnect extends WalletConnectBase {
  static id = "WalletConnect" as const;
  static meta = {
    name: "WalletConnect",
    iconURL: WALLETCONNECT_ICON,
    links: {
      native: "wc:",
      universal: "wc:",
    },
  };

  storage: MMKV;
  links: { native: string; universal: string };

  constructor(options: WC2Options) {
    super(options);

    this.storage = new MMKV();

    const storedLinksStr = this.storage.getString(PREFIX + "links");

    this.links = storedLinksStr
      ? JSON.parse(storedLinksStr)
      : {
          native: "wc:",
          universal: "wc:",
        };

    this.on("disconnect", () => {
      this.storage.delete(PREFIX + "links");
    });
  }

  getMeta() {
    return { ...WalletConnect.meta, links: this.links };
  }

  setWCLinks(links: { native: string; universal: string }) {
    this.storage.set(PREFIX + "links", JSON.stringify(links));
    this.links = links;
  }
}
