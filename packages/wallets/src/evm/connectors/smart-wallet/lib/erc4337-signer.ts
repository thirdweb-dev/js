import { BytesLike, ethers, providers, utils } from "ethers";

import { Bytes, Signer } from "ethers";
import { BaseAccountAPI } from "./base-api";
import type { ERC4337EthersProvider } from "./erc4337-provider";
import { HttpRpcClient } from "./http-rpc-client";
import { hexlifyUserOp, randomNonce } from "./utils";
import { ProviderConfig, UserOpOptions } from "../types";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export class ERC4337EthersSigner extends Signer {
  config: ProviderConfig;
  originalSigner: Signer;
  erc4337provider: ERC4337EthersProvider;
  httpRpcClient: HttpRpcClient;
  smartAccountAPI: BaseAccountAPI;

  // TODO: we have 'erc4337provider', remove shared dependencies or avoid two-way reference
  constructor(
    config: ProviderConfig,
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
    options?: UserOpOptions,
  ): Promise<providers.TransactionResponse> {
    const tx = await ethers.utils.resolveProperties(transaction);
    await this.verifyAllNecessaryFields(tx);

    const multidimensionalNonce = randomNonce();
    const unsigned = await this.smartAccountAPI.createUnsignedUserOp(
      this.httpRpcClient,
      {
        target: tx.to || "",
        data: tx.data?.toString() || "0x",
        value: tx.value,
        gasLimit: tx.gasLimit,
        nonce: multidimensionalNonce,
        maxFeePerGas: tx.maxFeePerGas,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
      },
      options,
    );
    const userOperation = await this.smartAccountAPI.signUserOp(unsigned);
    const transactionResponse =
      await this.erc4337provider.constructUserOpTransactionResponse(
        userOperation,
      );

    if (options?.compressData) {
      try {
        const simpleInflatorAddress =
          "0x564c7dC50f8293d070F490Fc31fEc3A0A091b9bB";
        const simpleInflatorAbi =
          // prettier-ignore
          [{"inputs": [{"components": [{"internalType": "address","name": "sender","type": "address"},{"internalType": "uint256","name": "nonce","type": "uint256"},{"internalType": "bytes","name": "initCode","type": "bytes"},{"internalType": "bytes","name": "callData","type": "bytes"},{"internalType": "uint256","name": "callGasLimit","type": "uint256"},{"internalType": "uint256","name": "verificationGasLimit","type": "uint256"},{"internalType": "uint256","name": "preVerificationGas","type": "uint256"},{"internalType": "uint256","name": "maxFeePerGas","type": "uint256"},{"internalType": "uint256","name": "maxPriorityFeePerGas","type": "uint256"},{"internalType": "bytes","name": "paymasterAndData","type": "bytes"},{"internalType": "bytes","name": "signature","type": "bytes"}],"internalType": "struct UserOperation","name": "op","type": "tuple"}],"name": "compress","outputs": [{"internalType": "bytes","name": "compressed","type": "bytes"}],"stateMutability": "pure","type": "function"},{"inputs": [{"internalType": "bytes","name": "compressed","type": "bytes"}],"name": "inflate","outputs": [{"components": [{"internalType": "address","name": "sender","type": "address"},{"internalType": "uint256","name": "nonce","type": "uint256"},{"internalType": "bytes","name": "initCode","type": "bytes"},{"internalType": "bytes","name": "callData","type": "bytes"},{"internalType": "uint256","name": "callGasLimit","type": "uint256"},{"internalType": "uint256","name": "verificationGasLimit","type": "uint256"},{"internalType": "uint256","name": "preVerificationGas","type": "uint256"},{"internalType": "uint256","name": "maxFeePerGas","type": "uint256"},{"internalType": "uint256","name": "maxPriorityFeePerGas","type": "uint256"},{"internalType": "bytes","name": "paymasterAndData","type": "bytes"},{"internalType": "bytes","name": "signature","type": "bytes"}],"internalType": "struct UserOperation","name": "op","type": "tuple"}],"stateMutability": "pure","type": "function"}];
        const sdk = new ThirdwebSDK(this.config.chain, {
          clientId: this.config.clientId,
          secretKey: this.config.secretKey,
        });
        const simpleInflator = await sdk.getContract(
          simpleInflatorAddress,
          simpleInflatorAbi,
        );
        const compressedUserOp: BytesLike = await simpleInflator.call(
          "compress",
          [userOperation],
        );
        await this.httpRpcClient.sendCompressedUserOpToBundler(
          utils.hexlify(compressedUserOp),
          simpleInflatorAddress,
        );
      } catch (error: any) {
        throw this.unwrapError(error);
      }
    } else {
      try {
        await this.httpRpcClient.sendUserOpToBundler(userOperation);
      } catch (error: any) {
        throw this.unwrapError(error);
      }
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
    if (isNotDeployed && this.config.deployOnSign) {
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
    options?: UserOpOptions,
  ): Promise<string> {
    const tx = await ethers.utils.resolveProperties(transaction);
    await this.verifyAllNecessaryFields(tx);

    const multidimensionalNonce = randomNonce();
    const unsigned = await this.smartAccountAPI.createUnsignedUserOp(
      this.httpRpcClient,
      {
        target: tx.to || "",
        data: tx.data?.toString() || "0x",
        value: tx.value,
        gasLimit: tx.gasLimit,
        nonce: multidimensionalNonce,
      },
      options,
    );
    const userOperation = await this.smartAccountAPI.signUserOp(unsigned);

    const userOpString = JSON.stringify(await hexlifyUserOp(userOperation));
    return userOpString;
  }
}
