import {
  Provider,
  TransactionRequest,
  TransactionResponse,
} from "@ethersproject/providers";

import { Bytes, Signer } from "ethers";
import { UserOperationStruct } from "@account-abstraction/contracts";
import { ClientConfig, HttpRpcClient } from "@account-abstraction/sdk";
import { BaseAccountAPI } from "./base-api";
import { ERC4337EthersProvider } from "./erc4337-provider";
import { defineReadOnly, Deferrable } from "ethers/lib/utils";

export class ERC4337EthersSigner extends Signer {
  config: ClientConfig;
  originalSigner: Signer;
  erc4337provider: ERC4337EthersProvider;
  httpRpcClient: HttpRpcClient;
  smartAccountAPI: BaseAccountAPI;

  // TODO: we have 'erc4337provider', remove shared dependencies or avoid two-way reference
  constructor(
    config: ClientConfig,
    originalSigner: Signer,
    erc4337provider: ERC4337EthersProvider,
    httpRpcClient: HttpRpcClient,
    smartAccountAPI: BaseAccountAPI,
  ) {
    super();
    defineReadOnly(this, "provider", erc4337provider);
    this.config = config;
    this.originalSigner = originalSigner;
    this.erc4337provider = erc4337provider;
    this.httpRpcClient = httpRpcClient;
    this.smartAccountAPI = smartAccountAPI;
  }

  address?: string;

  // This one is called by Contract. It signs the request and passes in to Provider to be sent.
  async sendTransaction(
    transaction: Deferrable<TransactionRequest>,
  ): Promise<TransactionResponse> {
    const tx: TransactionRequest = await this.populateTransaction(transaction);
    await this.verifyAllNecessaryFields(tx);

    const userOperation = await this.smartAccountAPI.createSignedUserOp({
      target: tx.to ?? "",
      data: tx.data?.toString() ?? "",
      value: tx.value,
      gasLimit: tx.gasLimit,
    });

    const transactionResponse =
      await this.erc4337provider.constructUserOpTransactionResponse(
        userOperation,
      );
    try {
      await this.httpRpcClient.sendUserOpToBundler(userOperation);
    } catch (error: any) {
      // console.error('sendUserOpToBundler failed', error)
      throw this.unwrapError(error);
    }
    // TODO: handle errors - transaction that is "rejected" by bundler is _not likely_ to ever resolve its "wait()"
    return transactionResponse;
  }

  unwrapError(errorIn: any): Error {
    if (errorIn.body !== null) {
      const errorBody = JSON.parse(errorIn.body);
      let paymasterInfo: string = "";
      let failedOpMessage: string | undefined = errorBody?.error?.message;
      if (failedOpMessage?.includes("FailedOp") === true) {
        // TODO: better error extraction methods will be needed
        const matched = failedOpMessage.match(/FailedOp\((.*)\)/);
        if (matched !== null) {
          const split = matched[1].split(",");
          paymasterInfo = `(paymaster address: ${split[1]})`;
          failedOpMessage = split[2];
        }
      }
      const error = new Error(
        `The bundler has failed to include UserOperation in a batch: ${failedOpMessage} ${paymasterInfo})`,
      );
      error.stack = errorIn.stack;
      return error;
    }
    return errorIn;
  }

  async verifyAllNecessaryFields(
    transactionRequest: TransactionRequest,
  ): Promise<void> {
    if (!transactionRequest.to) {
      throw new Error("Missing call target");
    }
    if (!transactionRequest.data && !transactionRequest.value) {
      // TBD: banning no-op UserOps seems to make sense on provider level
      throw new Error("Missing call data or value");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connect(provider: Provider): Signer {
    throw new Error("changing providers is not supported");
  }

  async getAddress(): Promise<string> {
    if (!this.address) {
      this.address = await this.erc4337provider.getSenderAccountAddress();
    }
    return this.address as string;
  }

  async signMessage(message: Bytes | string): Promise<string> {
    return await this.originalSigner.signMessage(message);
  }

  async signTransaction(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transaction: Deferrable<TransactionRequest>,
  ): Promise<string> {
    throw new Error("not implemented");
  }

  async signUserOperation(userOperation: UserOperationStruct): Promise<string> {
    const message = await this.smartAccountAPI.getUserOpHash(userOperation);
    return await this.originalSigner.signMessage(message);
  }
}
