import type { Chain } from "@thirdweb-dev/chains";
import type { Signer, providers } from "ethers";
import EventEmitter from "eventemitter3";
import { WagmiConnector } from "../../lib/wagmi-core";

export abstract class Connector<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TConnectParams extends Record<string, any> = {},
> extends EventEmitter {
  abstract connect(args?: ConnectParams<TConnectParams>): Promise<string>;
  abstract disconnect(): Promise<void>;
  abstract getAddress(): Promise<string>;
  abstract getSigner(): Promise<Signer>;
  abstract getProvider(): Promise<providers.Provider>;
  abstract switchChain(chainId: number): Promise<void>;
  abstract isConnected(): Promise<boolean>;
  abstract setupListeners(): Promise<void>;
  abstract updateChains(chains: Chain[]): void;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type ConnectParams<TOpts extends Record<string, any> = {}> = {
  chainId?: number;
} & TOpts;

export class WagmiAdapter<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TConnectParams extends Record<string, any> = {},
> extends Connector<TConnectParams> {
  wagmiConnector: WagmiConnector<any, any, any>;

  constructor(wagmiConnector: WagmiConnector) {
    super();
    this.wagmiConnector = wagmiConnector;
  }

  async connect(args?: ConnectParams<TConnectParams>): Promise<string> {
    this.setupConnectorListeners();
    const result = await this.wagmiConnector.connect(args);
    return result.account;
  }

  disconnect(): Promise<void> {
    this.wagmiConnector.removeAllListeners("connect");
    this.wagmiConnector.removeAllListeners("change");
    return this.wagmiConnector.disconnect();
  }

  isConnected(): Promise<boolean> {
    return this.wagmiConnector.isAuthorized();
  }
  getAddress(): Promise<string> {
    return this.wagmiConnector.getAccount();
  }
  getSigner(): Promise<Signer> {
    return this.wagmiConnector.getSigner();
  }
  getProvider(): Promise<providers.Provider> {
    return this.wagmiConnector.getProvider();
  }

  async switchChain(chainId: number): Promise<void> {
    if (!this.wagmiConnector.switchChain) {
      throw new Error("Switch chain not supported");
    }
    await this.wagmiConnector.switchChain(chainId);
  }

  setupConnectorListeners() {
    this.wagmiConnector.addListener("connect", (data) => {
      this.emit("connect", data);
    });

    this.wagmiConnector.addListener("change", (data) => {
      this.emit("change", data);
    });

    this.wagmiConnector.addListener("disconnect", () => {
      this.emit("disconnect");
    });
  }

  async setupListeners() {
    this.setupConnectorListeners();

    await this.wagmiConnector.setupListeners();
  }

  updateChains(chains: Chain[]) {
    this.wagmiConnector.updateChains(chains);
  }
}
