import { AbstractClientWallet, WalletOptions } from "./base";
import type { ConnectParams } from "../interfaces/connector";
import type {
  SmartWalletConfig,
  SmartWalletConnectionArgs,
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
// import { signTypedDataInternal } from "@thirdweb-dev/sdk";
import { providers, utils, Bytes, Signer, Contract } from "ethers";

// export types and utils for convenience
export type * from "../connectors/smart-wallet/types";
export {
  type AccessibleSmartWallets,
  getAllSigners,
  getAllSmartWallets,
  getSmartWalletAddress,
  isSmartWalletDeployed,
} from "../connectors/smart-wallet/utils";

export type { PaymasterAPI } from "@account-abstraction/sdk";

const EIP1271_ABI = [
  "function isValidSignature(bytes32 _message, bytes _signature) public view returns (bytes4)",
];
const EIP1271_MAGICVALUE = "0x1626ba7e";

async function checkSmartWalletSignature(
  message: string,
  signature: string,
  address: string,
  provider: providers.JsonRpcSigner,
): Promise<boolean> {
  const walletContract = new Contract(address, EIP1271_ABI, provider);
  const _hashMessage = utils.hashMessage(message);
  try {
    const res = await walletContract.isValidSignature(_hashMessage, signature);
    return res === EIP1271_MAGICVALUE;
  } catch {
    return false;
  }
}

export class SmartWallet extends AbstractClientWallet<
  SmartWalletConfig,
  SmartWalletConnectionArgs
> {
  connector?: SmartWalletConnectorType;

  static meta = {
    name: "Smart Wallet",
    iconURL:
      "ipfs://QmeAJVqn17aDNQhjEU3kcWVZCFBrfta8LzaDGkS8Egdiyk/smart-wallet.svg",
  };

  static id = walletIds.smartWallet as string;
  public get walletName() {
    return "Smart Wallet";
  }

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

  getPersonalWallet() {
    return this.connector?.personalWallet;
  }

  /**
   * @returns the signature of the message
   */
  public async signMessage(message: Bytes | string): Promise<string> {
    const erc4337Signer = await this.getSigner();
    const connector = await this.getConnector();

    // Deploy smart wallet if not already deployed.
    const isDeployed = await connector.isDeployed();
    if (!isDeployed) {
      console.log(
        "Account contract not deployed yet. Deploying account before signing message",
      );
      const tx = await erc4337Signer.sendTransaction({
        to: await this.getAddress(),
        data: "0x",
      });
      await tx.wait();
    }

    // Get underlying signer
    let signer = erc4337Signer;
    if ((signer as any).originalSigner) {
      signer = (signer as any).originalSigner;
    }

    const chainId = await signer.getChainId();
    const address = await connector.getAddress();
    const AccountMessage = [{ name: "message", type: "bytes" }];

    /**
     * We first try to sign the EIP-712 typed data i.e. the message mixed with the smart wallet's domain separator.
     * If this fails, we fallback to the legacy signing method.
     */
    try {
      const signature = await (
        signer as providers.JsonRpcSigner
      )._signTypedData(
        {
          name: "Account",
          version: "1",
          chainId,
          verifyingContract: address,
        },
        { AccountMessage },
        {
          message: utils.defaultAbiCoder.encode(
            ["bytes32"],
            [utils.hashMessage(message)],
          ),
        },
      );

      if (!signature) {
        throw new Error("Failed to sign message");
      }

      const isValid = await checkSmartWalletSignature(
        message as string,
        signature,
        address,
        signer as providers.JsonRpcSigner,
      );

      if (!isValid) {
        throw new Error("Invalid signature");
      }

      return signature;
    } catch {
      return await this.signMessageLegacy(signer, message);
    }
  }

  /**
   * @returns the signature of the message (for legacy EIP-1271 signature verification)
   */
  private async signMessageLegacy(
    signer: Signer,
    message: Bytes | string,
  ): Promise<string> {
    return await signer.signMessage(message);
  }

  /**
   * Check whether the connected signer can execute a given transaction using the smart wallet.
   * @param transaction the transaction to execute using the smart wallet.
   * @returns whether the connected signer can execute the transaction using the smart wallet.
   */
  async hasPermissionToExecute(transaction: Transaction): Promise<boolean> {
    const connector = await this.getConnector();
    return connector.hasPermissionToExecute(transaction);
  }

  /**
   * Send a single transaction without waiting for confirmations
   * @param transactions
   * @returns the transaction result
   */
  async send(transaction: Transaction): Promise<providers.TransactionResponse> {
    const connector = await this.getConnector();
    return connector.send(transaction);
  }

  /**
   * Execute a single transaction and wait for confirmations
   * @param transactions
   * @returns the transaction receipt
   */
  async execute(transaction: Transaction): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.execute(transaction);
  }

  /**
   * Send a multiple transaction in a batch without waiting for confirmations
   * @param transactions
   * @returns the transaction result
   */
  async sendBatch(
    transactions: Transaction[],
  ): Promise<providers.TransactionResponse> {
    const connector = await this.getConnector();
    return connector.sendBatch(transactions);
  }

  /**
   * Execute multiple transactions in a single batch and wait for confirmations
   * @param transactions
   * @returns the transaction receipt
   */
  async executeBatch(
    transactions: Transaction<any>[],
  ): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.executeBatch(transactions);
  }

  /**
   * Send a single raw transaction without waiting for confirmations
   * @param transaction
   * @returns the transaction result
   */
  async sendRaw(
    transaction: utils.Deferrable<providers.TransactionRequest>,
  ): Promise<providers.TransactionResponse> {
    const connector = await this.getConnector();
    return connector.sendRaw(transaction);
  }

  /**
   * Execute a single raw transaction and wait for confirmations
   * @param transaction
   * @returns the transaction receipt
   */
  async executeRaw(
    transaction: utils.Deferrable<providers.TransactionRequest>,
  ): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.executeRaw(transaction);
  }

  /**
   * Estimate the gas cost of a single transaction
   * @param transaction
   * @returns
   */
  async estimate(transaction: Transaction<any>) {
    const connector = await this.getConnector();
    return connector.estimate(transaction);
  }

  /**
   * Estimate the gas cost of a batch of transactions
   * @param transaction
   * @returns
   */
  async estimateBatch(transactions: Transaction<any>[]) {
    const connector = await this.getConnector();
    return connector.estimateBatch(transactions);
  }

  /**
   * Estimate the gas cost of a single raw transaction
   * @param transaction
   * @returns
   */
  async estimateRaw(
    transactions: utils.Deferrable<providers.TransactionRequest>,
  ) {
    const connector = await this.getConnector();
    return connector.estimateRaw(transactions);
  }

  /**
   * Estimate the gas cost of a batch of raw transactions
   * @param transaction
   * @returns
   */
  async estimateBatchRaw(
    transactions: utils.Deferrable<providers.TransactionRequest>[],
  ) {
    const connector = await this.getConnector();
    return connector.estimateBatchRaw(transactions);
  }

  /**
   * Send multiple raw transaction in a batch without waiting for confirmations
   * @param transaction
   * @returns the transaction result
   */
  async sendBatchRaw(
    transactions: utils.Deferrable<providers.TransactionRequest>[],
  ): Promise<providers.TransactionResponse> {
    const connector = await this.getConnector();
    return connector.sendBatchRaw(transactions);
  }

  /**
   * Execute multiple raw transactions in a single batch and wait for confirmations
   * @param transaction
   * @returns the transaction receipt
   */
  async executeBatchRaw(
    transactions: utils.Deferrable<providers.TransactionRequest>[],
  ): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.executeBatchRaw(transactions);
  }

  /**
   * Manually deploy the smart wallet contract. If already deployed this will throw an error.
   * Note that this is not necessary as the smart wallet will be deployed automatically on the first transaction the user makes.
   * @returns the transaction receipt
   */
  async deploy(): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.deploy();
  }

  /**
   * Manually deploy the smart wallet contract. If already deployed this will do nothing.
   * Note that this is not necessary as the smart wallet will be deployed automatically on the first transaction the user makes.
   * @returns the transaction receipt
   */
  async deployIfNeeded(): Promise<void> {
    const connector = await this.getConnector();
    return connector.deployIfNeeded();
  }

  /**
   * Check if the smart wallet contract is deployed
   * @returns true if the smart wallet contract is deployed
   */
  async isDeployed(): Promise<boolean> {
    const connector = await this.getConnector();
    return connector.isDeployed();
  }

  /**
   * Create and add a session key to the smart wallet.
   * @param keyAddress the address of the session key to add.
   * @param permissions the permissions to grant to the session key.
   */
  async createSessionKey(
    keyAddress: string,
    permissions: SignerPermissionsInput,
  ): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.grantPermissions(keyAddress, permissions);
  }

  /**
   * Remove a session key from the smart wallet.
   * @param keyAddress the address of the session key to remove.
   */
  async revokeSessionKey(keyAddress: string): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.revokePermissions(keyAddress);
  }

  /**
   * Add another admin to the smart wallet.
   * @param adminAddress the address of the admin to add.
   */
  async addAdmin(adminAddress: string): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.addAdmin(adminAddress);
  }

  /**
   * Remove an admin from the smart wallet.
   * @param adminAddress the address of the admin to remove.
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
   * @returns the account contract of the smart wallet.
   */
  async getAccountContract(): Promise<SmartContract> {
    const connector = await this.getConnector();
    return connector.getAccountContract();
  }

  /**
   * Get the underlying account factory contract of the smart wallet.
   * @returns the account factory contract.
   */
  async getFactoryContract(): Promise<SmartContract> {
    const connector = await this.getConnector();
    return connector.getFactoryContract();
  }

  autoConnect(params: ConnectParams<SmartWalletConnectionArgs>) {
    return this.connect(params);
  }
}
