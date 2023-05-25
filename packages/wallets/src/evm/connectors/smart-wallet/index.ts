import { Chain } from "@thirdweb-dev/chains";
import { ConnectParams, Connector } from "../../interfaces/connector";
import { ERC4337EthersProvider } from "./lib/erc4337-provider";
import { getVerifyingPaymaster } from "./lib/paymaster";
import { create4337Provider } from "./lib/provider-utils";
import {
  AccountContractInfo,
  FactoryContractInfo,
  ProviderConfig,
  SmartWalletConfig,
  SmartWalletConnectionArgs,
} from "./types";
import { ENTRYPOINT_ADDRESS } from "./lib/constants";
import { EVMWallet } from "../../interfaces";
import { ERC4337EthersSigner } from "./lib/erc4337-signer";
import { BigNumber, ethers, providers } from "ethers";
import {
  getChainProvider,
  SmartContract,
  Transaction,
  TransactionResult,
} from "@thirdweb-dev/sdk";
import { AccountAPI } from "./lib/account";
import { DEFAULT_WALLET_API_KEY } from "../../constants/keys";

export class SmartWalletConnector extends Connector<SmartWalletConnectionArgs> {
  private config: SmartWalletConfig;
  private aaProvider: ERC4337EthersProvider | undefined;
  private accountApi: AccountAPI | undefined;
  personalWallet?: EVMWallet;

  constructor(config: SmartWalletConfig) {
    super();
    this.config = config;
  }

  async initialize(personalWallet: EVMWallet) {
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
      entryPointAddress,
      bundlerUrl,
      paymasterAPI: this.config.gasless
        ? this.config.paymasterAPI
          ? this.config.paymasterAPI
          : getVerifyingPaymaster(
              paymasterUrl,
              entryPointAddress,
              this.config.thirdwebApiKey,
            )
        : undefined,
      factoryAddress: config.factoryAddress,
      factoryInfo: config.factoryInfo || this.defaultFactoryInfo(),
      accountInfo: config.accountInfo || this.defaultAccountInfo(),
      thirdwebApiKey: config.thirdwebApiKey,
    };
    const originalProvider = getChainProvider(config.chain, {
      thirdwebApiKey: config.thirdwebApiKey || DEFAULT_WALLET_API_KEY,
    }) as providers.BaseProvider;
    this.personalWallet = personalWallet;
    const accountApi = new AccountAPI(providerConfig, originalProvider);
    this.aaProvider = await create4337Provider(
      providerConfig,
      accountApi,
      originalProvider,
    );
    this.accountApi = accountApi;
  }

  async connect(
    connectionArgs: ConnectParams<SmartWalletConnectionArgs>,
  ): Promise<string> {
    await this.initialize(connectionArgs.personalWallet);
    return await this.getAddress();
  }

  getProvider(): Promise<providers.Provider> {
    if (!this.aaProvider) {
      throw new Error("Personal wallet not connected");
    }
    return Promise.resolve(this.aaProvider);
  }

  async getSigner(): Promise<ERC4337EthersSigner> {
    if (!this.aaProvider) {
      throw new Error("Personal wallet not connected");
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

  async switchChain(chainId: number): Promise<void> {
    // TODO implement chain switching
    const provider = await this.getProvider();
    const currentChainId = (await provider.getNetwork()).chainId;
    if (currentChainId !== chainId) {
      // only throw if actually trying to switch chains
      throw new Error("Not supported.");
    }
  }

  setupListeners(): Promise<void> {
    return Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateChains(chains: Chain[]): void {}

  /**
   * Execute a single transaction
   * @param transactions
   * @returns the transaction receipt
   */
  async execute(transaction: Transaction): Promise<TransactionResult> {
    const signer = await this.getSigner();
    const tx = await signer.sendTransaction({
      to: transaction.getTarget(),
      data: transaction.encode(),
      value: await transaction.getValue(),
    });
    const receipt = await tx.wait();
    return {
      receipt,
    };
  }

  /**
   * Execute multiple transactions in a single batch
   * @param transactions
   * @returns the transaction receipt
   */
  async executeBatch(transactions: Transaction[]): Promise<TransactionResult> {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    const signer = await this.getSigner();
    const targets = transactions.map((tx) => tx.getTarget());
    const data = transactions.map((tx) => tx.encode());
    const values = transactions.map(() => BigNumber.from(0)); // TODO check if we can handle multiple values
    const callData = await this.accountApi.encodeExecuteBatch(
      targets,
      values,
      data,
    );
    const tx = await signer.sendTransaction(
      {
        to: await signer.getAddress(),
        data: callData,
        value: 0,
      },
      true, // batched tx flag
    );
    const receipt = await tx.wait();
    return {
      receipt,
    };
  }

  /**
   * Manually deploy the smart wallet contract. If already deployed this will throw an error.
   * Note that this is not necessary as the smart wallet will be deployed automatically on the first transaction the user makes.
   * @returns the transaction receipt
   */
  async deploy(): Promise<TransactionResult> {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    if (await this.accountApi.isAcountDeployed()) {
      throw new Error("Smart wallet already deployed");
    }
    const signer = await this.getSigner();
    const tx = await signer.sendTransaction({
      to: await signer.getAddress(),
      data: "0x",
    });
    const receipt = await tx.wait();
    return { receipt };
  }

  /**
   * Check if the smart wallet contract is deployed
   * @returns true if the smart wallet contract is deployed
   */
  async isDeployed(): Promise<boolean> {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    return await this.accountApi.isAcountDeployed();
  }

  private defaultFactoryInfo(): FactoryContractInfo {
    return {
      createAccount: async (factory: SmartContract, owner: string) => {
        return factory.prepare("createAccount", [
          owner,
          ethers.utils.toUtf8Bytes(""),
        ]);
      },
      getAccountAddress: async (factory, owner) => {
        return factory.call("getAddress", [owner]);
      },
    };
  }

  private defaultAccountInfo(): AccountContractInfo {
    return {
      execute: async (account, target, value, data) => {
        return account.prepare("execute", [target, value, data]);
      },
      getNonce: async (account) => {
        return account.call("getNonce", []);
      },
    };
  }
}
