import { Chain } from "@thirdweb-dev/chains";
import { ConnectParams, TWConnector } from "../../interfaces/tw-connector";
import { ERC4337EthersProvider } from "./lib/erc4337-provider";
import { getVerifyingPaymaster } from "./lib/paymaster";
import { create4337Provider, ProviderConfig } from "./lib/provider-utils";
import { SmartWalletConfig, SmartWalletConnectionArgs } from "./types";
import { ENTRYPOINT_ADDRESS } from "./lib/constants";
import { EVMWallet } from "../../interfaces";
import { ERC4337EthersSigner } from "./lib/erc4337-signer";
import { providers } from "ethers";

export class SmartWalletConnector extends TWConnector<SmartWalletConnectionArgs> {
  private config: SmartWalletConfig;
  private aaProvider: ERC4337EthersProvider | undefined;
  personalWallet?: EVMWallet;

  constructor(config: SmartWalletConfig) {
    super();
    this.config = config;
  }

  async initialize(personalWallet: EVMWallet, accountId: string) {
    const config = this.config;
    const chain =
      typeof config.chain === "string"
        ? config.chain
        : (config.chain as Chain).slug;
    const bundlerUrl =
      this.config.bundlerUrl || `https://${chain}.bundler.thirdweb.com`;
    const paymasterUrl =
      this.config.paymasterUrl || `https://${chain}.bundler.thirdweb.com`;
    const entryPointAddress = config.entryPointAddress || ENTRYPOINT_ADDRESS;
    const localSigner = await personalWallet.getSigner();
    const providerConfig: ProviderConfig = {
      chain: config.chain,
      localSigner,
      accountId,
      entryPointAddress,
      bundlerUrl,
      paymasterAPI: this.config.gasless
        ? getVerifyingPaymaster(
            paymasterUrl,
            entryPointAddress,
            this.config.thirdwebApiKey,
          )
        : undefined,
      factoryAddress: config.factoryAddress,
      factoryAbi: config.factoryAbi,
      accountAbi: config.accountAbi,
      thirdwebApiKey: config.thirdwebApiKey,
    };
    this.personalWallet = personalWallet;
    this.aaProvider = await create4337Provider(providerConfig);
  }

  async connect(
    connectionArgs: ConnectParams<SmartWalletConnectionArgs>,
  ): Promise<string> {
    await this.initialize(
      connectionArgs.personalWallet,
      connectionArgs.accountId,
    );
    return await this.getAddress();
  }

  getProvider(): Promise<providers.Provider> {
    if (!this.aaProvider) {
      throw new Error("Local Signer not connected");
    }
    return Promise.resolve(this.aaProvider);
  }

  async getSigner(): Promise<ERC4337EthersSigner> {
    if (!this.aaProvider) {
      throw new Error("Local Signer not connected");
    }
    return Promise.resolve(this.aaProvider.getSigner());
  }

  async getAddress(): Promise<string> {
    const signer = await this.getSigner();
    return signer.getAddress();
  }

  async isConnected(): Promise<boolean> {
    try {
      const address = await this.getAddress();
      return !!address;
    } catch (e) {
      return false;
    }
  }

  async disconnect(): Promise<void> {
    this.personalWallet = undefined;
    this.aaProvider = undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  switchChain(chainId: number): Promise<void> {
    throw new Error("Not supported.");
  }
  setupListeners(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateChains(chains: Chain[]): void {
    // throw new Error("Method not implemented.");
  }
}
