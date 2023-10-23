import { BigNumber, providers, Signer, utils } from "ethers";

import {
  EntryPoint,
  UserOperationStruct,
} from "@account-abstraction/contracts";
import { ClientConfig } from "@account-abstraction/sdk";
import { UserOperationEventListener } from "./userop-event";
import { BaseAccountAPI } from "./base-api";
import { ERC4337EthersSigner } from "./erc4337-signer";
import { HttpRpcClient } from "./http-rpc-client";

export class ERC4337EthersProvider extends providers.BaseProvider {
  initializedBlockNumber!: number;

  readonly signer: ERC4337EthersSigner;

  constructor(
    readonly chainId: number,
    readonly config: ClientConfig,
    readonly originalSigner: Signer,
    readonly originalProvider: providers.BaseProvider,
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
        await this.smartAccountAPI.encodeUserOpCallDataAndGasLimit(
          {
            target: params.transaction.to,
            data: params.transaction.data,
            value: params.transaction.value,
            gasLimit: params.transaction.gasLimit,
          },
          false, // TODO check this
        );
      return callGasLimit;
    }
    return await this.originalProvider.perform(method, params);
  }

  async getTransaction(
    transactionHash: string | Promise<string>,
  ): Promise<providers.TransactionResponse> {
    // TODO
    return await super.getTransaction(transactionHash);
  }

  async getTransactionReceipt(
    transactionHash: string | Promise<string>,
  ): Promise<providers.TransactionReceipt> {
    const userOpHash = await transactionHash;
    const sender = await this.getSenderAccountAddress();
    return await new Promise<providers.TransactionReceipt>(
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
  ): Promise<providers.TransactionReceipt> {
    const sender = await this.getSenderAccountAddress();

    return await new Promise<providers.TransactionReceipt>(
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
  ): Promise<providers.TransactionResponse> {
    const userOp = await utils.resolveProperties(userOp1);
    const userOpHash = await this.smartAccountAPI.getUserOpHash(userOp);
    const waitForUserOp = async (): Promise<providers.TransactionReceipt> =>
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
      nonce: 0, // not the real nonce, but good enough for this purpose
      gasLimit: BigNumber.from(userOp.callGasLimit), // ??
      value: BigNumber.from(0),
      data: utils.hexValue(userOp.callData), // should extract the actual called method from this "execFromEntryPoint()" call
      chainId: this.chainId,
      wait: async (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        confirmations?: number,
      ): Promise<providers.TransactionReceipt> => {
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
