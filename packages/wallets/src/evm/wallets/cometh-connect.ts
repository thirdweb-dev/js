import { Connector } from "../interfaces/connector";
import { AbstractClientWallet } from "./base";
import { walletIds } from "../constants/walletIds";
import { WalletOptions } from "./base";
import { Chain, updateChainRPCs } from "@thirdweb-dev/chains";

// eslint-disable-next-line @typescript-eslint/ban-types
export type ComethAdditionalOptions = {
  /**
   * Api Key generated on Cometh Dashboard.
   *
   */
  apiKey: string;
  /**
   * network used by the project.
   *
   */
  chain: Chain;
  /**
   * WalletAddress if re-connection to an already created smart wallet.
   *
   */
  walletAddress?: string;
};

export class ComethConnect extends AbstractClientWallet<ComethAdditionalOptions> {
  connector?: Connector;
  public id = walletIds.comethConnect;
  private apiKey: string;
  private chain: Chain;
  private walletAddress?: string;

  constructor(options: WalletOptions<ComethAdditionalOptions>) {
    super(walletIds.comethConnect, options);
    this.chain = updateChainRPCs(options.chain, options.clientId);
    this.apiKey = options.apiKey;
    this.walletAddress = options?.walletAddress;
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      const { ComethConnector } = await import("../connectors/cometh-connect");

      this.connector = new ComethConnector({
        chain: this.chain,
        apiKey: this.apiKey,
        walletAddress: this.walletAddress,
        rpcUrl: this.chain.rpc[0],
      });
    }
    return this.connector;
  }
}
