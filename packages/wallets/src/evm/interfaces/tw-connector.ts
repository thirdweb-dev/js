import { Connector } from "../../lib/wagmi-core";
import { Chain } from "@thirdweb-dev/chains";
import type { Signer, providers } from "ethers";
import EventEmitter from "eventemitter3";

export abstract class TWConnector<
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

export type ConnectParams<TOpts extends Record<string, any> = {}> = {
  chainId?: number;
} & TOpts;

export class WagmiAdapter<
  TConnectParams extends Record<string, any> = {},
> extends TWConnector<TConnectParams> {
  wagmiConnector: Connector<any, any, any>;

  constructor(wagmiConnector: Connector) {
    super();
    this.wagmiConnector = wagmiConnector;
  }

  async connect(args?: ConnectParams<TConnectParams>): Promise<string> {
    const chainId = args?.chainId;
    this.setupListeners();
    const result = await this.wagmiConnector.connect({ chainId });
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

  async setupListeners() {
    this.wagmiConnector.addListener("connect", (data) => {
      this.emit("connect", data);
    });

    this.wagmiConnector.addListener("change", (data) => {
      this.emit("change", data);
    });

    this.wagmiConnector.addListener("disconnect", () => {
      this.emit("disconnect");
    });

    await this.wagmiConnector.setupListeners();
  }

  updateChains(chains: Chain[]) {
    this.wagmiConnector.updateChains(chains);
  }
}
