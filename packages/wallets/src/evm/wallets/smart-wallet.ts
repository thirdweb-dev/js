import { AbstractClientWallet, WalletOptions } from "./base";
import type { ConnectParams } from "../interfaces/connector";
import type {
  SmartWalletConfig,
  SmartWalletConnectionArgs,
  TransactionOptions,
} from "../connectors/smart-wallet/types";
import type { SmartWalletConnector as SmartWalletConnectorType } from "../connectors/smart-wallet";
import {
  Transaction,
  TransactionResult,
  SmartContract,
  SignerPermissionsInput,
  SignerWithPermissions,
} from "@thirdweb-dev/sdk";
import { walletIds } from "../constants/walletIds";
import { getValidChainRPCs } from "@thirdweb-dev/chains";
import { providers, utils } from "ethers";

// export types and utils for convenience
export type * from "../connectors/smart-wallet/types";
export {
  type AccessibleSmartWallets,
  getAllSigners,
  getAllSmartWallets,
  getSmartWalletAddress,
  isSmartWalletDeployed,
  getUserOpReceipt,
} from "../connectors/smart-wallet/utils";

export type { UserOperationStruct } from "@account-abstraction/contracts";

/**
 * Let your users connect to a [Smart Wallet](https://portal.thirdweb.com/glossary/smart-wallet).
 *
 * A Smart Wallet is a wallet that is controlled by a smart contract following the [ERC-4337 specification](https://eips.ethereum.org/EIPS/eip-4337).
 *
 * _For a complete overview of Smart Wallets, visit the [Smart Wallet SDK documentation](https://portal.thirdweb.com/wallets/smart-wallet)_
 *
 * #### References
 * - [How to use smart wallets with the thirdweb SDKs.](https://portal.thirdweb.com/wallets/smart-wallet)
 * - [Learn more about what a smart wallet is and how it works.](https://portal.thirdweb.com/wallets/smart-wallet/how-it-works)
 * - [Using the thirdweb account abstraction infrastructure.](https://portal.thirdweb.com/wallets/smart-wallet/infrastructure)
 *
 * @example
 *
 * To connect to a smart wallet, a personal wallet (acting as the key to the smart wallet) must first be connected.
 *
 * ```ts
 * import { LocalWallet, SmartWallet } from "@thirdweb-dev/wallets";
 * import { Goerli } from "@thirdweb-dev/chains";
 *
 * // First, connect the personal wallet, which can be any wallet (metamask, walletconnect, etc.)
 * // Here we're just generating a new local wallet which can be saved later
 * const personalWallet = new LocalWallet();
 * await personalWallet.generate();
 *
 * // Setup the Smart Wallet configuration
 * const config: SmartWalletConfig = {
 *   chain: Goerli, // the chain where your smart wallet will be or is deployed
 *   factoryAddress: "{{factory_address}}", // your own deployed account factory address
 *   clientId: "YOUR_CLIENT_ID", // Use client id if using on the client side, get it from dashboard settings
 *   secretKey: "YOUR_SECRET_KEY", // Use secret key if using on the server, get it from dashboard settings
 *   gasless: true, // enable or disable gasless transactions
 * };
 *
 * // Then, connect the Smart wallet
 * const wallet = new SmartWallet(config);
 * await wallet.connect({
 *   personalWallet,
 * });
 *
 * // You can then use this wallet to perform transactions via the SDK
 * const sdk = await ThirdwebSDK.fromWallet(wallet, Goerli);
 * ```
 *
 * @wallet
 */
export class SmartWallet extends AbstractClientWallet<
  SmartWalletConfig,
  SmartWalletConnectionArgs
> {
  /**
   * @internal
   */
  connector?: SmartWalletConnectorType;

  /**
   * @internal
   */
  static meta = {
    name: "Smart Wallet",
    iconURL:
      "ipfs://QmeAJVqn17aDNQhjEU3kcWVZCFBrfta8LzaDGkS8Egdiyk/smart-wallet.svg",
  };

  /**
   * @internal
   */
  static id = walletIds.smartWallet as string;

  /**
   * @internal
   */
  public get walletName() {
    return "Smart Wallet";
  }

  /**
   *
   * @param options - The `options` object includes the following properties:
   * ### Required Properties
   *
   * #### chain
   * The chain that the Smart Wallet contract is deployed to.
   *
   * Either a `Chain` object, from the [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package, a chain name, or an RPC URL.
   *
   *
   * #### factoryAddress
   * The address of the Smart Wallet Factory contract.
   *
   * Must be a `string`.
   *
   *
   * #### gasless
   * Whether to turn on or off gasless transactions.
   *
   * - If set to `true`, all gas fees will be paid by a paymaster.
   * - If set to `false`, all gas fees will be paid by the Smart Wallet itself (needs to be funded).
   *
   * Must be a `boolean`.
   *
   *
   * ### Optional properties
   *
   * #### clientId or secretKey (recommended)
   * Your API key can be obtained from the [thirdweb dashboard](https://thirdweb.com/create-api-key).
   *
   * If you're using your own bundler and paymaster, you can set this to an empty string.
   *
   * You can use either the `clientId` or the `secretKey` depending on whether your application is client or server side.
   *
   * Must be a `string`.
   *
   * #### factoryInfo
   * Customize how the Smart Wallet Factory contract is interacted with. If not provided, the default functions will be used.
   *
   * Must be a `object`. The object can contain the following properties:
   *
   * - `createAccount` - a function that returns the transaction object to create a new Smart Wallet.
   * - `getAccountAddress` - a function that returns the address of the Smart Wallet contract given the owner address.
   * - `abi` - optional ABI. If not provided, the ABI will be auto-resolved.
   *
   * ```javascript
   *  const config: SmartWalletConfig = {
   *       chain,
   *       gasless,
   *       factoryAddress,
   *       clientId,
   *       factoryInfo: {
   *         createAccount: async (factory, owner) => {
   *           return factory.prepare("customCreateAccount", [
   *             owner,
   *             getExtraData(),
   *           ]);
   *         },
   *         getAccountAddress: async (factory, owner) => {
   *           return factory.call("getAccountAddress", [owner]);
   *         },
   *         abi: [...]
   *       },
   *     };
   * ```
   *
   *
   * #### accountInfo
   * Customize how the Smart Wallet Account contract is interacted with. If not provided, the default functions will be used.
   *
   * Must be a `object`. The object can contain the following properties:
   *
   * - `execute` - a function that returns the transaction object to execute an arbitrary transaction.
   * - `getNonce` - a function that returns the current nonce of the account.
   * - `abi` - optional ABI. If not provided, the ABI will be auto-resolved.
   *
   * ```javascript
   *  const config: SmartWalletConfig = {
   *       chain,
   *       gasless,
   *       factoryAddress,
   *       clientId,
   *       accountInfo: {
   *         execute: async (account, target, value, data) => {
   *           return account.prepare("customExecute", [
   *             target, value, data
   *           ]);
   *         },
   *         getNonce: async (account) => {
   *           return account.call("getNonce");
   *         },
   *         abi: [...]
   *       },
   *     };
   * ```
   *
   * #### bundlerUrl
   * Your own bundler URL to send user operations to. Uses thirdweb's bundler by default.
   *
   * Must be a `string`.
   *
   * #### paymasterUrl
   * Your own paymaster URL to send user operations to for gasless transactions. Uses thirdweb's paymaster by default.
   *
   * Must be a `string`.
   *
   * #### paymasterAPI
   * Fully customize how the paymaster data is computed.
   *
   * Must be a `PaymasterAPI` class.
   *
   * ```javascript
   * class MyPaymaster extends PaymasterAPI {
   *   async getPaymasterAndData(
   *     userOp: Partial<UserOperationStruct>,
   *   ): Promise<string> {
   *     // your implementation, must return the signed paymaster data
   *   }
   * }
   *
   * const config: SmartWalletConfig = {
   *   chain,
   *   gasless,
   *   factoryAddress,
   *   clientId,
   *   // highlight-start
   *   paymasterAPI: new MyPaymaster(),
   *   // highlight-end
   * };
   * ```
   *
   *
   * #### entryPointAddress
   * The entrypoint contract address. Uses v0.6 by default.
   *
   * Must be a `string`.
   *
   * #### deployOnSign
   * Whether to deploy the smart wallet when the user signs a message. Defaults to true.
   *
   * Must be a `boolean`.
   *
   * #### chains
   * Provide an array of chains you want to support.
   *
   * Must be an array of `Chain` objects, from the [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package.
   *
   * Defaults to thirdweb's [default chains](/react/react.thirdwebprovider#default-chains).
   *
   * #### dappMetadata
   * Information about your app that the wallet will display when your app tries to connect to it.
   *
   * Must be an object containing `name`, `url` and optionally `description` and `logoUrl` properties.
   *
   * ```javascript
   * import { SmartWallet } from "@thirdweb-dev/wallets";
   *
   * const wallet = new SmartWallet({
   *   dappMetadata: {
   *     name: "thirdweb powered dApp",
   *     url: "https://thirdweb.com",
   *     description: "thirdweb powered dApp", // optional
   *     logoUrl: "https://thirdweb.com/favicon.ico", // optional
   *   },
   * });
   * ```
   *
   */
  constructor(options: WalletOptions<SmartWalletConfig>) {
    if (options.clientId && typeof options.chain === "object") {
      try {
        options.chain = {
          ...options.chain,
          rpc: getValidChainRPCs(options.chain, options.clientId),
        };
      } catch {}
    }

    super(SmartWallet.id, {
      ...options,
    });
  }

  async getConnector(): Promise<SmartWalletConnectorType> {
    if (!this.connector) {
      const { SmartWalletConnector } = await import(
        "../connectors/smart-wallet"
      );
      this.connector = new SmartWalletConnector(
        this.options as SmartWalletConfig,
      );
    }
    return this.connector;
  }

  /**
   * Get the personal wallet that is connected to the Smart Wallet.
   * @example
   * ```ts
   * const personalWallet = wallet.getPersonalWallet();
   * ```
   */
  getPersonalWallet() {
    return this.connector?.personalWallet;
  }

  /**
   * Check whether the connected signer can execute a given transaction using the smart wallet.
   * @param transaction - The transaction to execute using the smart wallet.
   * @returns `Promise<true>` if connected signer can execute the transaction using the smart wallet.
   */
  async hasPermissionToExecute(transaction: Transaction): Promise<boolean> {
    const connector = await this.getConnector();
    return connector.hasPermissionToExecute(transaction);
  }

  /**
   * Send a single transaction without waiting for confirmations
   * @param transaction - the transaction to send
   * @param options - optional transaction options
   * @returns The transaction result
   */
  async send(
    transaction: Transaction,
    options?: TransactionOptions,
  ): Promise<providers.TransactionResponse> {
    const connector = await this.getConnector();
    return connector.send(transaction, options);
  }

  /**
   * Execute a single transaction and wait for confirmations
   *
   * @example
   * ```javascript
   * const transaction = prepareTransaction();
   * await wallet.execute(transaction);
   * ```
   *
   * @param transaction -
   * The transaction to execute. Must be of type `Transaction` from the [`@thirdweb-dev/sdk`](https://www.npmjs.com/package/\@thirdweb-dev/sdk) package.
   *
   * Creating these transactions can be done easily using the [Transaction Builder](https://portal.thirdweb.com/typescript/v4/interact#prepare) from the thirdweb SDK.
   * @param options - optional transaction options
   * @returns `TransactionResult` containing the transaction receipt.
   */
  async execute(
    transaction: Transaction,
    options?: TransactionOptions,
  ): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.execute(transaction, options);
  }

  /**
   * Send a multiple transaction in a batch without waiting for confirmations
   * @param transactions -
   * An array of transactions to send. Must be of type `Transaction[]` from the [`@thirdweb-dev/sdk`](https://www.npmjs.com/package/\@thirdweb-dev/sdk) package.
   *
   * Creating these transactions can be done easily using the [Transaction Builder](typescript/sdk.smartcontract.prepare) from the thirdweb SDK.
   * @param options - optional transaction options
   * @returns `TransactionResult` containing the transaction receipt.
   */
  async sendBatch(
    transactions: Transaction[],
    options?: TransactionOptions,
  ): Promise<providers.TransactionResponse> {
    const connector = await this.getConnector();
    return connector.sendBatch(transactions, options);
  }

  /**
   * Execute multiple transactions in a single batch and wait for confirmations, only requiring one signature from the personal wallet.
   *
   * ```javascript
   * // Then you can execute multiple transactions at once
   * const transactions = [
   *   prepareTransaction1(),
   *   prepareTransaction2(),
   *   prepareTransaction3(),
   * ];
   * await wallet.executeBatch(transactions);
   * ```
   *
   * @param transactions -
   * An array of transactions to execute. Must be of type `Transaction[]` from the [`@thirdweb-dev/sdk`](https://www.npmjs.com/package/\@thirdweb-dev/sdk) package.
   *
   * Creating these transactions can be done easily using the [Transaction Builder](typescript/sdk.smartcontract.prepare) from the thirdweb SDK.
   *
   * @param options - optional transaction options
   * @returns `TransactionResult` containing the transaction receipt.
   */
  async executeBatch(
    transactions: Transaction<any>[],
    options?: TransactionOptions,
  ): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.executeBatch(transactions, options);
  }

  /**
   * Send a single raw transaction without waiting for confirmations
   * @param transaction - the transaction to send
   * @param options - optional transaction options
   * @returns The transaction result
   */
  async sendRaw(
    transaction: utils.Deferrable<providers.TransactionRequest>,
    options?: TransactionOptions,
  ): Promise<providers.TransactionResponse> {
    const connector = await this.getConnector();
    return connector.sendRaw(transaction, options);
  }

  /**
   * Execute a single raw transaction and wait for confirmations
   * @param transaction - the transaction to execute
   * @param options - optional transaction options
   * @returns The transaction receipt
   */
  async executeRaw(
    transaction: utils.Deferrable<providers.TransactionRequest>,
    options?: TransactionOptions,
  ): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.executeRaw(transaction, options);
  }

  /**
   * Estimate the gas cost of a single transaction
   * @param transaction - the transaction to estimate
   * @param options - optional transaction options
   * @returns
   */
  async estimate(transaction: Transaction<any>, options?: TransactionOptions) {
    const connector = await this.getConnector();
    return connector.estimate(transaction, options);
  }

  /**
   * Estimate the gas cost of a batch of transactions
   * @param transactions - the transactions to estimate
   * @param options - optional transaction options
   * @returns
   */
  async estimateBatch(
    transactions: Transaction<any>[],
    options?: TransactionOptions,
  ) {
    const connector = await this.getConnector();
    return connector.estimateBatch(transactions, options);
  }

  /**
   * Estimate the gas cost of a single raw transaction
   * @param transactions - the transactions to estimate
   * @param options - optional transaction options
   * @returns
   */
  async estimateRaw(
    transactions: utils.Deferrable<providers.TransactionRequest>,
    options?: TransactionOptions,
  ) {
    const connector = await this.getConnector();
    return connector.estimateRaw(transactions, options);
  }

  /**
   * Estimate the gas cost of a batch of raw transactions
   * @param transactions - the transactions to estimate
   * @param options - optional transaction options
   * @returns
   */
  async estimateBatchRaw(
    transactions: utils.Deferrable<providers.TransactionRequest>[],
    options?: TransactionOptions,
  ) {
    const connector = await this.getConnector();
    return connector.estimateBatchRaw(transactions, options);
  }

  /**
   * Send multiple raw transaction in a batch without waiting for confirmations
   * @param transactions - the transactions to send
   * @param options - optional transaction options
   * @returns The transaction result
   */
  async sendBatchRaw(
    transactions: utils.Deferrable<providers.TransactionRequest>[],
    options?: TransactionOptions,
  ): Promise<providers.TransactionResponse> {
    const connector = await this.getConnector();
    return connector.sendBatchRaw(transactions, options);
  }

  /**
   * Execute multiple raw transactions in a single batch and wait for confirmations
   * @param transactions - the transactions to execute
   * @param options - optional transaction options
   * @returns The transaction receipt
   */
  async executeBatchRaw(
    transactions: utils.Deferrable<providers.TransactionRequest>[],
    options?: TransactionOptions,
  ): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.executeBatchRaw(transactions, options);
  }

  /**
   * Manually deploy the smart wallet contract. If already deployed this will throw an error.
   *
   * Note that this is not necessary as the smart wallet will be deployed automatically on the first transaction the user makes.
   *
   * @example
   * ```ts
   * const tx = await wallet.deploy();
   * ```
   * @param options - optional transaction options
   * @returns The transaction receipt
   */
  async deploy(options?: TransactionOptions): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.deploy(options);
  }

  /**
   * Manually deploy the smart wallet contract. If already deployed this will do nothing.
   * Note that this is not necessary as the smart wallet will be deployed automatically on the first transaction the user makes.
   *
   * @example
   * ```ts
   * await wallet.deployIfNeeded();
   * ```
   * @param options - optional transaction options
   * @returns The transaction receipt
   */
  async deployIfNeeded(options?: TransactionOptions): Promise<void> {
    const connector = await this.getConnector();
    return connector.deployIfNeeded(options);
  }

  /**
   * Check if the smart wallet contract is deployed
   * @example
   * ```ts
   * const isDeployed = await wallet.isDeployed();
   * ```
   *
   * @returns `true` if the smart wallet contract is deployed
   */
  async isDeployed(): Promise<boolean> {
    const connector = await this.getConnector();
    return connector.isDeployed();
  }

  /**
   * Create and add a session key to the Smart Wallet with specific permissions.
   * @example
   * ```javascript
   * // Then you can add session keys with permissions
   * await wallet.createSessionKey(
   *   "0x...", // the session key address
   *   {
   *       approvedCallTargets: ["0x..."], // the addresses of contracts that the session key can call
   *       nativeTokenLimitPerTransaction: 0.1, // the maximum amount of native token (in ETH) that the session key can spend per transaction
   *       startDate: new Date(), // the date when the session key becomes active
   *       expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // the date when the session key expires
   *   }
   * );
   * ```
   *
   * @param keyAddress - The address of the session key to add to the Smart Wallet.
   *
   * @param permissions -
   * The specific permissions to give to the session key.
   * Must be of type `SignerPermissionsInput` from the [`@thirdweb-dev/sdk`](https://www.npmjs.com/package/\@thirdweb-dev/sdk) package.
   *
   * ```typescript
   * {
   *   startDate: Date;
   *   expirationDate: Date;
   *   nativeTokenLimitPerTransaction: number;
   *   approvedCallTargets: string[];
   * }
   * ```
   */
  async createSessionKey(
    keyAddress: string,
    permissions: SignerPermissionsInput,
  ): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.grantPermissions(keyAddress, permissions);
  }

  /**
   * Revoke a session key from the Smart Wallet.
   * @example
   * ```javascript
   * await wallet.revokeSessionKey(
   *   "0x...", // the session key address
   * );
   * ```
   *
   * @param keyAddress - The address of the session key to revoke.
   */
  async revokeSessionKey(keyAddress: string): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.revokePermissions(keyAddress);
  }

  /**
   * Add another admin to the smart wallet.
   * @param adminAddress - The address of the admin to add.
   */
  async addAdmin(adminAddress: string): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.addAdmin(adminAddress);
  }

  /**
   * Remove an admin from the smart wallet.
   * @param adminAddress - The address of the admin to remove.
   */
  async removeAdmin(adminAddress: string): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.removeAdmin(adminAddress);
  }

  /**
   * Get all the admins and session keys active on the smart wallet.
   */
  async getAllActiveSigners(): Promise<SignerWithPermissions[]> {
    const connector = await this.getConnector();
    return connector.getAllActiveSigners();
  }

  /**
   * Get the underlying account contract of the smart wallet.
   * @returns The account contract of the smart wallet.
   */
  async getAccountContract(): Promise<SmartContract> {
    const connector = await this.getConnector();
    return connector.getAccountContract();
  }

  /**
   * Get the underlying account factory contract of the smart wallet.
   * @returns The account factory contract.
   */
  async getFactoryContract(): Promise<SmartContract> {
    const connector = await this.getConnector();
    return connector.getFactoryContract();
  }

  autoConnect(params: ConnectParams<SmartWalletConnectionArgs>) {
    return this.connect(params);
  }

  /**
   * Connect the SmartWallet with given personalWallet
   * @param connectOptions -
   * The `connectOptions` object includes the following properties:
   *
   * #### personalWallet
   * The instance of a personal wallet that can sign transactions on the Smart Wallet.
   * Must be of type `EVMWallet` instance such as `CoinbaseWallet` or `MetamaskWallet`.
   *
   * @returns A Promise that resolves to the address of the Smart Wallet.
   */
  connect(
    connectOptions?: ConnectParams<SmartWalletConnectionArgs> | undefined,
  ): Promise<string> {
    return super.connect(connectOptions);
  }
}
