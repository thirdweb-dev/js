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

export class SmartWalletConnector extends TWConnector<SmartWalletConnectionArgs> {
  private config: SmartWalletConfig;
  private aaProvider: ERC4337EthersProvider | undefined;

  constructor(config: SmartWalletConfig) {
    super();
    this.config = config;
  }

  async initialize(personalWallet: EVMWallet, accountId?: string) {
    const config = this.config;
    // TODO (sw) use our own endpoint, but allow passing in a custom one
    const bundlerUrl = `https://node.stackup.sh/v1/rpc/${config.apiKey}`;
    const paymasterUrl = `https://app.stackup.sh/api/v2/paymaster/payg/${config.apiKey}`;
    const entryPointAddress = config.entryPointAddress || ENTRYPOINT_ADDRESS;
    const localSigner = await personalWallet.getSigner();
    const providerConfig: ProviderConfig = {
      chain: config.chain,
      localSigner,
      accountId: accountId ? accountId : await localSigner.getAddress(),
      entryPointAddress,
      bundlerUrl,
      paymasterAPI: config.gasless
        ? getVerifyingPaymaster(paymasterUrl, entryPointAddress)
        : undefined,
      factoryAddress: config.factoryAddress,
      factoryAbi: config.factoryAbi || TWAccountFactory.abi,
      accountAbi: config.accountAbi || TWAccount.abi,
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
