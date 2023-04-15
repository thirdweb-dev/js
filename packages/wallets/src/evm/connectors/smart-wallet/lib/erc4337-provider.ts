/* eslint-disable @typescript-eslint/no-parameter-properties */
import { BigNumber, ethers, Signer } from "ethers";
import { hexValue, resolveProperties } from "ethers/lib/utils";

import {
  EntryPoint,
  UserOperationStruct,
} from "@account-abstraction/contracts";
import { getUserOpHash } from "@account-abstraction/utils";
import { ClientConfig, HttpRpcClient } from "@account-abstraction/sdk";
import { UserOperationEventListener } from "./userop-event";
import { BaseAccountAPI } from "./base-api";
import { ERC4337EthersSigner } from "./erc4337-signer";

export class ERC4337EthersProvider extends ethers.providers.BaseProvider {
  initializedBlockNumber!: number;

  readonly signer: ERC4337EthersSigner;

  constructor(
    readonly chainId: number,
    readonly config: ClientConfig,
    readonly originalSigner: Signer,
    readonly originalProvider: ethers.providers.BaseProvider,
    readonly httpRpcClient: HttpRpcClient,
    readonly entryPoint: EntryPoint,
    readonly smartAccountAPI: BaseAccountAPI,
  ) {
    super({
      name: "ERC-4337 Custom Network",
      chainId,
    });
    this.signer = new ERC4337EthersSigner(
      config,
      originalSigner,
      this,
      httpRpcClient,
      smartAccountAPI,
    );
  }

  /**
   * finish intializing the provider.
   * MUST be called after construction, before using the provider.
   */
  async init(): Promise<this> {
    // await this.httpRpcClient.validateChainId()
    this.initializedBlockNumber = await this.originalProvider.getBlockNumber();
    await this.smartAccountAPI.init();
    // await this.signer.init()
    return this;
  }

  getSigner(): ERC4337EthersSigner {
    return this.signer;
  }

  async perform(method: string, params: any): Promise<any> {
    if (method === "sendTransaction" || method === "getTransactionReceipt") {
      // TODO: do we need 'perform' method to be available at all?
      // there is nobody out there to use it for ERC-4337 methods yet, we have nothing to override in fact.
      throw new Error("Should not get here. Investigate.");
    }
    if (method === "estimateGas") {
      // hijack this to estimate gas from the entrypoint instead
      const { callGasLimit } =
        await this.smartAccountAPI.encodeUserOpCallDataAndGasLimit({
          target: params.transaction.to,
          data: params.transaction.data,
          value: params.transaction.value,
          gasLimit: params.transaction.gasLimit,
        });
      return callGasLimit;
    }
    return await this.originalProvider.perform(method, params);
  }

  async getTransaction(
    transactionHash: string | Promise<string>,
  ): Promise<ethers.providers.TransactionResponse> {
    // TODO
    return await super.getTransaction(transactionHash);
  }

  async getTransactionReceipt(
    transactionHash: string | Promise<string>,
  ): Promise<ethers.providers.TransactionReceipt> {
    const userOpHash = await transactionHash;
    const sender = await this.getSenderAccountAddress();
    return await new Promise<ethers.providers.TransactionReceipt>(
      (resolve, reject) => {
        new UserOperationEventListener(
          resolve,
          reject,
          this.entryPoint,
          sender,
          userOpHash,
        ).start();
      },
    );
  }

  async getSenderAccountAddress(): Promise<string> {
    return await this.smartAccountAPI.getAccountAddress();
  }

  async waitForTransaction(
    transactionHash: string,
    confirmations?: number,
    timeout?: number,
  ): Promise<ethers.providers.TransactionReceipt> {
    const sender = await this.getSenderAccountAddress();

    return await new Promise<ethers.providers.TransactionReceipt>(
      (resolve, reject) => {
        const listener = new UserOperationEventListener(
          resolve,
          reject,
          this.entryPoint,
          sender,
          transactionHash,
          undefined,
          timeout,
        );
        listener.start();
      },
    );
  }

  // fabricate a response in a format usable by ethers users...
  async constructUserOpTransactionResponse(
    userOp1: UserOperationStruct,
  ): Promise<ethers.providers.TransactionResponse> {
    const userOp = await resolveProperties(userOp1);
    const userOpHash = getUserOpHash(
      userOp,
      this.config.entryPointAddress,
      this.chainId,
    );
    const waitForUserOp =
      async (): Promise<ethers.providers.TransactionReceipt> =>
        await new Promise((resolve, reject) => {
          new UserOperationEventListener(
            resolve,
            reject,
            this.entryPoint,
            userOp.sender,
            userOpHash,
            userOp.nonce,
          ).start();
        });
    return {
      hash: userOpHash,
      confirmations: 0,
      from: userOp.sender,
      nonce: BigNumber.from(userOp.nonce).toNumber(),
      gasLimit: BigNumber.from(userOp.callGasLimit), // ??
      value: BigNumber.from(0),
      data: hexValue(userOp.callData), // should extract the actual called method from this "execFromEntryPoint()" call
      chainId: this.chainId,
      wait: async (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        confirmations?: number,
      ): Promise<ethers.providers.TransactionReceipt> => {
        const transactionReceipt = await waitForUserOp();
        if (userOp.initCode.length !== 0) {
          // checking if the wallet has been deployed by the transaction; it must be if we are here
          await this.smartAccountAPI.checkAccountPhantom();
        }
        return transactionReceipt;
      },
    };
  }

  async detectNetwork(): Promise<any> {
    return (this.originalProvider as any).detectNetwork();
  }
}
