import { Contract, ethers, providers, utils } from "ethers";

import { Bytes, Signer } from "ethers";
import { BaseAccountAPI } from "./base-api";
import type { ERC4337EthersProvider } from "./erc4337-provider";
import { HttpRpcClient } from "./http-rpc-client";
import { hexlifyUserOp, randomNonce } from "./utils";
import { ProviderConfig, UserOpOptions } from "../types";
import { signTypedDataInternal } from "@thirdweb-dev/sdk";
import {
  checkContractWalletSignature,
  chainIdToThirdwebRpc,
} from "../../../wallets/abstract";

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

  /**
   * Sign a message and return the signature
   */
  public async signMessage(message: Bytes | string): Promise<string> {
    // Deploy smart wallet if needed
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

    const chainId = await this.getChainId();
    const address = await this.getAddress();

    /**
     * We first try to sign the EIP-712 typed data i.e. the message mixed with the smart wallet's domain separator.
     * If this fails, we fallback to the legacy signing method.
     */
    try {
      const provider = new providers.JsonRpcProvider(
        chainIdToThirdwebRpc(chainId, this.config.clientId),
        chainId,
      );

      const walletContract = new Contract(
        address,
        "function getMessageHash(bytes32 _hash) public view returns (bytes32)",
        provider,
      );

      const hash = utils.hashMessage(message);

      // if this doesn't fail, it's a post 1271 + typehash account
      await walletContract.getMessageHash(hash);

      const result = await signTypedDataInternal(
        this,
        {
          name: "Account",
          version: "1",
          chainId,
          verifyingContract: address,
        },
        { AccountMessage: [{ name: "message", type: "bytes" }] },
        {
          message: utils.defaultAbiCoder.encode(["bytes32"], [hash]),
        },
      );

      const isValid = await checkContractWalletSignature(
        hash,
        result.signature,
        address,
        chainId,
      );

      if (!isValid) {
        throw new Error("Invalid signature");
      }

      return result.signature;
    } catch {
      console.log(
        "EIP-712 typed data and EIP-1271 verification failed, falling back to legacy signing method...",
      );
      return await this.originalSigner.signMessage(message);
    }
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
