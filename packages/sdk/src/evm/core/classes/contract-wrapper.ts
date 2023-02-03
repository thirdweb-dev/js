import { convertToTWError, extractFunctionsFromAbi } from "../../common";
import {
  BiconomyForwarderAbi,
  ChainAwareForwardRequest,
  ForwardRequest,
  getAndIncrementNonce,
} from "../../common/forwarder";
import { getPolygonGasPriorityFee } from "../../common/gas-price";
import { signEIP2612Permit } from "../../common/permit";
import { signTypedDataInternal } from "../../common/sign";
import { isBrowser } from "../../common/utils";
import { CONTRACT_ADDRESSES, ChainId } from "../../constants";
import { getContractAddressByChainId } from "../../constants/addresses";
import { EventType } from "../../constants/events";
import { CallOverrideSchema } from "../../schema";
import { AbiSchema } from "../../schema/contracts/custom";
import { SDKOptions } from "../../schema/sdk-options";
import {
  ForwardRequestMessage,
  GaslessTransaction,
  NetworkOrSignerOrProvider,
  PermitRequestMessage,
} from "../types";
import { RPCConnectionHandler } from "./rpc-connection-handler";
import ForwarderABI from "@thirdweb-dev/contracts-js/dist/abis/Forwarder.json";
import fetch from "cross-fetch";
import {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  Contract,
  ContractInterface,
  ContractTransaction,
  ethers,
  providers,
} from "ethers";
import invariant from "tiny-invariant";

/**
 * @internal
 */
export class ContractWrapper<
  TContract extends BaseContract,
> extends RPCConnectionHandler {
  private isValidContract = false;
  private customOverrides: () => CallOverrides = () => ({});
  /**
   * @internal
   */
  public writeContract;
  public readContract;
  public abi;

  constructor(
    network: NetworkOrSignerOrProvider,
    contractAddress: string,
    contractAbi: ContractInterface,
    options: SDKOptions,
  ) {
    super(network, options);
    this.abi = contractAbi;
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
  }

  public override updateSignerOrProvider(
    network: NetworkOrSignerOrProvider,
  ): void {
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
  public async getSignerAddress(): Promise<string> {
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
    if (isBrowser()) {
      // When running in the browser, let the wallet suggest gas estimates
      // this means that the gas speed preferences set in the SDK options are ignored in a browser context
      // but it also allows users to select their own gas speed prefs per tx from their wallet directly
      return {};
    }
    const feeData = await this.getProvider().getFeeData();
    const supports1559 = feeData.maxFeePerGas && feeData.maxPriorityFeePerGas;
    if (supports1559) {
      const chainId = await this.getChainID();
      const block = await this.getProvider().getBlock("latest");
      const baseBlockFee =
        block && block.baseFeePerGas
          ? block.baseFeePerGas
          : ethers.utils.parseUnits("1", "gwei");
      let defaultPriorityFee: BigNumber;
      if (chainId === ChainId.Mumbai || chainId === ChainId.Polygon) {
        // for polygon, get fee data from gas station
        defaultPriorityFee = await getPolygonGasPriorityFee(chainId);
      } else {
        // otherwise get it from ethers
        defaultPriorityFee = BigNumber.from(feeData.maxPriorityFeePerGas);
      }
      // then add additional fee based on user preferences
      const maxPriorityFeePerGas =
        this.getPreferredPriorityFee(defaultPriorityFee);
      // See: https://eips.ethereum.org/EIPS/eip-1559 for formula
      const baseMaxFeePerGas = baseBlockFee.mul(2);
      const maxFeePerGas = baseMaxFeePerGas.add(maxPriorityFeePerGas);
      return {
        maxFeePerGas,
        maxPriorityFeePerGas,
      };
    } else {
      return {
        gasPrice: await this.getPreferredGasPrice(),
      };
    }
  }

  /**
   * Calculates the priority fee per gas according to user preferences
   * @param defaultPriorityFeePerGas - the base priority fee
   */
  private getPreferredPriorityFee(
    defaultPriorityFeePerGas: BigNumber,
  ): BigNumber {
    const speed = this.options.gasSettings.speed;
    const maxGasPrice = this.options.gasSettings.maxPriceInGwei;
    let extraTip;
    switch (speed) {
      case "standard":
        extraTip = BigNumber.from(0); // default is 2.5 gwei for ETH, 31 gwei for polygon
        break;
      case "fast":
        extraTip = defaultPriorityFeePerGas.div(100).mul(5); // + 5% - 2.625 gwei / 32.5 gwei
        break;
      case "fastest":
        extraTip = defaultPriorityFeePerGas.div(100).mul(10); // + 10% - 2.75 gwei / 34.1 gwei
        break;
    }
    let txGasPrice = defaultPriorityFeePerGas.add(extraTip);
    const max = ethers.utils.parseUnits(maxGasPrice.toString(), "gwei"); // no more than max gas setting
    const min = ethers.utils.parseUnits("2.5", "gwei"); // no less than 2.5 gwei
    if (txGasPrice.gt(max)) {
      txGasPrice = max;
    }
    if (txGasPrice.lt(min)) {
      txGasPrice = min;
    }
    return txGasPrice;
  }

  /**
   * Calculates the gas price for transactions according to user preferences
   */
  public async getPreferredGasPrice(): Promise<BigNumber> {
    const gasPrice = await this.getProvider().getGasPrice();
    const speed = this.options.gasSettings.speed;
    const maxGasPrice = this.options.gasSettings.maxPriceInGwei;
    let txGasPrice = gasPrice;
    let extraTip;
    switch (speed) {
      case "standard":
        extraTip = BigNumber.from(1); // min 1 wei
        break;
      case "fast":
        extraTip = gasPrice.div(100).mul(5); // + 5%
        break;
      case "fastest":
        extraTip = gasPrice.div(100).mul(10); // + 10%
        break;
    }
    txGasPrice = txGasPrice.add(extraTip);
    const max = ethers.utils.parseUnits(maxGasPrice.toString(), "gwei");
    if (txGasPrice.gt(max)) {
      txGasPrice = max;
    }
    return txGasPrice;
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
   * @internal
   */
  public async call(
    functionName: string,
    ...args: unknown[] | [...unknown[], CallOverrides]
  ): Promise<any> {
    // parse last arg as tx options if present
    let txOptions: CallOverrides | undefined;
    try {
      if (args.length > 0 && typeof args[args.length - 1] === "object") {
        const last = args[args.length - 1];
        txOptions = CallOverrideSchema.parse(last);
        // if call overrides found, remove it from args array
        args = args.slice(0, args.length - 1);
      }
    } catch (e) {
      // no-op
    }

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
      return (this.readContract as any)[fnName](...args);
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
        "biconomy" in this.options.gasless)
    ) {
      if (fn === "multicall" && Array.isArray(args[0]) && args[0].length > 0) {
        const from = await this.getSignerAddress();
        args[0] = args[0].map((tx: any) =>
          ethers.utils.solidityPack(["bytes", "address"], [tx, from]),
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
        const code = await this.getProvider().getCode(
          this.readContract.address,
        );
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
      const receipt = tx.wait();
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
    const func: ethers.ContractFunction = (this.writeContract.functions as any)[
      fn
    ];
    if (!func) {
      throw new Error(`invalid function: "${fn.toString()}"`);
    }

    // First, if no gasLimit is passed, call estimate gas ourselves
    if (!callOverrides.gasLimit) {
      try {
        callOverrides.gasLimit = await this.writeContract.estimateGas[
          fn as string
        ](...args, callOverrides);
      } catch {
        // If gas estimation fails, we'll call static to get a better error message
        try {
          await this.writeContract.callStatic[fn as string](
            ...args,
            ...(callOverrides.value ? [{ value: callOverrides.value }] : []),
          );
        } catch (err: any) {
          throw await this.formatError(err);
        }

        // If call static doesn't throw for some reason (it should), continue
      }
    }

    // Now there should be no gas estimate errors
    try {
      return await func(...args, callOverrides);
    } catch (err) {
      throw await this.formatError(err);
    }
  }

  private async formatError(err: any) {
    const provider = this.getProvider();
    const network = await provider.getNetwork();
    const signerAddress = await this.getSignerAddress();
    const contractAddress = this.readContract.address;
    return await convertToTWError(
      err,
      network,
      signerAddress,
      contractAddress,
      this.readContract.interface,
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
    signer: ethers.Signer,
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
    }
    return this.defenderSendFunction(transaction);
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

    const forwarder = new ethers.Contract(
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
      token: ethers.constants.AddressZero,
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

    const hashToSign = ethers.utils.arrayify(
      ethers.utils.solidityKeccak256(
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
          ethers.utils.keccak256(request.data),
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
    const forwarderAddress =
      this.options.gasless.openzeppelin.relayerForwarderAddress ||
      (this.options.gasless.openzeppelin.useEOAForwarder
        ? CONTRACT_ADDRESSES[
            transaction.chainId as keyof typeof CONTRACT_ADDRESSES
          ].openzeppelinForwarderEOA
        : CONTRACT_ADDRESSES[
            transaction.chainId as keyof typeof CONTRACT_ADDRESSES
          ].openzeppelinForwarder);

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
        name: "GSNv2 Forwarder",
        version: "0.0.1",
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
      );

      const { r, s, v } = ethers.utils.splitSignature(sig);

      message = {
        to: this.readContract.address,
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
