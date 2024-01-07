import { Chain } from "@thirdweb-dev/chains";
import { ConnectParams, Connector } from "../../interfaces/connector";
import { ERC4337EthersProvider } from "./lib/erc4337-provider";
import { getVerifyingPaymaster } from "./lib/paymaster";
import { create4337Provider } from "./lib/provider-utils";
import {
  AccountContractInfo,
  BatchData,
  FactoryContractInfo,
  ProviderConfig,
  SmartWalletConfig,
  SmartWalletConnectionArgs,
} from "./types";
import { ENTRYPOINT_ADDRESS } from "./lib/constants";
import { EVMWallet } from "../../interfaces";
import { ERC4337EthersSigner } from "./lib/erc4337-signer";
import { BigNumber, constants, ethers, providers, utils } from "ethers";
import {
  getChainProvider,
  getGasPrice,
  SignerPermissionsInput,
  SignerWithPermissions,
  SmartContract,
  ThirdwebSDK,
  Transaction,
  TransactionResult,
} from "@thirdweb-dev/sdk";
import { AccountAPI } from "./lib/account";
import { TransactionDetailsForUserOp } from "./lib/transaction-details";

export class SmartWalletConnector extends Connector<SmartWalletConnectionArgs> {
  protected config: SmartWalletConfig;
  private aaProvider: ERC4337EthersProvider | undefined;
  private accountApi: AccountAPI | undefined;
  personalWallet?: EVMWallet;
  chainId?: number;

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
    this.chainId = (await originalProvider.getNetwork()).chainId;
    const bundlerUrl =
      this.config.bundlerUrl || `https://${this.chainId}.bundler.thirdweb.com`;
    const paymasterUrl =
      this.config.paymasterUrl ||
      `https://${this.chainId}.bundler.thirdweb.com`;
    const entryPointAddress = config.entryPointAddress || ENTRYPOINT_ADDRESS;
    const localSigner = await params.personalWallet.getSigner();
    const providerConfig: ProviderConfig = {
      chain: config.chain,
      localSigner,
      entryPointAddress,
      bundlerUrl,
      paymasterAPI: this.config.paymasterAPI
          ? this.config.paymasterAPI
          : getVerifyingPaymaster(
              paymasterUrl,
              entryPointAddress,
              this.config.clientId,
              this.config.secretKey,
            ),
      gasless: config.gasless,
      factoryAddress: config.factoryAddress,
      accountAddress: params.accountAddress,
      factoryInfo: config.factoryInfo || this.defaultFactoryInfo(),
      accountInfo: config.accountInfo || this.defaultAccountInfo(),
      clientId: config.clientId,
      secretKey: config.secretKey,
    };
    this.personalWallet = params.personalWallet;
    const accountApi = new AccountAPI(providerConfig, originalProvider);
    this.aaProvider = create4337Provider(
      providerConfig,
      accountApi,
      originalProvider,
      this.chainId,
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
   * @param transaction - the transaction to execute using the smart wallet.
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

  /// PREPARED TRANSACTIONS

  /**
   * Send a single transaction without waiting for confirmations
   * @param transaction - the transaction to send
   * @returns The awaitable transaction
   */
  async send(
    transaction: Transaction,
    config?: { gasless?: boolean }
  ): Promise<providers.TransactionResponse> {
    const signer = await this.getSigner();
    return signer.sendTransaction({
      to: transaction.getTarget(),
      data: transaction.encode(),
      value: await transaction.getValue(),
    }, config);
  }

  /**
   * Execute a single transaction (waiting for confirmations)
   * @param transaction - the transaction to execute
   * @returns The transaction receipt
   */
  async execute(
    transaction: Transaction,
    config?: { gasless?: boolean },
  ): Promise<TransactionResult> {
    const tx = await this.send(transaction, config);
    const receipt = await tx.wait();
    return {
      receipt,
    };
  }

  async sendBatch(
    transactions: Transaction<any>[],
    config?: { gasless?: boolean }
  ): Promise<providers.TransactionResponse> {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    const signer = await this.getSigner();
    const { tx, batchData } = await this.prepareBatchTx(transactions);
    return await signer.sendTransaction(
      {
        to: await signer.getAddress(),
        data: tx.encode(),
        value: 0,
      },
      {
        ...config,
        batchData
      },
    );
  }

  /**
   * Execute multiple transactions in a single batch
   * @param transactions - the transactions to execute
   * @returns The transaction receipt
   */
  async executeBatch(
    transactions: Transaction<any>[],
    config?: { gasless?: boolean },
  ): Promise<TransactionResult> {
    const tx = await this.sendBatch(transactions, config);
    const receipt = await tx.wait();
    return {
      receipt,
    };
  }

  /// RAW TRANSACTIONS

  async sendRaw(
    transaction: utils.Deferrable<providers.TransactionRequest>,
    config?: { gasless?: boolean }
  ): Promise<providers.TransactionResponse> {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    const signer = await this.getSigner();
    return signer.sendTransaction(transaction, config);
  }

  async executeRaw(
    transaction: utils.Deferrable<providers.TransactionRequest>,
    config?: { gasless?: boolean },
  ) {
    const tx = await this.sendRaw(transaction, config);
    const receipt = await tx.wait();
    return {
      receipt,
    };
  }

  async sendBatchRaw(
    transactions: utils.Deferrable<providers.TransactionRequest>[],
    config?: { gasless?: boolean }
  ) {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    const signer = await this.getSigner();
    const batch = await this.prepareBatchRaw(transactions);
    return signer.sendTransaction(
      {
        to: await signer.getAddress(),
        data: batch.tx.encode(),
        value: 0,
      },
      {
        ...config,
        batchData: batch.batchData, // batched tx flag
      },
    );
  }

  async executeBatchRaw(
    transactions: utils.Deferrable<providers.TransactionRequest>[],
    config?: { gasless?: boolean },
  ) {
    const tx = await this.sendBatchRaw(transactions, config);
    const receipt = await tx.wait();
    return {
      receipt,
    };
  }

  /// ESTIMATION

  async estimate(transaction: Transaction) {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    return this.estimateTx({
      target: transaction.getTarget(),
      data: transaction.encode(),
      value: await transaction.getValue(),
      gasLimit: await transaction.getOverrides().gasLimit,
      maxFeePerGas: await transaction.getOverrides().maxFeePerGas,
      maxPriorityFeePerGas: await transaction.getOverrides()
        .maxPriorityFeePerGas,
      nonce: await transaction.getOverrides().nonce,
    });
  }

  async estimateRaw(
    transaction: utils.Deferrable<providers.TransactionRequest>,
  ) {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    const tx = await ethers.utils.resolveProperties(transaction);
    return this.estimateTx({
      target: tx.to || constants.AddressZero,
      data: tx.data?.toString() || "",
      value: tx.value || BigNumber.from(0),
      gasLimit: tx.gasLimit,
      maxFeePerGas: tx.maxFeePerGas,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
      nonce: tx.nonce,
    });
  }

  async estimateBatch(transactions: Transaction<any>[]) {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    const { tx, batchData } = await this.prepareBatchTx(transactions);
    return this.estimateTx(
      {
        target: tx.getTarget(),
        data: tx.encode(),
        value: await tx.getValue(),
        gasLimit: await tx.getOverrides().gasLimit,
        maxFeePerGas: await tx.getOverrides().maxFeePerGas,
        maxPriorityFeePerGas: await tx.getOverrides().maxPriorityFeePerGas,
        nonce: await tx.getOverrides().nonce,
      },
      batchData,
    );
  }

  async estimateBatchRaw(
    transactions: utils.Deferrable<providers.TransactionRequest>[],
  ) {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    const { tx, batchData } = await this.prepareBatchRaw(transactions);
    return this.estimateTx(
      {
        target: tx.getTarget(),
        data: tx.encode(),
        value: await tx.getValue(),
        gasLimit: await tx.getOverrides().gasLimit,
        maxFeePerGas: await tx.getOverrides().maxFeePerGas,
        maxPriorityFeePerGas: await tx.getOverrides().maxPriorityFeePerGas,
        nonce: await tx.getOverrides().nonce,
      },
      batchData,
    );
  }

  //// DEPLOYMENT

  /**
   * Manually deploy the smart wallet contract. If already deployed this will throw an error.
   * Note that this is not necessary as the smart wallet will be deployed automatically on the first transaction the user makes.
   * @returns The transaction receipt
   */
  async deploy(config?: { gasless?: boolean }): Promise<TransactionResult> {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    const signer = await this.getSigner();
    const tx = await signer.sendTransaction(
      {
        to: await signer.getAddress(),
        data: "0x",
      },
      {
        ...config,
        batchData: {
          targets: [],
          data: [],
          values: [],
        } // batched tx flag to avoid hitting the Router fallback method
      },
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

  async deployIfNeeded(config?: { gasless?: boolean }): Promise<void> {
    const isDeployed = await this.isDeployed();
    if (!isDeployed) {
      await this.deploy(config);
    }
  }

  //// PERMISSIONS

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
   * @returns The account contract of the smart wallet.
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
   * @returns The account factory contract.
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

  protected defaultFactoryInfo(): FactoryContractInfo {
    return {
      createAccount: async (factory, owner) => {
        return factory.prepare("createAccount", [
          owner,
          ethers.utils.toUtf8Bytes(""),
        ]);
      },
      getAccountAddress: async (factory, owner) => {
        return await factory.call("getAddress", [
          owner,
          ethers.utils.toUtf8Bytes(""),
        ]);
      },
    };
  }

  protected defaultAccountInfo(): AccountContractInfo {
    return {
      execute: async (account, target, value, data) => {
        return account.prepare("execute", [target, value, data]);
      },
      getNonce: async (account) => {
        return account.call("getNonce", []);
      },
    };
  }

  /// PRIVATE METHODS

  private async estimateTx(
    tx: TransactionDetailsForUserOp,
    batchData?: BatchData,
  ) {
    if (!this.accountApi || !this.aaProvider) {
      throw new Error("Personal wallet not connected");
    }
    let deployGasLimit = BigNumber.from(0);
    const [provider, isDeployed] = await Promise.all([
      this.getProvider(),
      this.isDeployed(),
    ]);
    if (!isDeployed) {
      deployGasLimit = await this.estimateDeploymentGasLimit();
    }
    const [userOp, gasPrice] = await Promise.all([
      this.accountApi.createUnsignedUserOp(
        this.aaProvider.httpRpcClient,
        tx,
        {
          batchData
        },
      ),
      getGasPrice(provider),
    ]);
    const resolved = await utils.resolveProperties(userOp);
    const transactionGasLimit = BigNumber.from(resolved.callGasLimit);
    const transactionCost = transactionGasLimit.mul(gasPrice);
    const deployCost = deployGasLimit.mul(gasPrice);
    const totalCost = deployCost.add(transactionCost);

    return {
      ether: utils.formatEther(totalCost),
      wei: totalCost,
      details: {
        deployGasLimit,
        transactionGasLimit,
        gasPrice,
        transactionCost,
        deployCost,
        totalCost,
      },
    };
  }

  private async estimateDeploymentGasLimit() {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    const initCode = await this.accountApi.getInitCode();
    const [initGas, verificationGasLimit] = await Promise.all([
      this.accountApi.estimateCreationGas(initCode),
      this.accountApi.getVerificationGasLimit(),
    ]);
    return BigNumber.from(verificationGasLimit).add(initGas);
  }

  private async prepareBatchRaw(
    transactions: ethers.utils.Deferrable<ethers.providers.TransactionRequest>[],
  ) {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    const resolvedTxs = await Promise.all(
      transactions.map((transaction) =>
        ethers.utils.resolveProperties(transaction),
      ),
    );
    const targets = resolvedTxs.map((tx) => tx.to || constants.AddressZero);
    const data = resolvedTxs.map((tx) => tx.data || "0x");
    const values = resolvedTxs.map((tx) => tx.value || BigNumber.from(0));
    return {
      tx: await this.accountApi.prepareExecuteBatch(targets, values, data),
      batchData: {
        targets,
        data,
        values,
      },
    };
  }

  private async prepareBatchTx(transactions: Transaction<any>[]) {
    if (!this.accountApi) {
      throw new Error("Personal wallet not connected");
    }
    const targets = transactions.map((tx) => tx.getTarget());
    const data = transactions.map((tx) => tx.encode());
    const values = await Promise.all(transactions.map((tx) => tx.getValue()));
    return {
      tx: await this.accountApi.prepareExecuteBatch(targets, values, data),
      batchData: {
        targets,
        data,
        values,
      },
    };
  }
}
