import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import { Bytes, Signer } from "ethers";
import { BaseAccountAPI } from "./base-api";
import type { ERC4337EthersProvider } from "./erc4337-provider";
import { HttpRpcClient } from "./http-rpc-client";
import { hexlifyUserOp, randomNonce } from "./utils";
import { ProviderConfig, UserOpOptions } from "../types";
import { signTypedDataInternal } from "@thirdweb-dev/sdk";
import { chainIdToThirdwebRpc } from "../../../wallets/abstract";
import { setAnalyticsHeaders } from "../../../utils/headers";
import { isTwUrl } from "../../../utils/url";
import { checkContractWalletSignature } from "./check-contract-wallet-signature";

export class ERC4337EthersSigner extends Signer {
  config: ProviderConfig;
  originalSigner: Signer;
  erc4337provider: ERC4337EthersProvider;
  httpRpcClient: HttpRpcClient;
  smartAccountAPI: BaseAccountAPI;
  approving: boolean;

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
    this.approving = false;
  }

  address?: string;

  // This one is called by Contract. It signs the request and passes in to Provider to be sent.
  async sendTransaction(
    transaction: utils.Deferrable<providers.TransactionRequest>,
    options?: UserOpOptions,
  ): Promise<providers.TransactionResponse> {
    // if chain id 300 or 324 sendZkSyncTransaction
    if(transaction.chainId === 300 || transaction.chainId === 324) {
      const hash = await this.sendZkSyncTransaction(transaction, options);
      return {
        hash: hash,
        confirmations: 0,
        from: "",
        nonce: 0,
        gasLimit: BigNumber.from(0),
        value: BigNumber.from(0),
        data: "0x",
        chainId: transaction.chainId,
        wait: async (
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          confirmations?: number,
        ): Promise<providers.TransactionReceipt> => {
          return await this.provider?.getTransactionReceipt(hash) as providers.TransactionReceipt;
        },
      }
    }
    if (!this.approving) {
      this.approving = true;
      const tx = await this.smartAccountAPI.createApproveTx();
      if (tx) {
        await (await this.sendTransaction(tx)).wait();
      }
      this.approving = false;
    }
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


  async sendZkSyncTransaction(transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>, options: UserOpOptions | undefined): Promise<string> {
    if(options?.gasless === false){
      throw new Error("ZkSync Smart Wallet transactions are not supported without gasless mode");
    }

    if(!transaction.chainId){
      throw new Error("ChainId is required to send a ZkSync transaction");
    }

    const transactionInput = {
      from: await this.getAddress(),
      to: transaction.to,
      data: transaction.data,
      value: transaction.value,
      gasLimit: transaction.gasLimit ,
      nonce: transaction.nonce || this.provider?.getTransactionCount(this.getAddress(), "latest"),
      maxFeePerGas: transaction.maxFeePerGas,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas
    }

    const pmDataResult = await this.httpRpcClient.zkPaymasterData(transactionInput);
    const zkTx = {
      txType: 0x71,
      from: ethers.BigNumber.from(transactionInput.from).toNumber(),
      to: ethers.BigNumber.from(transactionInput.to).toNumber(),
      gasLimit: transactionInput.gasLimit,
      gasPerPubdataByteLimit: 50000,
      maxFeePerGas: transactionInput.maxFeePerGas,
      maxPriorityFeePerGas: transactionInput.maxPriorityFeePerGas,
      paymaster: ethers.BigNumber.from(pmDataResult.paymaster),
      nonce: transactionInput.nonce,
      value: transactionInput.value,
      data: transactionInput.data,
      factoryDeps: [],
      paymasterInput: ethers.utils.arrayify(pmDataResult.paymasterInput)
    }

    const EIP712_TYPES = {
      Transaction: [
        {name: 'txType', type: 'uint256'},
        {name: 'from', type: 'uint256'},
        {name: 'to', type: 'uint256'},
        {name: 'gasLimit', type: 'uint256'},
        {name: 'gasPerPubdataByteLimit', type: 'uint256'},
        {name: 'maxFeePerGas', type: 'uint256'},
        {name: 'maxPriorityFeePerGas', type: 'uint256'},
        {name: 'paymaster', type: 'uint256'},
        {name: 'nonce', type: 'uint256'},
        {name: 'value', type: 'uint256'},
        {name: 'data', type: 'bytes'},
        {name: 'factoryDeps', type: 'bytes32[]'},
        {name: 'paymasterInput', type: 'bytes'},
      ],
    };
    
    const signature = (await signTypedDataInternal(this.originalSigner, {
      name: "zkSync",
      version: "2",
      chainId: transaction.chainId as number,
      verifyingContract: "",
    }, EIP712_TYPES, zkTx)).signature;

    const serializedTx = this.serializeEip712(zkTx, signature);

    const broadcastResult = await this.httpRpcClient.zkBroadcastTransaction({
      nonce: zkTx.nonce,
      from: zkTx.from,
      to: zkTx.to,
      gas: zkTx.gasLimit?.toString(),
      gasPrice: "",
      value: zkTx.value?.toString(),
      data: ethers.utils.hexlify(zkTx.data as ethers.utils.BytesLike),
      maxFeePerGas: zkTx.maxFeePerGas?.toString(),
      maxPriorityFeePerGas: zkTx.maxPriorityFeePerGas?.toString(),
      chainId: transaction.chainId.toString(),
      signedTransaction: serializedTx,
      paymaster: pmDataResult.paymaster
    });

    return broadcastResult.transactionHash;

  }

  serializeEip712(transaction: any, signature: string) {
    const from = transaction.from;
    const maxFeePerGas = transaction.maxFeePerGas || transaction.gasPrice || 0;
    const maxPriorityFeePerGas = transaction.maxPriorityFeePerGas || maxFeePerGas;
    const fields = [
      ethers.utils.hexlify(transaction.nonce || 0),
      ethers.utils.hexlify(maxPriorityFeePerGas),
      ethers.utils.hexlify(maxFeePerGas),
      ethers.utils.hexlify(transaction.gasLimit || 0),
      transaction.to ? ethers.utils.getAddress(transaction.to) : '0x',
      ethers.utils.hexlify(transaction.value || 0),
      transaction.data || '0x',
    ];
    const sig = ethers.utils.splitSignature(signature);
    fields.push(ethers.utils.hexlify(sig.v));
    fields.push(sig.r);
    fields.push(sig.s);
    fields.push(ethers.utils.hexlify(transaction.chainId));
    fields.push(ethers.utils.getAddress(from));
    fields.push(
      ethers.utils.hexlify(transaction.gasPerPubData)
    );
    fields.push((transaction.factoryDeps ?? []).map((dep: number | bigint | ethers.utils.BytesLike | ethers.utils.Hexable) => ethers.utils.hexlify(dep)));
    fields.push('0x');
    fields.push([
      transaction.paymaster,
      transaction.paymasterInput,
    ]);
    return ethers.utils.hexConcat([
      ethers.utils.hexlify(113),
      ethers.utils.RLP.encode(fields),
    ]);
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
          let paymasterInfo = "";
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

    const [chainId, address] = await Promise.all([
      this.getChainId(),
      this.getAddress(),
    ]);
    const originalMsgHash = utils.hashMessage(message);

    let factorySupports712: boolean;
    let signature: string;

    const rpcUrl = chainIdToThirdwebRpc(chainId, this.config.clientId);

    const headers: Record<string, string> = {};

    if (isTwUrl(rpcUrl)) {
      const bundleId =
        typeof globalThis !== "undefined" && "APP_BUNDLE_ID" in globalThis
          ? ((globalThis as any).APP_BUNDLE_ID as string)
          : undefined;

      if (this.config.secretKey) {
        headers["x-secret-key"] = this.config.secretKey;
      } else if (this.config.clientId) {
        headers["x-client-id"] = this.config.clientId;

        if (bundleId) {
          headers["x-bundle-id"] = bundleId;
        }
      }

      // Dashboard token
      if (
        typeof globalThis !== "undefined" &&
        "TW_AUTH_TOKEN" in globalThis &&
        typeof (globalThis as any).TW_AUTH_TOKEN === "string"
      ) {
        headers["authorization"] = `Bearer ${
          (globalThis as any).TW_AUTH_TOKEN as string
        }`;
      }

      // CLI token
      if (
        typeof globalThis !== "undefined" &&
        "TW_CLI_AUTH_TOKEN" in globalThis &&
        typeof (globalThis as any).TW_CLI_AUTH_TOKEN === "string"
      ) {
        headers["authorization"] = `Bearer ${
          (globalThis as any).TW_CLI_AUTH_TOKEN as string
        }`;
        headers["x-authorize-wallet"] = "true";
      }

      setAnalyticsHeaders(headers);
    }

    try {
      const provider = new providers.StaticJsonRpcProvider(
        {
          url: rpcUrl,
          headers,
        },
        chainId,
      );
      const walletContract = new Contract(
        address,
        [
          "function getMessageHash(bytes32 _hash) public view returns (bytes32)",
        ],
        provider,
      );
      // if this fails it's a pre 712 factory
      await walletContract.getMessageHash(originalMsgHash);
      factorySupports712 = true;
    } catch {
      factorySupports712 = false;
    }

    if (factorySupports712) {
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
          message: utils.defaultAbiCoder.encode(["bytes32"], [originalMsgHash]),
        },
      );
      signature = result.signature;
    } else {
      signature = await this.originalSigner.signMessage(message);
    }

    const isValid = await checkContractWalletSignature(
      message as string,
      signature,
      address,
      chainId,
      this.config.clientId,
      this.config.secretKey,
    );

    if (isValid) {
      return signature;
    } else {
      throw new Error(
        "Unable to verify signature on smart account, please make sure the smart account is deployed and the signature is valid.",
      );
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
