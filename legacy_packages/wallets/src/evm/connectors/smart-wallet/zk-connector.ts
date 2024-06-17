import { Chain } from "@thirdweb-dev/chains";
import { Signer, providers } from "ethers";
import { ConnectParams, Connector } from "../../interfaces/connector";
import { SmartWalletConfig, SmartWalletConnectionArgs } from "./types";
import { EVMWallet } from "../../interfaces";
import { HttpRpcClient } from "./lib/http-rpc-client";
import { ENTRYPOINT_ADDRESS } from "./lib/constants";
import { ZkWrappedSigner } from "./zk-wrapped-signer";
import { isZkSyncChain } from "./utils";

export class ZkSyncConnector extends Connector<SmartWalletConnectionArgs> {
  protected config: SmartWalletConfig;
  protected personalWallet: EVMWallet | undefined;
  protected httpRpcClient: HttpRpcClient | undefined;
  protected chainId: number = 1;

  constructor(config: SmartWalletConfig) {
    super();
    this.config = config;
  }

  async connect(
    args: ConnectParams<SmartWalletConnectionArgs>,
  ): Promise<string> {
    this.personalWallet = args.personalWallet;
    this.chainId = await (await this.personalWallet.getSigner()).getChainId();
    if (!(await isZkSyncChain(this.chainId))) {
      throw new Error("Invalid zksync chain id");
    }
    const bundlerUrl =
      this.config.bundlerUrl || `https://${this.chainId}.bundler.thirdweb.com`;
    const entryPointAddress =
      this.config.entryPointAddress || ENTRYPOINT_ADDRESS;
    this.httpRpcClient = new HttpRpcClient(
      bundlerUrl,
      entryPointAddress,
      this.chainId,
      this.config.clientId,
      this.config.secretKey,
    );
    return this.getAddress();
  }

  disconnect(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getAddress(): Promise<string> {
    const signer = await this.getSigner();
    return signer.getAddress();
  }

  async getSigner(): Promise<Signer> {
    if (!this.personalWallet) {
      throw new Error("Wallet not connected");
    }
    return new ZkWrappedSigner(
      await this.personalWallet.getSigner(),
      this.httpRpcClient as HttpRpcClient,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  switchChain(chainId: number): Promise<void> {
    throw new Error("Method not implemented.");
  }

  isConnected(): Promise<boolean> {
    return Promise.resolve(!!this.personalWallet);
  }

  setupListeners(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateChains(chains: Chain[]): void {
    throw new Error("Method not implemented.");
  }

  async getProvider(): Promise<providers.Provider> {
    if (!this.getSigner()) {
      throw new Error("Personal wallet not connected");
    }
    const signer = await this.getSigner();
    if (!signer.provider) {
      throw new Error("Provider not found");
    }
    return signer.provider;
  }
}
