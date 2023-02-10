import { Connector } from "@wagmi/core";
import { ethers } from "ethers";
import EventEmitter from "eventemitter3";

export abstract class TWConnector<
  TConnectParams extends Record<string, any> = {},
> extends EventEmitter {
  abstract connect(args?: ConnectParams<TConnectParams>): Promise<string>;
  abstract disconnect(): Promise<void>;
  abstract getAddress(): Promise<string>;
  abstract getSigner(): Promise<ethers.Signer>;
  abstract getProvider(): Promise<ethers.providers.Provider>;
  abstract switchChain(chainId: number): Promise<void>;
  abstract isConnected(): Promise<boolean>;
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
    const result = await this.wagmiConnector.connect({ chainId });
    return result.account;
  }
  disconnect(): Promise<void> {
    return this.wagmiConnector.disconnect();
  }
  isConnected(): Promise<boolean> {
    return this.wagmiConnector.isAuthorized();
  }
  getAddress(): Promise<string> {
    return this.wagmiConnector.getAccount();
  }
  getSigner(): Promise<ethers.Signer> {
    return this.wagmiConnector.getSigner();
  }
  getProvider(): Promise<ethers.providers.Provider> {
    return this.wagmiConnector.getProvider();
  }
  async switchChain(chainId: number): Promise<void> {
    if (!this.wagmiConnector.switchChain) {
      throw new Error("Switch chain not supported");
    }
    await this.wagmiConnector.switchChain(chainId);
  }
}
