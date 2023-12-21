import { walletIds } from "../constants/walletIds";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";

/**
 * @wallet
 */
export class FrameWallet extends AbstractClientWallet {
  connector?: Connector;

  static id = walletIds.frame as string;
  public get walletName() {
    return "Frame Wallet";
  }

  constructor(options?: WalletOptions) {
    super(FrameWallet.id, options);
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      // import the connector dynamically
      const { FrameConnector } = await import("../connectors/frame");
      this.connector = new WagmiAdapter(
        new FrameConnector({
          chains: this.chains,
          connectorStorage: this.walletStorage,
          options: {
            shimDisconnect: true,
          },
        }),
      );
    }
    return this.connector;
  }
}
