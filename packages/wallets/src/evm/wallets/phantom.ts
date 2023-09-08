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
      // if phantom is injected, use the injected connector
      // otherwise, use the wallet connect connector for using the phantom app on mobile via QR code scan

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
      } else {
        const { WalletConnectConnector } = await import(
          "../connectors/wallet-connect"
        );

        const walletConnectConnector = new WalletConnectConnector({
          chains: this.chains,
          options: {
            projectId: this.options?.projectId || TW_WC_PROJECT_ID, // TODO,
            storage: this.walletStorage,
            qrcode: this.options?.qrcode,
            dappMetadata: this.dappMetadata,
            qrModalOptions: this.options?.qrModalOptions,
          },
        });

        walletConnectConnector.getProvider().then((provider) => {
          provider.signer.client.on("session_request_sent", () => {
            this.emit("wc_session_request_sent");
          });
        });

        // need to save this for getting the QR code URI
        this.walletConnectConnector = walletConnectConnector;
        this.connector = new WagmiAdapter(walletConnectConnector);
      }
    }

    return this.connector;
  }
