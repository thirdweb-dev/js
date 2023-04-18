import { Chain } from "@thirdweb-dev/chains";
import { ConnectParams, TWConnector } from "../../interfaces/tw-connector";
import { ERC4337EthersProvider } from "./lib/erc4337-provider";
import { getVerifyingPaymaster } from "./lib/paymaster";
import { create4337Provider, ProviderConfig } from "./lib/provider-utils";
import { SmartWalletConfig, SmartWalletConnectionArgs } from "./types";
import TWAccountFactory from "./artifacts/TWAccountFactory.json";
import TWAccount from "./artifacts/TWAccount.json";
import { ENTRYPOINT_ADDRESS } from "./lib/constants";
import { EVMWallet } from "../../interfaces";
import { ERC4337EthersSigner } from "./lib/erc4337-signer";
import { providers } from "ethers";

const DEFAULT_API_KEY =
  "4f20f63d3ce0ec88eca639a291effef1559289d5614d77040d783048a4b3f316";

export class SmartWalletConnector extends TWConnector<SmartWalletConnectionArgs> {
  private config: SmartWalletConfig;
  private aaProvider: ERC4337EthersProvider | undefined;

  constructor(config: SmartWalletConfig) {
    super();
    this.config = config;
  }

  async initialize(personalWallet: EVMWallet, accountId?: string) {
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
      accountId: accountId ? accountId : await localSigner.getAddress(),
      entryPointAddress,
      bundlerUrl,
      paymasterAPI: this.config.gasless
        ? getVerifyingPaymaster(
            paymasterUrl,
            entryPointAddress,
            this.config.apiKey,
          )
        : undefined,
      factoryAddress: config.factoryAddress,
      factoryAbi: config.factoryAbi || TWAccountFactory.abi,
      accountAbi: config.accountAbi || TWAccount.abi,
      apiKey: config.apiKey || DEFAULT_API_KEY,
    };
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

  disconnect(): Promise<void> {
    // TODO (sw) disconnect
    throw new Error("Method not implemented.");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  switchChain(chainId: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  setupListeners(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateChains(chains: Chain[]): void {
    throw new Error("Method not implemented.");
  }
}
