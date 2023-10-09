import type { WalletConnectConnector as WalletConnectConnectorType } from "../connectors/wallet-connect";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import type { PhantomConnector as PhantomConnectorType } from "../connectors/phantom";
import { walletIds } from "../constants/walletIds";
import { getInjectedPhantomProvider } from "../connectors/phantom/getInjectedPhantomProvider";

type PhantomWalletOptions = WalletOptions;

export class PhantomWallet extends AbstractClientWallet {
  connector?: Connector;
  walletConnectConnector?: WalletConnectConnectorType;
  phantomConnector?: PhantomConnectorType;
  isInjected: boolean;

  static meta = {
    name: "Phantom",
    iconURL:
      "ipfs://bafybeibkpca5nwxpsjrtuxmz2ckb5lyc2sl2abg5f7dnvxku637vvffjti",
    urls: {
      chrome:
        "https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa",
      // not specifiying theme because they can't be used to connect
      // android: "https://play.google.com/store/apps/details?id=app.phantom",
      // ios: "https://apps.apple.com/us/app/phantom-crypto-wallet/id1598432977",
    },
  };

  static id = walletIds.phantom as string;

  public get walletName() {
    return "Phantom" as const;
  }

  constructor(options: PhantomWalletOptions) {
    super(PhantomWallet.id, options);
    this.isInjected = !!getInjectedPhantomProvider();
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      const { PhantomConnector } = await import("../connectors/phantom");
      const phantomConnector = new PhantomConnector({
        chains: this.chains,
        connectorStorage: this.walletStorage,
        options: {
          shimDisconnect: true,
        },
      });

      this.phantomConnector = phantomConnector;
      this.connector = new WagmiAdapter(phantomConnector);
    }

    return this.connector;
  }
}
