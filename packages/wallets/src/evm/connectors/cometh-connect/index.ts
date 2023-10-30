import { Connector } from "../../interfaces/connector";
import type { providers, Signer } from "ethers";
import { ethers } from "ethers";

import {
  ComethWallet,
  ComethProvider,
  ComethSigner,
  ConnectAdaptor,
  AUTHAdapter,
  SupportedNetworks,
} from "@cometh/connect-sdk";

import { ComethWalletConfig } from "./types";
import { walletIds } from "../../constants/walletIds";

export class ComethConnector extends Connector {
  readonly id = walletIds.comethConnect;
  readonly name = "Cometh Connect";
  private options: ComethWalletConfig;
  private instance?: ComethWallet;
  private authAdapter?: AUTHAdapter;
  constructor(config: ComethWalletConfig) {
    super();
    this.options = config;
  }

  async connect() {
    const chainId = ethers.utils.hexlify(this.options.chain.chainId);

    if (this._isSupportedNetwork(chainId)) {
      this.authAdapter = new ConnectAdaptor({
        chainId: chainId,
        apiKey: this.options.apiKey,
        rpcUrl: this.options.rpcUrl,
      });
    } else {
      throw new Error("This network is not supported");
    }

    if (!this.authAdapter) {
      throw new Error("authAdapter not initialized");
    }
    this.instance = new ComethWallet({
      authAdapter: this.authAdapter,
      apiKey: this.options.apiKey,
      rpcUrl: this.options.rpcUrl,
    });

    if (!this.instance) {
      throw new Error("Error connecting User");
    }

    // eslint-disable-next-line no-unused-expressions
    this.options?.walletAddress
      ? await this.instance.connect(this.options.walletAddress)
      : await this.instance.connect();

    return this.getAddress();
  }

  _isSupportedNetwork(value: string): value is SupportedNetworks {
    return Object.values(SupportedNetworks).includes(value as any);
  }

  async disconnect(): Promise<void> {
    const instance = await this.instance;
    if (!instance) {
      throw new Error("Error connecting User");
    }
    await instance.logout();
  }

  async getProvider(): Promise<providers.Provider> {
    if (!this.instance) {
      throw new Error("Error connecting User");
    }
    const provider = await this.instance.getProvider();
    if (!provider) {
      throw new Error("Provider not found");
    }
    return provider;
  }

  public async getSigner(): Promise<Signer> {
    if (!this.instance) {
      throw new Error("Error connecting User");
    }
    const instanceProvider = new ComethProvider(this.instance);
    return new ComethSigner(this.instance, instanceProvider);
  }

  async getAddress(): Promise<string> {
    if (!this.instance) {
      throw new Error("Error connecting User");
    }
    return await this.instance.getAddress();
  }

  async isConnected(): Promise<boolean> {
    try {
      const addr = await this.getAddress();
      return !!addr;
    } catch (e) {
      return false;
    }
  }

  async switchChain(): Promise<void> {
    throw new Error("method is not implemented for this adapter");
  }

  updateChains() {
    console.debug("no update chains possible");
  }

  async setupListeners() {
    throw new Error("method is not implemented for this adapter");
  }
}
