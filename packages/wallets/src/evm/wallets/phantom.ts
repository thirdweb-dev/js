import type { WalletConnectConnector as WalletConnectConnectorType } from "../connectors/wallet-connect";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet } from "./base";
import type { PhantomConnector as PhantomConnectorType } from "../connectors/phantom";
import { walletIds } from "../constants/walletIds";
import { TW_WC_PROJECT_ID } from "../constants/wc";
import { getInjectedPhantomProvider } from "../connectors/phantom/getInjectedPhantomProvider";


export class PhantomWallet extends AbstractClientWallet {
  connector?: Connector;
  walletConnectConnector?: WalletConnectConnectorType;
  phantomConnector?: PhantomConnectorType;
  isInjected: boolean;

  static meta = {
    name: "Phantom",
    iconURL: "ipfs://bafybeibkpca5nwxpsjrtuxmz2ckb5lyc2sl2abg5f7dnvxku637vvffjti",
    urls: {
      chrome:
        "https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa",
      android: "https://play.google.com/store/apps/details?id=app.phantom",
      ios: "https://apps.apple.com/us/app/phantom-crypto-wallet/id1598432977",
    },
  };

  static id = walletIds.phantom;

  public get walletName() {
    return "Phantom" as const;
  }

  constructor(options: PhantomWalletOptions) {
    super(PhantomWallet.id, options);
    this.isInjected = !!getInjectedPhantomProvider();
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {

      if (this.isInjected) {
        // import the connector dynamically
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
    }

    return this.connector;
  }
