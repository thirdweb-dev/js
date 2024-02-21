import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  BaseContract,
  BigNumber,
  Contract,
  ContractTransaction,
  constants,
  utils,
  type BytesLike,
  type CallOverrides,
  type ContractFunction,
  type ContractInterface,
  type Signer,
  type providers,
} from "ethers";
import invariant from "tiny-invariant";
import { computeEOAForwarderAddress } from "../../../common/any-evm-utils/computeEOAForwarderAddress";
import { computeForwarderAddress } from "../../../common/any-evm-utils/computeForwarderAddress";
import { TransactionError, parseRevertReason } from "../../../common/error";
import { extractFunctionsFromAbi } from "../../../common/feature-detection/extractFunctionsFromAbi";
import { fetchSourceFilesFromMetadata } from "../../../common/fetchSourceFilesFromMetadata";
import {
  BiconomyForwarderAbi,
  ChainAwareForwardRequest,
  ForwardRequest,
  getAndIncrementNonce,
} from "../../../common/forwarder";
import { getDefaultGasOverrides } from "../../../common/gas-price";
import { fetchContractMetadataFromAddress } from "../../../common/metadata-resolver";
import { signEIP2612Permit } from "../../../common/permit";
import { signTypedDataInternal } from "../../../common/sign";
import { CONTRACT_ADDRESSES } from "../../../constants/addresses/CONTRACT_ADDRESSES";
import { getContractAddressByChainId } from "../../../constants/addresses/getContractAddressByChainId";
import { EventType } from "../../../constants/events";
import { AbiSchema, ContractSource } from "../../../schema/contracts/custom";
import { SDKOptions } from "../../../schema/sdk-options";
import { Address } from "../../../schema/shared/Address";
import { CallOverrideSchema } from "../../../schema/shared/CallOverrideSchema";
import {
  ForwardRequestMessage,
  GaslessTransaction,
  NetworkInput,
  PermitRequestMessage,
} from "../../types";
import { RPCConnectionHandler } from "./rpc-connection-handler";
import { isBrowser } from "../../../common/utils";
import { detectFeatures } from "../../../common/feature-detection/detectFeatures";

/**
 * @internal
 */
export class ContractWrapper<
  TContract extends BaseContract,
> extends RPCConnectionHandler {
  storage: ThirdwebStorage;
  private isValidContract = false;
  private customOverrides: () => CallOverrides = () => ({});
  /**
   * @internal
   */
  public writeContract;
  public readContract;
  public abi;
  public address;
  public functions;
  public extensions;

  constructor(
    network: NetworkInput,
    contractAddress: string,
    contractAbi: ContractInterface,
    options: SDKOptions,
    storage: ThirdwebStorage,
  ) {
    super(network, options);
    this.abi = AbiSchema.parse(contractAbi);
    this.address = contractAddress;
    // set up the contract
    this.writeContract = new Contract(
      contractAddress,
      contractAbi,
      this.getSignerOrProvider(),
    ) as TContract;
    // setup the read only contract
    this.readContract = this.writeContract.connect(
      this.getProvider(),
    ) as TContract;
    this.storage = storage;
    this.functions = extractFunctionsFromAbi(this.abi);
    this.extensions = detectFeatures(this.abi);
  }

  public override updateSignerOrProvider(network: NetworkInput): void {
    // update the underlying base class
    super.updateSignerOrProvider(network);
    // re-connect the contract with the new signer / provider
    this.writeContract = this.writeContract.connect(
      this.getSignerOrProvider(),
    ) as TContract;
    // setup the read only contract
    this.readContract = this.writeContract.connect(
      this.getProvider(),
    ) as TContract;
  }

  public updateAbi(updatedAbi: ContractInterface): void {
    // re-connect the contract with the new signer / provider
    this.writeContract = new Contract(
      this.address,
      updatedAbi,
      this.getSignerOrProvider(),
    ) as TContract;

    // setup the read only contract
    this.readContract = this.writeContract.connect(
      this.getProvider(),
    ) as TContract;

    this.abi = AbiSchema.parse(updatedAbi);
    this.functions = extractFunctionsFromAbi(this.abi);
    this.extensions = detectFeatures(this.abi);
  }

  /**
   * @internal
   */
  public async getChainID(): Promise<number> {
    const provider = this.getProvider();
    const { chainId } = await provider.getNetwork();
    return chainId;
  }
  /**
   * @internal
   */
  public async getSignerAddress(): Promise<Address> {
    const signer = this.getSigner();
    if (!signer) {
      throw new Error(
        "This action requires a connected wallet to sign the transaction. Please pass a valid signer to the SDK.",
      );
    }
    return await signer.getAddress();
  }

  /**
   * @internal
   */
  public callStatic() {
    return this.writeContract.callStatic;
  }

  /**
   * @internal
   */
  public async getCallOverrides(): Promise<CallOverrides> {
    // If we're running in the browser, let users configure gas price in their wallet UI
    if (isBrowser()) {
      return {};
    }
    return getDefaultGasOverrides(this.getProvider());
  }

  /**
   * @internal
   */
  private emitTransactionEvent(
    status: "submitted" | "completed",
    transactionHash: string,
  ) {
    this.emit(EventType.Transaction, {
      status,
      transactionHash,
    });
  }

  /**
   * @internal
   */
  public async multiCall(
    encoded: string[],
  ): Promise<providers.TransactionReceipt> {
    return this.sendTransaction("multicall", [encoded]);
  }

  /**
   * @internal
   */
  public async estimateGas(
    fn: keyof TContract["functions"],
    args: any[],
  ): Promise<BigNumber> {
    return this.writeContract.estimateGas[fn as string](...args);
  }

  /**
   * @internal
   */
  public withTransactionOverride(hook: () => CallOverrides) {
    this.customOverrides = hook;
  }

  /**
   *
   * @param functionName - The function name on the contract to call
   * @param args - The arguments to be passed to the functionName
   * @returns The return value of the function call
   */
  public async read<
    OverrideContract extends BaseContract = TContract,
    FnName extends
      keyof OverrideContract["functions"] = keyof OverrideContract["functions"],
    Param extends Parameters<
      OverrideContract["functions"][FnName]
    > = Parameters<OverrideContract["functions"][FnName]>,
  >(
    functionName: FnName,
    args: Param,
  ): Promise<
    Awaited<ReturnType<OverrideContract["functions"][FnName]>> extends {
      length: 1;
    }
      ? Awaited<ReturnType<OverrideContract["functions"][FnName]>>[0]
      : Awaited<ReturnType<OverrideContract["functions"][FnName]>>
  > {
    const functions = this.functions.filter((f) => f.name === functionName);
    if (!functions.length) {
      throw new Error(
        `Function "${functionName.toString()}" not found in contract. Check your dashboard for the list of functions available`,
      );
    }
    const fn = functions.find(
      (f) => f.name === functionName && f.inputs.length === args.length,
    );

    // TODO extract this and re-use for deploy function to check constructor args
    if (!fn) {
      throw new Error(
        `Function "${functionName.toString()}" requires ${
          functions[0].inputs.length
        } arguments, but ${
          args.length
        } were provided.\nExpected function signature: ${
          functions[0].signature
        }`,
      );
    }

    const ethersFnName = `${functionName.toString()}(${fn.inputs
      .map((i) => i.type)
      .join()})`;

    // check if the function exists on the contract, otherwise use the name passed in
    const fnName =
      ethersFnName in this.readContract.functions ? ethersFnName : functionName;

    if (fn.stateMutability === "view" || fn.stateMutability === "pure") {
      // read function
      const result = await (this.readContract as any)[fnName.toString()](
        ...args,
      );
      return result;
    }

    throw new Error("Cannot call a write function with read()");
  }

  /**
   * @internal
   */
  public async call(
    functionName: string,
    args: unknown[] = [],
    overrides?: CallOverrides,
  ): Promise<any> {
    // parse last arg as tx options if present
    const txOptions: CallOverrides | undefined = overrides
      ? await CallOverrideSchema.parseAsync(overrides)
      : undefined;

    const functions = extractFunctionsFromAbi(AbiSchema.parse(this.abi)).filter(
      (f) => f.name === functionName,
    );

    if (!functions.length) {
      throw new Error(
        `Function "${functionName}" not found in contract. Check your dashboard for the list of functions available`,
      );
    }
    const fn = functions.find(
      (f) => f.name === functionName && f.inputs.length === args.length,
    );

    // TODO extract this and re-use for deploy function to check constructor args
    if (!fn) {
      throw new Error(
        `Function "${functionName}" requires ${functions[0].inputs.length} arguments, but ${args.length} were provided.\nExpected function signature: ${functions[0].signature}`,
      );
    }

    const ethersFnName = `${functionName}(${fn.inputs
      .map((i) => i.type)
      .join()})`;

    // check if the function exists on the contract, otherwise use the name passed in
    const fnName =
      ethersFnName in this.readContract.functions ? ethersFnName : functionName;

    // TODO validate each argument
    if (fn.stateMutability === "view" || fn.stateMutability === "pure") {
      // read function
      return txOptions
        ? (this.readContract as any)[fnName](...args, txOptions)
        : (this.readContract as any)[fnName](...args);
    } else {
      // write function
      const receipt = await this.sendTransaction(fnName, args, txOptions);
      return {
        receipt,
      };
    }
  }

  /**
   * @internal
   */
  public async sendTransaction(
    // eslint-disable-next-line @typescript-eslint/ban-types
    fn: keyof TContract["functions"] | (string & {}),
    args: any[],
    callOverrides?: CallOverrides,
  ): Promise<providers.TransactionReceipt> {
    if (!callOverrides) {
      callOverrides = await this.getCallOverrides();
    }
    // if a custom override is set, merge our override with the custom one
    callOverrides = {
      ...callOverrides,
      ...this.customOverrides(),
    };
    // clear up the override (single use)
    this.customOverrides = () => ({});
    if (
      this.options?.gasless &&
      ("openzeppelin" in this.options.gasless ||
        "biconomy" in this.options.gasless ||
        "engine" in this.options.gasless)
    ) {
      if (fn === "multicall" && Array.isArray(args[0]) && args[0].length > 0) {
        const from = await this.getSignerAddress();
        args[0] = args[0].map((tx: any) =>
          utils.solidityPack(["bytes", "address"], [tx, from]),
        );
      }

      const provider = this.getProvider();
      const txHash = await this.sendGaslessTransaction(fn, args, callOverrides);
      this.emitTransactionEvent("submitted", txHash);
      const receipt = await provider.waitForTransaction(txHash);
      this.emitTransactionEvent("completed", txHash);
      return receipt;
    } else {
      // one time verification that this is a valid contract (to avoid sending funds to wrong addresses)
      if (!this.isValidContract) {
        const code = await this.getProvider().getCode(this.address);
        this.isValidContract = code !== "0x";
        if (!this.isValidContract) {
          throw new Error(
            "The address you're trying to send a transaction to is not a smart contract. Make sure you are on the correct network and the contract address is correct",
          );
        }
      }
      const tx = await this.sendTransactionByFunction(
        fn as keyof TContract["functions"],
        args,
        callOverrides,
      );
      this.emitTransactionEvent("submitted", tx.hash);

      // tx.wait() can fail so we need to wrap it with a catch
      let receipt;
      try {
        receipt = await tx.wait();
      } catch (err) {
        try {
          // If tx.wait() fails, it just gives us a generic "transaction failed"
          // error. So instead, we need to call static to get an informative error message
          await this.writeContract.callStatic[fn as string](
            ...args,
            ...(callOverrides.value ? [{ value: callOverrides.value }] : []),
          );
        } catch (staticErr: any) {
          throw await this.formatError(staticErr, fn, args, callOverrides);
        }

        throw await this.formatError(err, fn, args, callOverrides);
      }

      this.emitTransactionEvent("completed", tx.hash);
      return receipt;
    }
  }

  /**
   * @internal
   */
  public async sendTransactionByFunction(
    fn: keyof TContract["functions"],
    args: any[],
    callOverrides: CallOverrides,
  ): Promise<ContractTransaction> {
    const func: ContractFunction = (this.writeContract.functions as any)[fn];
    if (!func) {
      throw new Error(`invalid function: "${fn.toString()}"`);
    }

    // First, if no gasLimit is passed, call estimate gas ourselves
    if (!callOverrides.gasLimit) {
      try {
        callOverrides.gasLimit = await this.writeContract.estimateGas[
          fn as string
        ](...args, callOverrides);
      } catch (e) {
        // If gas estimation fails, we'll call static to get a better error message
        try {
          await this.writeContract.callStatic[fn as string](
            ...args,
            ...(callOverrides.value ? [{ value: callOverrides.value }] : []),
          );
        } catch (err: any) {
          throw await this.formatError(err, fn, args, callOverrides);
        }
      }
    }

    // Now there should be no gas estimate errors
    try {
      return await func(...args, callOverrides);
    } catch (err) {
      throw await this.formatError(err, fn, args, callOverrides);
    }
  }

  private async formatError(
    error: any,
    fn: keyof TContract["functions"],
    args: any[],
    callOverrides: CallOverrides,
  ) {
    const provider = this.getProvider() as providers.Provider & {
      connection?: utils.ConnectionInfo;
    };

    // Get metadata for transaction to populate into error
    const network = await provider.getNetwork();
    const from = await (callOverrides.from || this.getSignerAddress());
    const to = this.address;
    const data = this.readContract.interface.encodeFunctionData(
      fn as string,
      args,
    );
    const value = BigNumber.from(callOverrides.value || 0);
    const rpcUrl = provider.connection?.url;

    // Render function signature with arguments filled in
    const functionSignature = this.readContract.interface.getFunction(
      fn as string,
    );
    const methodArgs = args.map((arg) => {
      if (JSON.stringify(arg).length <= 80) {
        return JSON.stringify(arg);
      }
      return JSON.stringify(arg, undefined, 2);
    });
    const joinedArgs =
      methodArgs.join(", ").length <= 80
        ? methodArgs.join(", ")
        : "\n" +
          methodArgs
            .map((arg) => "  " + arg.split("\n").join("\n  "))
            .join(",\n") +
          "\n";
    const method = `${functionSignature.name}(${joinedArgs})`;
    const hash =
      error.transactionHash ||
      error.transaction?.hash ||
      error.receipt?.transactionHash;

    // Parse the revert reason from the error
    const reason = parseRevertReason(error);

    // Get contract sources for stack trace
    let sources: ContractSource[] | undefined = undefined;
    let contractName: string | undefined = undefined;
    try {
      const metadata = await fetchContractMetadataFromAddress(
        this.address,
        this.getProvider(),
        this.storage,
        this.options,
      );

      if (metadata.name) {
        contractName = metadata.name;
      }

      if (metadata.metadata.sources) {
        sources = await fetchSourceFilesFromMetadata(metadata, this.storage);
      }
    } catch (err) {
      // no-op
    }

    return new TransactionError(
      {
        reason,
        from,
        to,
        method,
        data,
        network,
        rpcUrl,
        value,
        hash,
        contractName,
        sources,
      },
      error,
    );
  }

  /**
   * @internal
   */
  private async sendGaslessTransaction(
    fn: keyof TContract["functions"],
    args: any[] = [],
    callOverrides: CallOverrides,
  ): Promise<string> {
    const signer = this.getSigner();
    invariant(
      signer,
      "Cannot execute gasless transaction without valid signer",
    );

    const chainId = await this.getChainID();
    const from = await this.getSignerAddress();
    const to = this.writeContract.address;
    const value = callOverrides?.value || 0;

    if (BigNumber.from(value).gt(0)) {
      throw new Error(
        "Cannot send native token value with gasless transaction",
      );
    }

    const data = this.writeContract.interface.encodeFunctionData(
      fn as any,
      args as any,
    );

    let gas = BigNumber.from(0);
    try {
      const gasEstimate = await (this.readContract.estimateGas as any)[fn](
        ...args,
      );
      gas = gasEstimate.mul(2);
    } catch (e) {
      // ignore
    }

    // in some cases WalletConnect doesn't properly gives an estimate for how much gas it would actually use.
    // as a fix, we're setting it to a high arbitrary number (500k) as the gas limit that should cover for most function calls.
    if (gas.lt(100000)) {
      gas = BigNumber.from(500000);
    }

    // check for gas override in callOverrides
    if (
      callOverrides.gasLimit &&
      BigNumber.from(callOverrides.gasLimit).gt(gas)
    ) {
      gas = BigNumber.from(callOverrides.gasLimit);
    }

    const tx: GaslessTransaction = {
      from,
      to,
      data,
      chainId,
      gasLimit: gas,
      functionName: fn.toString(),
      functionArgs: args,
      callOverrides,
    };

    return await this.defaultGaslessSendFunction(tx);
  }

  public async signTypedData(
    signer: Signer,
    domain: {
      name: string;
      version: string;
      chainId: number;
      verifyingContract: string;
    },
    types: any,
    message: any,
  ): Promise<BytesLike> {
    this.emit(EventType.Signature, {
      status: "submitted",
      message,
      signature: "",
    });
    const { signature: sig } = await signTypedDataInternal(
      signer,
      domain,
      types,
      message,
    );
    this.emit(EventType.Signature, {
      status: "completed",
      message,
      signature: sig,
    });
    return sig;
  }

  public parseLogs<T = any>(eventName: string, logs?: providers.Log[]): T[] {
    if (!logs || logs.length === 0) {
      return [];
    }
    const topic = this.writeContract.interface.getEventTopic(eventName);
    const parsedLogs = logs.filter((x) => x.topics.indexOf(topic) >= 0);
    return parsedLogs.map(
      (l) => this.writeContract.interface.parseLog(l) as unknown as T,
    );
  }

  private async defaultGaslessSendFunction(
    transaction: GaslessTransaction,
  ): Promise<string> {
    if (this.options.gasless && "biconomy" in this.options.gasless) {
      return this.biconomySendFunction(transaction);
    } else if (this.options.gasless && "openzeppelin" in this.options.gasless) {
      return this.defenderSendFunction(transaction);
    }
    return this.engineSendFunction(transaction);
  }

  private async engineSendFunction(
    transaction: GaslessTransaction,
  ): Promise<string> {
    invariant(
      this.options.gasless && "engine" in this.options.gasless,
      "calling engine gasless transaction without engine config in the SDK options",
    );

    const request = await this.enginePrepareRequest(transaction);

    const res = await fetch(this.options.gasless.engine.relayerUrl, {
      ...request,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error?.message || JSON.stringify(data.error));
    }

    const queueId = data.result.queueId as string;
    const engineUrl =
      this.options.gasless.engine.relayerUrl.split("/relayer/")[0];
    const startTime = Date.now();
    while (true) {
      const txRes = await fetch(`${engineUrl}/transaction/status/${queueId}`);
      const txData = await txRes.json();

      if (txData.result.transactionHash) {
        return txData.result.transactionHash as string;
      }

      // Time out after 30s
      if (Date.now() - startTime > 30 * 1000) {
        throw new Error("timeout");
      }

      // Poll to check if the transaction was mined
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  private async enginePrepareRequest(transaction: GaslessTransaction) {
    invariant(
      this.options.gasless && "engine" in this.options.gasless,
      "calling engine gasless transaction without openzeppelin config in the SDK options",
    );

    const signer = this.getSigner();
    const provider = this.getProvider();
    const storage = this.storage;

    invariant(signer, "signer is not set");

    try {
      const { abi } = await fetchContractMetadataFromAddress(
        transaction.to,
        provider,
        storage,
      );

      const chainId = (await provider.getNetwork()).chainId;
      const contract = new ContractWrapper(
        signer,
        transaction.to,
        abi,
        {},
        storage,
      );
      if (abi.find((item) => item.name === "executeMetaTransaction")) {
        const name: string = await contract.call("name", []);

        const domain = {
          name,
          version: "1",
          salt: "0x" + chainId.toString(16).padStart(64, "0"), // Use 64 length hex chain id as salt
          verifyingContract: transaction.to,
        };

        const types = {
          MetaTransaction: [
            { name: "nonce", type: "uint256" },
            { name: "from", type: "address" },
            { name: "functionSignature", type: "bytes" },
          ],
        };

        const nonce = await contract.call("getNonce", [transaction.from]);
        const message = {
          nonce: nonce,
          from: transaction.from,
          functionSignature: transaction.data,
        };

        const { signature } = await signTypedDataInternal(
          signer,
          domain,
          types,
          message,
        );

        return {
          method: "POST",
          body: JSON.stringify({
            type: "execute-meta-transaction",
            request: {
              from: transaction.from,
              to: transaction.to,
              data: transaction.data,
            },
            signature,
          }),
        };
      }
    } catch {
      // no-op
    }

    if (
      transaction.functionName === "approve" &&
      transaction.functionArgs.length === 2
    ) {
      const spender = transaction.functionArgs[0];
      const amount = transaction.functionArgs[1];
      // TODO: support DAI permit by signDAIPermit
      const { message: permit, signature: sig } = await signEIP2612Permit(
        signer,
        transaction.to,
        transaction.from,
        spender,
        amount,
        this.options.gasless.engine.domainVersion,
      );

      const message = {
        to: transaction.to,
        owner: permit.owner,
        spender: permit.spender,
        value: BigNumber.from(permit.value).toString(),
        nonce: BigNumber.from(permit.nonce).toString(),
        deadline: BigNumber.from(permit.deadline).toString(),
      };

      return {
        method: "POST",
        body: JSON.stringify({
          type: "permit",
          request: message,
          signature: sig,
        }),
      };
    } else {
      const forwarderAddress =
        this.options.gasless.engine.relayerForwarderAddress ||
        CONTRACT_ADDRESSES[
          transaction.chainId as keyof typeof CONTRACT_ADDRESSES
        ]?.openzeppelinForwarder ||
        (await computeForwarderAddress(provider, storage));
      const ForwarderABI = (
        await import("@thirdweb-dev/contracts-js/dist/abis/Forwarder.json")
      ).default;

      const forwarder = new Contract(forwarderAddress, ForwarderABI, provider);
      const nonce = await getAndIncrementNonce(forwarder, "getNonce", [
        transaction.from,
      ]);

      let domain;
      let types;
      let message: ForwardRequestMessage;

      if (this.options.gasless.experimentalChainlessSupport) {
        domain = {
          name: "GSNv2 Forwarder",
          version: "0.0.1",
          verifyingContract: forwarderAddress,
        };

        types = {
          ForwardRequest: ChainAwareForwardRequest,
        };

        message = {
          from: transaction.from,
          to: transaction.to,
          value: BigNumber.from(0).toString(),
          gas: BigNumber.from(transaction.gasLimit).toString(),
          nonce: BigNumber.from(nonce).toString(),
          data: transaction.data,
          chainid: BigNumber.from(transaction.chainId).toString(),
        };
      } else {
        domain = {
          name: this.options.gasless.engine.domainName,
          version: this.options.gasless.engine.domainVersion,
          chainId: transaction.chainId,
          verifyingContract: forwarderAddress,
        };

        types = {
          ForwardRequest,
        };

        message = {
          from: transaction.from,
          to: transaction.to,
          value: BigNumber.from(0).toString(),
          gas: BigNumber.from(transaction.gasLimit).toString(),
          nonce: BigNumber.from(nonce).toString(),
          data: transaction.data,
        };
      }

      const { signature: sig } = await signTypedDataInternal(
        signer,
        domain,
        types,
        message,
      );
      const signature: BytesLike = sig;

      return {
        method: "POST",
        body: JSON.stringify({
          type: "forward",
          request: message,
          signature,
          forwarderAddress,
        }),
      };
    }
  }

  private async biconomySendFunction(
    transaction: GaslessTransaction,
  ): Promise<string> {
    invariant(
      this.options.gasless && "biconomy" in this.options.gasless,
      "calling biconomySendFunction without biconomy",
    );
    const signer = this.getSigner();
    const provider = this.getProvider();
    invariant(signer && provider, "signer and provider must be set");

    const forwarder = new Contract(
      getContractAddressByChainId(
        transaction.chainId,
        "biconomyForwarder",
      ) as string,
      BiconomyForwarderAbi,
      provider,
    );
    const batchId = 0;
    const batchNonce = await getAndIncrementNonce(forwarder, "getNonce", [
      transaction.from,
      batchId,
    ]);

    const request = {
      from: transaction.from,
      to: transaction.to,
      token: constants.AddressZero,
      txGas: transaction.gasLimit.toNumber(),
      tokenGasPrice: "0",
      batchId,
      batchNonce: batchNonce.toNumber(),
      deadline: Math.floor(
        Date.now() / 1000 +
          ((this.options?.gasless &&
            "biconomy" in this.options.gasless &&
            this.options.gasless.biconomy?.deadlineSeconds) ||
            3600),
      ),
      data: transaction.data,
    };

    const hashToSign = utils.arrayify(
      utils.solidityKeccak256(
        [
          "address",
          "address",
          "address",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "bytes32",
        ],
        [
          request.from,
          request.to,
          request.token,
          request.txGas,
          request.tokenGasPrice,
          request.batchId,
          request.batchNonce,
          request.deadline,
          utils.keccak256(request.data),
        ],
      ),
    );

    this.emit(EventType.Signature, {
      status: "submitted",
      message: hashToSign,
      signature: "",
    });
    const signature = await signer.signMessage(hashToSign);
    this.emit(EventType.Signature, {
      status: "completed",
      message: hashToSign,
      signature,
    });
    const response = await fetch(
      "https://api.biconomy.io/api/v2/meta-tx/native",
      {
        method: "POST",
        body: JSON.stringify({
          from: transaction.from,
          apiId: this.options.gasless.biconomy.apiId,
          params: [request, signature],
          to: transaction.to,
          gasLimit: transaction.gasLimit.toHexString(),
        }),
        headers: {
          "x-api-key": this.options.gasless.biconomy.apiKey,
          "Content-Type": "application/json;charset=utf-8",
        },
      },
    );

    if (response.ok) {
      const resp = await response.json();
      if (!resp.txHash) {
        throw new Error(`relay transaction failed: ${resp.log}`);
      }
      return resp.txHash;
    }
    throw new Error(
      `relay transaction failed with status: ${response.status} (${response.statusText})`,
    );
  }

  private async defenderSendFunction(
    transaction: GaslessTransaction,
  ): Promise<string> {
    invariant(
      this.options.gasless && "openzeppelin" in this.options.gasless,
      "calling openzeppelin gasless transaction without openzeppelin config in the SDK options",
    );
    const signer = this.getSigner();
    const provider = this.getProvider();
    invariant(signer, "provider is not set");
    invariant(provider, "provider is not set");
    const ForwarderABI = (
      await import("@thirdweb-dev/contracts-js/dist/abis/Forwarder.json")
    ).default;
    const forwarderAddress =
      this.options.gasless.openzeppelin.relayerForwarderAddress ||
      (this.options.gasless.openzeppelin.useEOAForwarder
        ? CONTRACT_ADDRESSES[
            transaction.chainId as keyof typeof CONTRACT_ADDRESSES
          ]?.openzeppelinForwarderEOA ||
          (await computeEOAForwarderAddress(
            this.getProvider(),
            this.storage,
            "",
            this.options.clientId,
            this.options.secretKey,
          ))
        : CONTRACT_ADDRESSES[
            transaction.chainId as keyof typeof CONTRACT_ADDRESSES
          ]?.openzeppelinForwarder ||
          (await computeForwarderAddress(
            this.getProvider(),
            this.storage,
            "",
            this.options.clientId,
            this.options.secretKey,
          )));

    const forwarder = new Contract(forwarderAddress, ForwarderABI, provider);
    const nonce = await getAndIncrementNonce(forwarder, "getNonce", [
      transaction.from,
    ]);
    let domain;
    let types;
    let message: ForwardRequestMessage | PermitRequestMessage;
    if (this.options.gasless.experimentalChainlessSupport) {
      domain = {
        name: "GSNv2 Forwarder",
        version: "0.0.1",
        verifyingContract: forwarderAddress,
      };
      types = {
        ForwardRequest: ChainAwareForwardRequest,
      };
      message = {
        from: transaction.from,
        to: transaction.to,
        value: BigNumber.from(0).toString(),
        gas: BigNumber.from(transaction.gasLimit).toString(),
        nonce: BigNumber.from(nonce).toString(),
        data: transaction.data,
        chainid: BigNumber.from(transaction.chainId).toString(),
      };
    } else {
      domain = {
        name: this.options.gasless.openzeppelin.domainName,
        version: this.options.gasless.openzeppelin.domainVersion,
        chainId: transaction.chainId,
        verifyingContract: forwarderAddress,
      };
      types = {
        ForwardRequest,
      };
      message = {
        from: transaction.from,
        to: transaction.to,
        value: BigNumber.from(0).toString(),
        gas: BigNumber.from(transaction.gasLimit).toString(),
        nonce: BigNumber.from(nonce).toString(),
        data: transaction.data,
      };
    }

    let signature: BytesLike;

    this.emit(EventType.Signature, {
      status: "submitted",
      message,
      signature: "",
    });

    // if the executing function is "approve" and matches with erc20 approve signature
    // and if the token supports permit, then we use permit for gasless instead of approve.
    if (
      transaction.functionName === "approve" &&
      transaction.functionArgs.length === 2
    ) {
      const spender = transaction.functionArgs[0];
      const amount = transaction.functionArgs[1];
      // TODO: support DAI permit by signDAIPermit
      const { message: permit, signature: sig } = await signEIP2612Permit(
        signer,
        this.writeContract.address,
        transaction.from,
        spender,
        amount,
        this.options.gasless.openzeppelin.domainSeparatorVersion,
      );

      const { r, s, v } = utils.splitSignature(sig);

      message = {
        to: this.address,
        owner: permit.owner,
        spender: permit.spender,
        value: BigNumber.from(permit.value).toString(),
        nonce: BigNumber.from(permit.nonce).toString(),
        deadline: BigNumber.from(permit.deadline).toString(),
        r,
        s,
        v,
      };
      signature = sig;
    } else {
      const { signature: sig } = await signTypedDataInternal(
        signer,
        domain,
        types,
        message,
      );
      signature = sig;
    }

    let messageType = "forward";

    // if has owner property then it's permit :)
    if ((message as PermitRequestMessage)?.owner) {
      messageType = "permit";
    }

    const body = JSON.stringify({
      request: message,
      signature,
      forwarderAddress,
      type: messageType,
    });

    this.emit(EventType.Signature, {
      status: "completed",
      message,
      signature,
    });

    const response = await fetch(this.options.gasless.openzeppelin.relayerUrl, {
      method: "POST",
      body,
    });
    if (response.ok) {
      const resp = await response.json();
      if (!resp.result) {
        throw new Error(`Relay transaction failed: ${resp.message}`);
      }
      const result = JSON.parse(resp.result);
      return result.txHash;
    }
    throw new Error(
      `relay transaction failed with status: ${response.status} (${response.statusText})`,
    );
  }
}
