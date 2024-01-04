import { ethers, providers, utils } from "ethers";

import { Bytes, Signer } from "ethers";
import { ClientConfig } from "@account-abstraction/sdk";
import { BaseAccountAPI, BatchData } from "./base-api";
import type { ERC4337EthersProvider } from "./erc4337-provider";
import { HttpRpcClient } from "./http-rpc-client";
import { randomNonce } from "./utils";
import { deepHexlify } from "@account-abstraction/utils";

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
    utils.defineReadOnly(this, "provider", erc4337provider);
    this.config = config;
    this.originalSigner = originalSigner;
    this.erc4337provider = erc4337provider;
    this.httpRpcClient = httpRpcClient;
    this.smartAccountAPI = smartAccountAPI;
  }

  address?: string;

  // This one is called by Contract. It signs the request and passes in to Provider to be sent.
  async sendTransaction(
    transaction: utils.Deferrable<providers.TransactionRequest>,
    batchData?: BatchData,
  ): Promise<providers.TransactionResponse> {
    const tx = await ethers.utils.resolveProperties(transaction);
    await this.verifyAllNecessaryFields(tx);

    const multidimensionalNonce = randomNonce();
    const userOperation = await this.smartAccountAPI.createSignedUserOp(
      {
        target: tx.to || "",
        data: tx.data?.toString() || "0x",
        value: tx.value,
        gasLimit: tx.gasLimit,
        nonce: multidimensionalNonce,
      },
      batchData,
    );

    const transactionResponse =
      await this.erc4337provider.constructUserOpTransactionResponse(
        userOperation,
      );
    try {
      await this.httpRpcClient.sendUserOpToBundler(userOperation);
    } catch (error: any) {
      throw this.unwrapError(error);
    }
    // TODO: handle errors - transaction that is "rejected" by bundler is _not likely_ to ever resolve its "wait()"
    return transactionResponse;
  }

  unwrapError(errorIn: any): Error {
    try {
      let errorMsg = "Unknown Error";

      if (errorIn.error) {
        errorMsg = `The bundler has failed to include UserOperation in a batch: ${errorIn.error}`;
      } else if (errorIn.body && typeof errorIn.body === "string") {
        const errorBody = JSON.parse(errorIn.body);
        const errorStatus = errorIn.status || "UNKNOWN";
        const errorCode = errorBody?.code || "UNKNOWN";

        let failedOpMessage =
          errorBody?.error?.message ||
          errorBody?.error?.data ||
          errorBody?.error ||
          errorIn.reason;

        if (failedOpMessage?.includes("FailedOp")) {
          let paymasterInfo: string = "";
          // TODO: better error extraction methods will be needed
          const matched = failedOpMessage.match(/FailedOp\((.*)\)/);

          if (matched) {
            const split = matched[1].split(",");
            paymasterInfo = `(paymaster address: ${split[1]})`;
            failedOpMessage = split[2];
          }

          errorMsg = `The bundler has failed to include UserOperation in a batch: ${failedOpMessage} ${paymasterInfo}`;
        } else {
          errorMsg = `RPC error: ${failedOpMessage}
Status: ${errorStatus}
Code: ${errorCode}`;
        }
      }

      const error = new Error(errorMsg);
      error.stack = errorIn.stack;
      return error;
    } catch (error: any) {}

    return errorIn;
  }

  async verifyAllNecessaryFields(
    transactionRequest: providers.TransactionRequest,
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
  connect(provider: providers.Provider): Signer {
    throw new Error("changing providers is not supported");
  }

  async getAddress(): Promise<string> {
    if (!this.address) {
      this.address = await this.erc4337provider.getSenderAccountAddress();
    }
    return this.address as string;
  }

  async signMessage(message: Bytes | string): Promise<string> {
    const isNotDeployed = await this.smartAccountAPI.checkAccountPhantom();
    if (isNotDeployed) {
      console.log(
        "Account contract not deployed yet. Deploying account before signing message",
      );
      const tx = await this.sendTransaction({
        to: await this.getAddress(),
        data: "0x",
      });
      await tx.wait();
    }
    return await this.originalSigner.signMessage(message);
  }

  async signTransaction(
    transaction: utils.Deferrable<providers.TransactionRequest>,
    batchData?: BatchData,
  ): Promise<string> {
    const tx = await ethers.utils.resolveProperties(transaction);
    await this.verifyAllNecessaryFields(tx);

    const multidimensionalNonce = randomNonce();
    const userOperation = await this.smartAccountAPI.createSignedUserOp(
      {
        target: tx.to || "",
        data: tx.data?.toString() || "0x",
        value: tx.value,
        gasLimit: tx.gasLimit,
        nonce: multidimensionalNonce,
      },
      batchData,
    );

    const userOpString = JSON.stringify(
      deepHexlify(await utils.resolveProperties(userOperation)),
    );
    return userOpString;
  }
}
