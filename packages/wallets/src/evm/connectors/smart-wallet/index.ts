import { Chain, getChainByChainId } from "@thirdweb-dev/chains";
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
import { BigNumber, ethers, providers, utils } from "ethers";
import {
  ChainOrRpcUrl,
  getChainProvider,
  SignerPermissionsInput,
  SignerWithPermissions,
  SmartContract,
  ThirdwebSDK,
  Transaction,
  TransactionResult,
} from "@thirdweb-dev/sdk";
import { Transaction as RawTransaction } from "ethers";
import { AccountAPI } from "./lib/account";
import { AddressZero } from "@account-abstraction/utils";

export class SmartWalletConnector extends Connector<SmartWalletConnectionArgs> {
  private config: SmartWalletConfig;
  private aaProvider: ERC4337EthersProvider | undefined;
  private accountApi: AccountAPI | undefined;
  personalWallet?: EVMWallet;

  constructor(config: SmartWalletConfig) {
    super();
    this.config = config;
  }

  async initialize(params: ConnectParams<SmartWalletConnectionArgs>) {
    const config = this.config;
    const originalProvider = getChainProvider(config.chain, {
      clientId: config.clientId,
      secretKey: config.secretKey,
    }) as providers.BaseProvider;
    const chainSlug = await this.getChainSlug(config.chain, originalProvider);
    const bundlerUrl =
      this.config.bundlerUrl || `https://${chainSlug}.bundler.thirdweb.com`;
    const paymasterUrl =
      this.config.paymasterUrl || `https://${chainSlug}.bundler.thirdweb.com`;
    const entryPointAddress = config.entryPointAddress || ENTRYPOINT_ADDRESS;
    const localSigner = await params.personalWallet.getSigner();
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
              this.config.clientId,
              this.config.secretKey,
            )
        : undefined,
      factoryAddress: config.factoryAddress,
      accountAddress: params.accountAddress,
      factoryInfo: config.factoryInfo || this.defaultFactoryInfo(),
      accountInfo: config.accountInfo || this.defaultAccountInfo(),
      clientId: config.clientId,
      secretKey: config.secretKey,
    };
    this.personalWallet = params.personalWallet;
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
    await this.initialize(connectionArgs);
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
   * Check whether the connected signer can execute a given transaction using the smart wallet.
   * @param transaction the transaction to execute using the smart wallet.
   * @returns whether the connected signer can execute the transaction using the smart wallet.
   */
  async hasPermissionToExecute(transaction: Transaction): Promise<boolean> {
    const accountContract = await this.getAccountContract();
    const signer = await this.getSigner();
    const signerAddress = await signer.getAddress();

    const restrictions = (await accountContract.account.getAllSigners()).filter(
      (item) =>
        ethers.utils.getAddress(item.signer) ===
        ethers.utils.getAddress(signerAddress),
    )[0]?.permissions;

    if (!restrictions) {
      return false;
    }

    return restrictions.approvedCallTargets.includes(transaction.getTarget());
  }

  /**
   * Send a single transaction without waiting for confirmations
   * @param transactions
   * @returns the awaitable transaction
   */
  async send(transaction: Transaction): Promise<providers.TransactionResponse> {
    const signer = await this.getSigner();
    return signer.sendTransaction({
      to: transaction.getTarget(),
      data: transaction.encode(),
      value: await transaction.getValue(),
    });
  }

  /**
   * Execute a single transaction (waiting for confirmations)
   * @param transactions
   * @returns the transaction receipt
   */
  async execute(transaction: Transaction): Promise<TransactionResult> {
    const tx = await this.send(transaction);
    const receipt = await tx.wait();
    return {
      receipt,
    };
  }

  async sendBatch(
    transactions: Transaction<any>[],
  ): Promise<providers.TransactionResponse> {
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
    return await signer.sendTransaction(
      {
        to: await signer.getAddress(),
        data: callData,
        value: 0,
      },
      true, // batched tx flag
    );
  }

  /**
   * Execute multiple transactions in a single batch
   * @param transactions
   * @returns the transaction receipt
   */
  async executeBatch(
    transactions: Transaction<any>[],
  ): Promise<TransactionResult> {
    const tx = await this.sendBatch(transactions);
    const receipt = await tx.wait();
    return {
      receipt,
    };
  }

  async sendRaw(
    transaction: utils.Deferrable<providers.TransactionRequest>,
  ): Promise<providers.TransactionResponse> {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    const signer = await this.getSigner();
    return signer.sendTransaction(transaction);
  }

  async executeRaw(
    transaction: utils.Deferrable<providers.TransactionRequest>,
  ) {
    const tx = await this.sendRaw(transaction);
    const receipt = await tx.wait();
    return {
      receipt,
    };
  }

  async sendBatchRaw(
    transactions: utils.Deferrable<providers.TransactionRequest>[],
  ) {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    const signer = await this.getSigner();
    const resolvedTxs = await Promise.all(
      transactions.map((transaction) =>
        ethers.utils.resolveProperties(transaction),
      ),
    );
    const targets = resolvedTxs.map((tx) => tx.to || AddressZero);
    const data = resolvedTxs.map((tx) => tx.data || "0x");
    const values = resolvedTxs.map((tx) => tx.value || BigNumber.from(0));
    const callData = await this.accountApi.encodeExecuteBatch(
      targets,
      values,
      data,
    );
    return signer.sendTransaction(
      {
        to: await signer.getAddress(),
        data: callData,
        value: 0,
      },
      true, // batched tx flag
    );
  }

  async executeBatchRaw(
    transactions: utils.Deferrable<providers.TransactionRequest>[],
  ) {
    const tx = await this.sendBatchRaw(transactions);
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
    const tx = await signer.sendTransaction(
      {
        to: await signer.getAddress(),
        data: "0x",
      },
      true, // batched tx flag to avoid hitting the Router fallback method
    );
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

  async deployIfNeeded(): Promise<void> {
    const isDeployed = await this.isDeployed();
    if (!isDeployed) {
      await this.deploy();
    }
  }

  async grantPermissions(
    target: string,
    permissions: SignerPermissionsInput,
  ): Promise<TransactionResult> {
    await this.deployIfNeeded();
    const accountContract = await this.getAccountContract();
    return accountContract.account.grantPermissions(target, permissions);
  }

  async revokePermissions(target: string): Promise<TransactionResult> {
    await this.deployIfNeeded();
    const accountContract = await this.getAccountContract();
    return accountContract.account.revokeAccess(target);
  }

  async addAdmin(target: string): Promise<TransactionResult> {
    await this.deployIfNeeded();
    const accountContract = await this.getAccountContract();
    return accountContract.account.grantAdminPermissions(target);
  }

  async removeAdmin(target: string): Promise<TransactionResult> {
    await this.deployIfNeeded();
    const accountContract = await this.getAccountContract();
    return accountContract.account.revokeAdminPermissions(target);
  }

  async getAllActiveSigners(): Promise<SignerWithPermissions[]> {
    const isDeployed = await this.isDeployed();
    if (isDeployed) {
      const accountContract = await this.getAccountContract();
      return accountContract.account.getAllAdminsAndSigners();
    } else {
      const personalWallet = await this.personalWallet?.getSigner();
      if (!personalWallet) {
        throw new Error("Personal wallet not connected");
      }
      return [
        {
          isAdmin: true,
          signer: await personalWallet.getAddress(),
          permissions: {
            startDate: new Date(0),
            expirationDate: new Date(0),
            nativeTokenLimitPerTransaction: BigNumber.from(0),
            approvedCallTargets: [],
          },
        },
      ];
    }
  }

  /**
   * Get the underlying account contract of the smart wallet.
   * @returns the account contract of the smart wallet.
   */
  async getAccountContract(): Promise<SmartContract> {
    const isDeployed = await this.isDeployed();
    if (!isDeployed) {
      throw new Error(
        "Account contract is not deployed yet. You can deploy it manually using SmartWallet.deploy(), or by executing a transaction from this wallet.",
      );
    }
    // getting a new instance everytime
    // to avoid caching issues pre/post deployment
    const sdk = ThirdwebSDK.fromSigner(
      await this.getSigner(),
      this.config.chain,
      {
        clientId: this.config.clientId,
        secretKey: this.config.secretKey,
      },
    );
    if (this.config.accountInfo?.abi) {
      return sdk.getContract(
        await this.getAddress(),
        this.config.accountInfo.abi,
      );
    } else {
      return sdk.getContract(await this.getAddress());
    }
  }

  /**
   * Get the underlying account factory contract of the smart wallet.
   * @returns the account factory contract.
   */
  async getFactoryContract(): Promise<SmartContract> {
    const sdk = ThirdwebSDK.fromSigner(
      await this.getSigner(),
      this.config.chain,
      {
        clientId: this.config.clientId,
        secretKey: this.config.secretKey,
      },
    );
    if (this.config.factoryInfo?.abi) {
      return sdk.getContract(
        this.config.factoryAddress,
        this.config.factoryInfo.abi,
      );
    }
    return sdk.getContract(this.config.factoryAddress);
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
        try {
          return await factory.call("getAddress", [
            owner,
            ethers.utils.toUtf8Bytes(""),
          ]);
        } catch (e) {
          console.log("Falling back to old factory");
          // TODO remove after a few versions
          return factory.call("getAddress", [owner]);
        }
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

  private async getChainSlug(
    chainOrRpc: ChainOrRpcUrl,
    provider: ethers.providers.Provider,
  ): Promise<string> {
    if (typeof chainOrRpc === "object") {
      return chainOrRpc.slug;
    }
    if (typeof chainOrRpc === "number") {
      const chain = getChainByChainId(chainOrRpc);
      return chain.slug;
    }
    if (typeof chainOrRpc === "string") {
      if (chainOrRpc.startsWith("http") || chainOrRpc.startsWith("ws")) {
        // if it's a url, try to get the chain id from the provider
        const chainId = (await provider.getNetwork()).chainId;
        const chain = getChainByChainId(chainId);
        return chain.slug;
      }
      // otherwise its the network name
      return chainOrRpc;
    } else {
      throw new Error(`Invalid network: ${chainOrRpc}`);
    }
  }
}
