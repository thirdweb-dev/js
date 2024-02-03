import { TransactionError, parseRevertReason } from "../../common/error";
import { getDefaultGasOverrides, getGasPrice } from "../../common/gas-price";
import {
  fetchContractMetadataFromAddress,
  getContractMetadataFromCache,
} from "../../common/metadata-resolver";
import { fetchSourceFilesFromMetadata } from "../../common/fetchSourceFilesFromMetadata";
import { isRouterContract } from "../../common/plugin/isRouterContract";
import { ContractSource } from "../../schema/contracts/custom";
import { SDKOptionsOutput } from "../../schema/sdk-options";
import type {
  DeployTransactionOptions,
  ParseTransactionReceipt,
  TransactionContextOptions,
  TransactionOptionsWithContract,
  TransactionOptionsWithContractInfo,
  TransactionOptionsWithContractWrapper,
} from "../../types/transactions";
import { GaslessTransaction, TransactionResult } from "../types";
import { ThirdwebStorage, isBrowser } from "@thirdweb-dev/storage";
import {
  BaseContract,
  CallOverrides,
  Contract,
  ContractFactory,
  ContractTransaction,
  providers,
  Signer,
  utils,
  constants,
} from "ethers";
import { BigNumber } from "ethers";
import invariant from "tiny-invariant";
import EventEmitter from "eventemitter3";
import type { DeployEvents } from "../../types/deploy/deploy-events";
import { ForwardRequestMessage, PermitRequestMessage } from "../types";
import { computeEOAForwarderAddress } from "../../common/any-evm-utils/computeEOAForwarderAddress";
import { computeForwarderAddress } from "../../common/any-evm-utils/computeForwarderAddress";
import {
  BiconomyForwarderAbi,
  ChainAwareForwardRequest,
  ForwardRequest,
  getAndIncrementNonce,
} from "../../common/forwarder";
import { signEIP2612Permit } from "../../common/permit";
import { signTypedDataInternal } from "../../common/sign";
import { BytesLike } from "ethers";
import { CONTRACT_ADDRESSES } from "../../constants/addresses/CONTRACT_ADDRESSES";
import { getContractAddressByChainId } from "../../constants/addresses/getContractAddressByChainId";
import { getCompositeABI } from "../../common/plugin/getCompositePluginABI";
import { ContractWrapper } from "./internal/contract-wrapper";

abstract class TransactionContext {
  protected args: any[];
  protected overrides: CallOverrides;
  protected provider: providers.Provider;
  protected signer: Signer;
  protected storage: ThirdwebStorage;
  protected gasMultiple?: number;

  constructor(options: TransactionContextOptions) {
    this.args = options.args;
    this.overrides = options.overrides || {};
    this.provider = options.provider;
    this.signer = options.signer;
    this.storage = options.storage;

    // Connect provider to signer if it isn't already connected
    if (!this.signer.provider) {
      this.signer = this.signer.connect(this.provider);
    }
  }
  public get getSigner() {
    return this.signer;
  }

  public get getProvider() {
    return this.provider;
  }

  public get getStorage() {
    return this.storage;
  }

  getArgs() {
    return this.args;
  }

  getOverrides() {
    return this.overrides;
  }

  getValue() {
    return this.overrides.value || 0;
  }

  setArgs(args: any[]): TransactionContext {
    this.args = args;
    return this;
  }

  setOverrides(overrides: CallOverrides): TransactionContext {
    this.overrides = overrides;
    return this;
  }

  updateOverrides(overrides: CallOverrides): TransactionContext {
    this.overrides = { ...this.overrides, ...overrides };
    return this;
  }

  setValue(value: CallOverrides["value"]): TransactionContext {
    this.updateOverrides({ value });
    return this;
  }

  setGasLimit(gasLimit: CallOverrides["gasLimit"]): TransactionContext {
    this.updateOverrides({ gasLimit });
    return this;
  }

  setGasPrice(gasPrice: CallOverrides["gasPrice"]): TransactionContext {
    this.updateOverrides({ gasPrice });
    return this;
  }

  setNonce(nonce: CallOverrides["nonce"]): TransactionContext {
    this.updateOverrides({ nonce });
    return this;
  }

  setMaxFeePerGas(
    maxFeePerGas: CallOverrides["maxFeePerGas"],
  ): TransactionContext {
    this.updateOverrides({ maxFeePerGas });
    return this;
  }

  setMaxPriorityFeePerGas(
    maxPriorityFeePerGas: CallOverrides["maxPriorityFeePerGas"],
  ): TransactionContext {
    this.updateOverrides({ maxPriorityFeePerGas });
    return this;
  }

  setType(type: CallOverrides["type"]): TransactionContext {
    this.updateOverrides({ type });
    return this;
  }

  setAccessList(accessList: CallOverrides["accessList"]): TransactionContext {
    this.updateOverrides({ accessList });
    return this;
  }

  setCustomData(customData: CallOverrides["customData"]): TransactionContext {
    this.updateOverrides({ customData });
    return this;
  }

  setCcipReadEnabled(
    ccipReadEnabled: CallOverrides["ccipReadEnabled"],
  ): TransactionContext {
    this.updateOverrides({ ccipReadEnabled });
    return this;
  }

  public abstract estimateGasLimit(): Promise<BigNumber>;

  /**
   * Set a multiple to multiply the gas limit by
   *
   * @example
   * ```js
   * // Set the gas limit multiple to 1.2 (increase by 20%)
   * tx.setGasLimitMultiple(1.2)
   * ```
   */
  public setGasLimitMultiple(factor: number) {
    // If gasLimit override is set, we can just set it synchronously
    if (BigNumber.isBigNumber(this.overrides.gasLimit)) {
      this.overrides.gasLimit = BigNumber.from(
        Math.floor(BigNumber.from(this.overrides.gasLimit).toNumber() * factor),
      );
    } else {
      // Otherwise, set a gas multiple to use later
      this.gasMultiple = factor;
    }
  }

  /**
   * Estimate the total gas cost of this transaction (in both ether and wei)
   */
  public async estimateGasCost() {
    const [gasLimit, gasPrice] = await Promise.all([
      this.estimateGasLimit(),
      this.getGasPrice(),
    ]);
    const gasCost = gasLimit.mul(gasPrice);

    return {
      ether: utils.formatEther(gasCost),
      wei: gasCost,
    };
  }

  /**
   * Calculates the gas price for transactions (adding a 10% tip buffer)
   */
  public async getGasPrice(): Promise<BigNumber> {
    return getGasPrice(this.provider);
  }

  /**
   * Get the address of the transaction signer
   */
  public async getSignerAddress() {
    return this.signer.getAddress();
  }

  /**
   * Get gas overrides for the transaction
   */
  protected async getGasOverrides() {
    // If we're running in the browser, let users configure gas price in their wallet UI
    // TODO - should prob only check if its a json rpc signer (browser extension)
    if (isBrowser()) {
      return {};
    }
    return getDefaultGasOverrides(this.provider);
  }
}

/**
 * @contract
 */
export class Transaction<
  TResult = TransactionResult,
> extends TransactionContext {
  private method: string;
  private contract: Contract;
  private gaslessOptions?: SDKOptionsOutput["gasless"];
  private parse?: ParseTransactionReceipt<TResult>;

  static fromContractWrapper<
    TContract extends BaseContract,
    TResult = TransactionResult,
  >(
    options: TransactionOptionsWithContractWrapper<TContract, TResult>,
  ): Transaction<TResult> {
    const signer = options.contractWrapper.getSigner();
    if (!signer) {
      throw new Error(
        "Cannot create a transaction without a signer. Please ensure that you have a connected signer.",
      );
    }

    const optionsWithContract: TransactionOptionsWithContract<TResult> = {
      ...options,
      contract: options.contractWrapper.writeContract,
      provider: options.contractWrapper.getProvider(),
      signer,
      gasless: options.contractWrapper.options.gasless,
      storage: options.contractWrapper.storage,
    };

    return new Transaction(optionsWithContract);
  }

  static async fromContractInfo<TResult = TransactionResult>(
    options: TransactionOptionsWithContractInfo<TResult>,
  ): Promise<Transaction<TResult>> {
    const storage = options.storage;

    let contractAbi = options.contractAbi;
    if (!contractAbi) {
      try {
        const metadata = await fetchContractMetadataFromAddress(
          options.contractAddress,
          options.provider,
          storage,
        );
        contractAbi = metadata.abi;
      } catch {
        throw new Error(
          `Could resolve contract metadata for address ${options.contractAddress}. Please pass the contract ABI manually with the 'contractAbi' option.`,
        );
      }
    }

    const contract = new Contract(
      options.contractAddress,
      contractAbi,
      options.provider,
    );

    const optionsWithContract = {
      ...options,
      storage,
      contract,
    };

    return new Transaction(optionsWithContract);
  }

  constructor(options: TransactionOptionsWithContract<TResult>) {
    super({
      args: options.args,
      overrides: options.overrides,
      provider: options.provider,
      signer: options.signer,
      storage: options.storage,
    });

    this.method = options.method;
    this.gaslessOptions = options.gasless;
    this.parse = options.parse as ParseTransactionReceipt<TResult> | undefined;

    // Always connect the signer to the contract
    this.contract = options.contract.connect(this.signer);

    // Create new storage instance if one isn't provided
    this.storage = options.storage;
  }

  getTarget() {
    return this.contract.address;
  }

  getMethod() {
    return this.method;
  }

  getGaslessOptions() {
    return this.gaslessOptions;
  }

  setGaslessOptions(
    options: SDKOptionsOutput["gasless"],
  ): Transaction<TResult> {
    this.gaslessOptions = options;
    return this;
  }

  setParse(parse: ParseTransactionReceipt<TResult>): Transaction<TResult> {
    this.parse = parse;
    return this;
  }

  /**
   * Encode the function data for this transaction
   */
  encode(): string {
    return this.contract.interface.encodeFunctionData(this.method, this.args);
  }

  /**
   * Get the signed transaction
   */
  async sign(): Promise<string> {
    const populatedTx = await this.populateTransaction();
    const signedTx = await this.contract.signer.signTransaction(populatedTx);
    return signedTx;
  }

  async populateTransaction(): Promise<providers.TransactionRequest> {
    const gasOverrides = await this.getGasOverrides();
    const overrides: CallOverrides = { ...gasOverrides, ...this.overrides };

    // First, if no gasLimit is passed, call estimate gas ourselves
    if (!overrides.gasLimit) {
      overrides.gasLimit = await this.estimateGasLimit();
    }

    const tx = await this.contract.populateTransaction[this.method](
      ...this.args,
      overrides,
    );
    const populatedTx = await this.contract.signer.populateTransaction(tx);
    return populatedTx;
  }

  /**
   * Simulate the transaction on-chain without executing
   */
  async simulate() {
    if (!this.contract.callStatic[this.method]) {
      throw this.functionError();
    }

    try {
      return await this.contract.callStatic[this.method](
        ...this.args,
        ...(this.overrides.value ? [{ value: this.overrides.value }] : []),
      );
    } catch (err: any) {
      throw await this.transactionError(err);
    }
  }

  /**
   * Estimate the gas limit of this transaction
   */
  async estimateGasLimit() {
    if (!this.contract.estimateGas[this.method]) {
      throw this.functionError();
    }

    try {
      const gasEstimate = await this.contract.estimateGas[this.method](
        ...this.args,
        this.overrides,
      );

      if (this.gasMultiple) {
        return BigNumber.from(
          Math.floor(BigNumber.from(gasEstimate).toNumber() * this.gasMultiple),
        );
      }

      return gasEstimate;
    } catch (err: any) {
      // If gas estimation fails, we'll call static to get a better error message
      await this.simulate();

      // If transaction simulation (static call) doesn't throw, then throw a generic error
      throw await this.transactionError(err);
    }
  }

  /**
   * Send the transaction without waiting for it to be mined.
   */
  async send(): Promise<ContractTransaction> {
    if (!this.contract.functions[this.method]) {
      throw this.functionError();
    }

    if (
      this.gaslessOptions &&
      ("openzeppelin" in this.gaslessOptions ||
        "biconomy" in this.gaslessOptions ||
        "engine" in this.gaslessOptions)
    ) {
      return this.sendGasless();
    }

    const gasOverrides = await this.getGasOverrides();
    const overrides: CallOverrides = { ...gasOverrides, ...this.overrides };

    // First, if no gasLimit is passed, call estimate gas ourselves
    if (!overrides.gasLimit) {
      overrides.gasLimit = await this.estimateGasLimit();
      try {
        // for dynamic contracts, add 30% to the gas limit to account for multiple delegate calls
        const abi = JSON.parse(
          this.contract.interface.format("json") as string,
        );
        if (isRouterContract(abi)) {
          overrides.gasLimit = overrides.gasLimit.mul(110).div(100);
        }
      } catch (err) {
        console.warn("Error raising gas limit", err);
      }
    }

    // Now there should be no gas estimate errors
    try {
      return await this.contract.functions[this.method](
        ...this.args,
        overrides,
      );
    } catch (err) {
      throw await this.transactionError(err);
    }
  }

  /**
   * Send the transaction and wait for it to be mined
   */
  async execute(): Promise<TResult> {
    const tx = await this.send();

    let receipt;
    try {
      receipt = await tx.wait();
    } catch (err) {
      // If tx.wait() fails, it just gives us a generic "transaction failed"
      // error. So instead, we need to call static to get an informative error message
      await this.simulate();

      // If transaction simulation (static call) doesn't throw, then throw with the message that we have
      throw await this.transactionError(err);
    }

    if (this.parse) {
      return this.parse(receipt);
    }

    return { receipt } as TransactionResult as TResult;
  }

  /**
   * Execute the transaction with gasless
   */
  private async sendGasless(): Promise<ContractTransaction> {
    const tx = await this.prepareGasless();
    const txHash = await defaultGaslessSendFunction(
      tx,
      this.signer,
      this.provider,
      this.storage,
      this.gaslessOptions,
    );

    // Need to poll here because ethers.provider.getTransaction lies about the type
    // It can actually return null, which can happen if we're still in gasless API send queue
    let sentTx;
    let iteration = 1;
    while (!sentTx) {
      try {
        sentTx = await this.provider.getTransaction(txHash);
      } catch (err) {
        // some providers can throw an error if the tx is very recent
      }
      // Exponential (ish) backoff for polling
      if (!sentTx) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.min(iteration * 1000, 10000)),
        );
        iteration++;
      }

      // Timeout if we still don't have it after a while
      if (iteration > 20) {
        throw new Error(`Unable to retrieve transaction with hash ${txHash}`);
      }
    }

    return sentTx;
  }

  /**
   * @internal
   * @returns
   */
  public async prepareGasless(): Promise<GaslessTransaction> {
    invariant(
      this.gaslessOptions &&
        ("openzeppelin" in this.gaslessOptions ||
          "biconomy" in this.gaslessOptions ||
          "engine" in this.gaslessOptions),
      "No gasless options set on this transaction!",
    );

    const signerAddress = await this.getSignerAddress();
    const args = [...this.args];

    if (
      this.method === "multicall" &&
      Array.isArray(this.args[0]) &&
      args[0].length > 0
    ) {
      args[0] = args[0].map((tx: any) =>
        utils.solidityPack(["bytes", "address"], [tx, signerAddress]),
      );
    }

    invariant(
      this.signer,
      "Cannot execute gasless transaction without valid signer",
    );

    const [{ chainId }, from] = await Promise.all([
      this.provider.getNetwork(),
      this.overrides.from || signerAddress,
    ]);
    const to = this.contract.address;
    const value = this.overrides?.value || 0;

    if (BigNumber.from(value).gt(0)) {
      throw new Error(
        "Cannot send native token value with gasless transaction",
      );
    }

    const data = this.contract.interface.encodeFunctionData(this.method, args);

    let gas = BigNumber.from(0);
    try {
      const gasEstimate = await (this.contract.estimateGas as any)[this.method](
        ...args,
      );
      gas = gasEstimate.mul(2);
    } catch (e) {
      // ignore
    }

    // in some cases WalletConnect doesn't properly give an estimate for how much gas it would actually use.
    // as a fix, we're setting it to a high arbitrary number (500k) as the gas limit that should cover for most function calls.
    if (gas.lt(100000)) {
      gas = BigNumber.from(500000);
    }

    // check for gas override in callOverrides
    if (
      this.overrides.gasLimit &&
      BigNumber.from(this.overrides.gasLimit).gt(gas)
    ) {
      gas = BigNumber.from(this.overrides.gasLimit);
    }

    return {
      from,
      to,
      data,
      chainId,
      gasLimit: gas,
      functionName: this.method,
      functionArgs: args,
      callOverrides: this.overrides,
    };
  }

  private functionError() {
    return new Error(
      `Contract "${this.contract.address}" does not have function "${this.method}"`,
    );
  }

  /**
   * Create a nicely formatted error message with tx metadata and solidity stack trace
   */
  private async transactionError(error: any) {
    const provider = this.provider as providers.Provider & {
      connection?: utils.ConnectionInfo;
    };

    // Get metadata for transaction to populate into error
    const [network, from] = await Promise.all([
      provider.getNetwork(),
      this.overrides.from || this.getSignerAddress(),
    ]);
    const to = this.contract.address;
    const data = this.encode();
    const value = BigNumber.from(this.overrides.value || 0);
    const rpcUrl = provider.connection?.url;

    // Render function signature with arguments filled in
    const functionSignature = this.contract.interface.getFunction(this.method);
    const methodArgs = this.args.map((arg) => {
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
      const chainId = (await provider.getNetwork()).chainId;
      const metadata = getContractMetadataFromCache(
        this.contract.address,
        chainId,
      );

      if (metadata?.name) {
        contractName = metadata.name;
      }

      if (metadata?.metadata.sources) {
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
}

/**
 * @contract
 */
export class DeployTransaction extends TransactionContext {
  factory: ContractFactory;
  events: EventEmitter<DeployEvents> | undefined;

  constructor(options: DeployTransactionOptions) {
    super(options);
    this.factory = options.factory;
    this.events = options.events;
  }

  encode(): string {
    return utils.hexlify(
      utils.concat([
        this.factory.bytecode,
        this.factory.interface.encodeDeploy(this.args),
      ]),
    );
  }

  getTarget(): string {
    return constants.AddressZero;
  }

  getMethod(): string {
    return "deploy";
  }

  async sign(): Promise<string> {
    const populatedTx = await this.populateTransaction();
    return this.signer.signTransaction(populatedTx);
  }

  async simulate() {
    const populatedTx = await this.populateTransaction();
    return this.signer.call(populatedTx);
  }

  async estimateGasLimit(): Promise<BigNumber> {
    try {
      const gasOverrides = await this.getGasOverrides();
      const overrides: CallOverrides = { ...gasOverrides, ...this.overrides };
      const populatedTx = this.factory.getDeployTransaction(
        ...this.args,
        overrides,
      );

      return this.signer.estimateGas(populatedTx);
    } catch (err) {
      // No need to do simulation here, since there can't be revert errors
      throw await this.deployError(err);
    }
  }

  async send(): Promise<ContractTransaction> {
    try {
      const populatedTx = await this.populateTransaction();
      return await this.signer.sendTransaction(populatedTx);
    } catch (err) {
      throw await this.deployError(err);
    }
  }

  async execute(): Promise<string> {
    const tx = await this.send();

    try {
      await tx.wait();
    } catch (err) {
      // If tx.wait() fails, it just gives us a generic "transaction failed"
      // error. So instead, we need to call static to get an informative error message
      await this.simulate();

      // If transaction simulation (static call) doesn't throw, then throw with the message that we have
      throw await this.deployError(err);
    }

    const contractAddress = utils.getContractAddress({
      from: tx.from,
      nonce: tx.nonce,
    });

    // TODO: Remove when we delete events from deploy
    if (this.events) {
      this.events.emit("contractDeployed", {
        status: "completed",
        contractAddress,
        transactionHash: tx.hash,
      });
    }

    return contractAddress;
  }

  public async populateTransaction(): Promise<providers.TransactionRequest> {
    const gasOverrides = await this.getGasOverrides();
    const overrides: CallOverrides = { ...gasOverrides, ...this.overrides };

    // First, if no gasLimit is passed, call estimate gas ourselves
    if (!overrides.gasLimit) {
      overrides.gasLimit = await this.estimateGasLimit();
    }

    return this.factory.getDeployTransaction(...this.args, overrides);
  }

  /**
   * Create a nicely formatted error message with tx metadata and solidity stack trace
   */
  private async deployError(error: any) {
    const provider = this.provider as providers.Provider & {
      connection?: utils.ConnectionInfo;
    };

    // Get metadata for transaction to populate into error
    const [network, from] = await Promise.all([
      provider.getNetwork(),
      this.overrides.from || this.getSignerAddress(),
    ]);
    const data = this.encode();
    const value = BigNumber.from(this.overrides.value || 0);
    const rpcUrl = provider.connection?.url;

    const methodArgs = this.args.map((arg) => {
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
    const method = `deployContract(${joinedArgs})`;
    const hash =
      error.transactionHash ||
      error.transaction?.hash ||
      error.receipt?.transactionHash;

    // Parse the revert reason from the error
    const reason = parseRevertReason(error);

    return new TransactionError(
      {
        reason,
        from,
        method,
        data,
        network,
        rpcUrl,
        value,
        hash,
      },
      error,
    );
  }
}

async function defaultGaslessSendFunction(
  transaction: GaslessTransaction,
  signer: Signer,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  gaslessOptions?: SDKOptionsOutput["gasless"],
): Promise<string> {
  if (gaslessOptions && "biconomy" in gaslessOptions) {
    return biconomySendFunction(transaction, signer, provider, gaslessOptions);
  } else if (gaslessOptions && "openzeppelin" in gaslessOptions) {
    return defenderSendFunction(
      transaction,
      signer,
      provider,
      storage,
      gaslessOptions,
    );
  }

  return engineSendFunction(
    transaction,
    signer,
    provider,
    storage,
    gaslessOptions,
  );
}

/**
 * @internal
 */
export async function engineSendFunction(
  transaction: GaslessTransaction,
  signer: Signer,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  gaslessOptions?: SDKOptionsOutput["gasless"],
): Promise<string> {
  invariant(
    gaslessOptions && "engine" in gaslessOptions,
    "calling engine gasless transaction without engine config in the SDK options",
  );

  const request = await enginePrepareRequest(
    transaction,
    signer,
    provider,
    storage,
  );

  const res = await fetch(gaslessOptions.engine.relayerUrl, {
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
  const engineUrl = gaslessOptions.engine.relayerUrl.split("/relayer/")[0];
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

async function biconomySendFunction(
  transaction: GaslessTransaction,
  signer: Signer,
  provider: providers.Provider,
  gaslessOptions?: SDKOptionsOutput["gasless"],
): Promise<string> {
  const request = await biconomyPrepareRequest(
    transaction,
    signer,
    provider,
    gaslessOptions,
  );
  const response = await fetch(
    "https://api.biconomy.io/api/v2/meta-tx/native",
    request,
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

async function defenderSendFunction(
  transaction: GaslessTransaction,
  signer: Signer,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  gaslessOptions?: SDKOptionsOutput["gasless"],
): Promise<string> {
  invariant(
    gaslessOptions && "openzeppelin" in gaslessOptions,
    "calling openzeppelin gasless transaction without openzeppelin config in the SDK options",
  );

  const request = await defenderPrepareRequest(
    transaction,
    signer,
    provider,
    storage,
    gaslessOptions,
  );

  const response = await fetch(gaslessOptions.openzeppelin.relayerUrl, request);
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

async function enginePrepareRequest(
  transaction: GaslessTransaction,
  signer: Signer,
  provider: providers.Provider,
  storage: ThirdwebStorage,
) {
  try {
    const metadata = await fetchContractMetadataFromAddress(
      transaction.to,
      provider,
      storage,
    );

    const chainId = (await provider.getNetwork()).chainId;
    const abi = await getCompositeABI(
      transaction.to,
      metadata.abi,
      provider,
      {},
      storage,
    );
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
      CONTRACT_ADDRESSES[transaction.chainId as keyof typeof CONTRACT_ADDRESSES]
        ?.openzeppelinForwarder ||
      (await computeForwarderAddress(provider, storage));
    const ForwarderABI = (
      await import("@thirdweb-dev/contracts-js/dist/abis/Forwarder.json")
    ).default;

    const forwarder = new Contract(forwarderAddress, ForwarderABI, provider);
    const nonce = await getAndIncrementNonce(forwarder, "getNonce", [
      transaction.from,
    ]);

    const domain = {
      name: "GSNv2 Forwarder",
      version: "0.0.1",
      chainId: transaction.chainId,
      verifyingContract: forwarderAddress,
    };
    const types = {
      ForwardRequest,
    };

    const message = {
      from: transaction.from,
      to: transaction.to,
      value: BigNumber.from(0).toString(),
      gas: BigNumber.from(transaction.gasLimit).toString(),
      nonce: BigNumber.from(nonce).toString(),
      data: transaction.data,
    };

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

async function defenderPrepareRequest(
  transaction: GaslessTransaction,
  signer: Signer,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  gaslessOptions?: SDKOptionsOutput["gasless"],
) {
  invariant(
    gaslessOptions && "openzeppelin" in gaslessOptions,
    "calling openzeppelin gasless transaction without openzeppelin config in the SDK options",
  );
  invariant(signer, "provider is not set");
  invariant(provider, "provider is not set");
  const forwarderAddress =
    gaslessOptions.openzeppelin.relayerForwarderAddress ||
    (gaslessOptions.openzeppelin.useEOAForwarder
      ? CONTRACT_ADDRESSES[
          transaction.chainId as keyof typeof CONTRACT_ADDRESSES
        ]?.openzeppelinForwarderEOA ||
        (await computeEOAForwarderAddress(provider, storage))
      : CONTRACT_ADDRESSES[
          transaction.chainId as keyof typeof CONTRACT_ADDRESSES
        ]?.openzeppelinForwarder ||
        (await computeForwarderAddress(provider, storage)));
  const ForwarderABI = (
    await import("@thirdweb-dev/contracts-js/dist/abis/Forwarder.json")
  ).default;
  const forwarder = new Contract(forwarderAddress, ForwarderABI, provider);
  const nonce = await getAndIncrementNonce(forwarder, "getNonce", [
    transaction.from,
  ]);
  let domain;
  let types;
  let message: ForwardRequestMessage | PermitRequestMessage;
  if (gaslessOptions.experimentalChainlessSupport) {
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
      name: gaslessOptions.openzeppelin.domainName,
      version: gaslessOptions.openzeppelin.domainVersion,
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
      transaction.to,
      transaction.from,
      spender,
      amount,
    );

    const { r, s, v } = utils.splitSignature(sig);

    message = {
      to: transaction.to,
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

  return {
    method: "POST",
    body: JSON.stringify({
      request: message,
      signature,
      forwarderAddress,
      type: messageType,
    }),
  };
}

export async function prepareGaslessRequest(tx: Transaction) {
  const gaslessTx = await tx.prepareGasless();
  const gaslessOptions = tx.getGaslessOptions();

  if (gaslessOptions && "biconomy" in gaslessOptions) {
    const request = await biconomyPrepareRequest(
      gaslessTx,
      tx.getSigner,
      tx.getProvider,
      gaslessOptions,
    );

    return {
      url: "https://api.biconomy.io/api/v2/meta-tx/native",
      ...request,
    };
  } else {
    invariant(
      gaslessOptions && "openzeppelin" in gaslessOptions,
      "calling openzeppelin gasless transaction without openzeppelin config in the SDK options",
    );

    const request = await defenderPrepareRequest(
      gaslessTx,
      tx.getSigner,
      tx.getProvider,
      tx.getStorage,
      gaslessOptions,
    );

    return {
      url: gaslessOptions.openzeppelin.relayerUrl,
      ...request,
    };
  }
}

async function biconomyPrepareRequest(
  transaction: GaslessTransaction,
  signer: Signer,
  provider: providers.Provider,
  gaslessOptions?: SDKOptionsOutput["gasless"],
) {
  invariant(
    gaslessOptions && "biconomy" in gaslessOptions,
    "calling biconomySendFunction without biconomy",
  );
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
        ((gaslessOptions &&
          "biconomy" in gaslessOptions &&
          gaslessOptions.biconomy?.deadlineSeconds) ||
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

  const signature = await signer.signMessage(hashToSign);

  return {
    method: "POST",
    body: JSON.stringify({
      from: transaction.from,
      apiId: gaslessOptions.biconomy.apiId,
      params: [request, signature],
      to: transaction.to,
      gasLimit: transaction.gasLimit.toHexString(),
    }),
    headers: {
      "x-api-key": gaslessOptions.biconomy.apiKey,
      "Content-Type": "application/json;charset=utf-8",
    },
  };
}
