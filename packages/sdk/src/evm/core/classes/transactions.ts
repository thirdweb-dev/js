import { TransactionError, parseRevertReason } from "../../common/error";
import { getPolygonGasPriorityFee } from "../../common/gas-price";
import {
  fetchContractMetadataFromAddress,
  fetchSourceFilesFromMetadata,
} from "../../common/metadata-resolver";
import { defaultGaslessSendFunction } from "../../common/transactions";
import { isBrowser } from "../../common/utils";
import { ChainId } from "../../constants/chains";
import { ContractSource } from "../../schema/contracts/custom";
import { SDKOptionsOutput } from "../../schema/sdk-options";
import {
  ParseTransactionReceipt,
  TransactionOptionsWithContract,
  TransactionOptionsWithContractInfo,
  TransactionOptionsWithContractWrapper,
} from "../../types/transactions";
import { GaslessTransaction, TransactionResult } from "../types";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { CallOverrides, ethers } from "ethers";
import { BigNumber, utils, Contract } from "ethers";
import type { ConnectionInfo } from "ethers/lib/utils.js";
import invariant from "tiny-invariant";

export class Transaction<TResult = TransactionResult> {
  private contract: ethers.Contract;
  private method: string;
  private args: any[];
  private overrides: CallOverrides;
  private provider: ethers.providers.Provider;
  private signer: ethers.Signer;
  private storage: ThirdwebStorage;
  private gaslessOptions?: SDKOptionsOutput["gasless"];
  private parse?: ParseTransactionReceipt<TResult>;
  private gasMultiple?: number;

  static fromContractWrapper<
    TContract extends ethers.BaseContract,
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
    };

    return new Transaction(optionsWithContract);
  }

  static async fromContractInfo<TResult = TransactionResult>(
    options: TransactionOptionsWithContractInfo<TResult>,
  ): Promise<Transaction<TResult>> {
    const storage = options.storage || new ThirdwebStorage();

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
    this.method = options.method;
    this.args = options.args;
    this.overrides = options.overrides || {};
    this.provider = options.provider;
    this.signer = options.signer;
    this.gaslessOptions = options.gasless;
    this.parse = options.parse as ParseTransactionReceipt<TResult> | undefined;

    // Connect provider to signer if it isn't already connected
    if (!this.signer.provider) {
      this.signer = this.signer.connect(this.provider);
    }

    // Always connect the signer to the contract
    this.contract = options.contract.connect(this.signer);

    // Create new storage instance if one isn't provided
    this.storage = options.storage || new ThirdwebStorage();
  }

  getMethod() {
    return this.method;
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

  getGaslessOptions() {
    return this.gaslessOptions;
  }

  setArgs(args: any[]): Transaction<TResult> {
    this.args = args;
    return this;
  }

  setOverrides(overrides: CallOverrides): Transaction<TResult> {
    this.overrides = overrides;
    return this;
  }

  updateOverrides(overrides: CallOverrides): Transaction<TResult> {
    this.overrides = { ...this.overrides, ...overrides };
    return this;
  }

  setValue(value: CallOverrides["value"]): Transaction<TResult> {
    this.updateOverrides({ value });
    return this;
  }

  setGasLimit(gasLimit: CallOverrides["gasLimit"]): Transaction<TResult> {
    this.updateOverrides({ gasLimit });
    return this;
  }

  setGasPrice(gasPrice: CallOverrides["gasPrice"]): Transaction<TResult> {
    this.updateOverrides({ gasPrice });
    return this;
  }

  setNonce(nonce: CallOverrides["nonce"]): Transaction<TResult> {
    this.updateOverrides({ nonce });
    return this;
  }

  setMaxFeePerGas(
    maxFeePerGas: CallOverrides["maxFeePerGas"],
  ): Transaction<TResult> {
    this.updateOverrides({ maxFeePerGas });
    return this;
  }

  setMaxPriorityFeePerGas(
    maxPriorityFeePerGas: CallOverrides["maxPriorityFeePerGas"],
  ): Transaction<TResult> {
    this.updateOverrides({ maxPriorityFeePerGas });
    return this;
  }

  setType(type: CallOverrides["type"]): Transaction<TResult> {
    this.updateOverrides({ type });
    return this;
  }

  setAccessList(accessList: CallOverrides["accessList"]): Transaction<TResult> {
    this.updateOverrides({ accessList });
    return this;
  }

  setCustomData(customData: CallOverrides["customData"]): Transaction<TResult> {
    this.updateOverrides({ customData });
    return this;
  }

  setCcipReadEnabled(
    ccipReadEnabled: CallOverrides["ccipReadEnabled"],
  ): Transaction<TResult> {
    this.updateOverrides({ ccipReadEnabled });
    return this;
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
   * Set a multiple to multiply the gas limit by
   *
   * @example
   * ```js
   * // Set the gas limit multiple to 1.2 (increase by 20%)
   * tx.setGasLimitMultiple(1.2)
   * ```
   */
  setGasLimitMultiple(factor: number) {
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
   * Encode the function data for this transaction
   */
  encode(): string {
    return this.contract.interface.encodeFunctionData(this.method, this.args);
  }

  /**
   * Get the signed transaction
   */
  async sign(): Promise<string> {
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
    const signedTx = await this.contract.signer.signTransaction(populatedTx);
    return signedTx;
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
      throw this.transactionError(err);
    }
  }

  /**
   * Estimate the total gas cost of this transaction (in both ether and wei)
   */
  async estimateGasCost() {
    const gasLimit = await this.estimateGasLimit();
    const gasPrice = await this.getGasPrice();
    const gasCost = gasLimit.mul(gasPrice);

    return {
      ether: utils.formatEther(gasCost),
      wei: gasCost,
    };
  }

  /**
   * Send the transaction without waiting for it to be mined.
   */
  async send(): Promise<ethers.ContractTransaction> {
    if (!this.contract.functions[this.method]) {
      throw this.functionError();
    }

    if (
      this.gaslessOptions &&
      ("openzeppelin" in this.gaslessOptions ||
        "biconomy" in this.gaslessOptions)
    ) {
      return this.sendGasless();
    }

    const gasOverrides = await this.getGasOverrides();
    const overrides: CallOverrides = { ...gasOverrides, ...this.overrides };

    // First, if no gasLimit is passed, call estimate gas ourselves
    if (!overrides.gasLimit) {
      overrides.gasLimit = await this.estimateGasLimit();
    }

    // Now there should be no gas estimate errors
    try {
      return await this.contract.functions[this.method](
        ...this.args,
        overrides,
      );
    } catch (err) {
      // First, check if the error is an insufficient balance error
      const from = await (overrides.from || this.getSignerAddress());
      const value = await (overrides.value ? overrides.value : 0);
      const balance = await this.provider.getBalance(from);

      if (balance.eq(0) || (value && balance.lt(value))) {
        throw await this.transactionError(
          new Error(
            "You have insufficient funds in your account to execute this transaction.",
          ),
        );
      }

      throw await this.transactionError(err);
    }
  }

  /**
   * Send the transaction and wait for it to be mined
   */
  async execute(): Promise<TResult> {
    // TODO: Add submitted and completed events
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
   * Get the address of the transaction signer
   */
  private async getSignerAddress() {
    return this.signer.getAddress();
  }

  /**
   * Execute the transaction with gasless
   */
  private async sendGasless(): Promise<ethers.ContractTransaction> {
    invariant(
      this.gaslessOptions &&
        ("openzeppelin" in this.gaslessOptions ||
          "biconomy" in this.gaslessOptions),
      "No gasless options set on this transaction!",
    );

    const args = [...this.args];

    if (
      this.method === "multicall" &&
      Array.isArray(this.args[0]) &&
      args[0].length > 0
    ) {
      const from = await this.getSignerAddress();
      args[0] = args[0].map((tx: any) =>
        utils.solidityPack(["bytes", "address"], [tx, from]),
      );
    }

    invariant(
      this.signer,
      "Cannot execute gasless transaction without valid signer",
    );

    const chainId = (await this.provider.getNetwork()).chainId;
    const from = await (this.overrides.from || this.getSignerAddress());
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

    const tx: GaslessTransaction = {
      from,
      to,
      data,
      chainId,
      gasLimit: gas,
      functionName: this.method,
      functionArgs: args,
      callOverrides: this.overrides,
    };

    const txHash = await defaultGaslessSendFunction(
      tx,
      this.signer,
      this.provider,
      this.gaslessOptions,
    );

    // Need to poll here because ethers.provider.getTransaction lies about the type
    // It can actually return null, which can happen if we're still in gasless API send queue
    let sentTx;
    let iteration = 1;
    while (!sentTx) {
      sentTx = await this.provider.getTransaction(txHash);

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
   * Get gas overrides for the transaction
   */
  private async getGasOverrides() {
    // If we're running in the browser, let users configure gas price in their wallet UI
    if (isBrowser()) {
      return {};
    }

    const feeData = await this.provider.getFeeData();
    const supports1559 = feeData.maxFeePerGas && feeData.maxPriorityFeePerGas;
    if (supports1559) {
      const chainId = (await this.provider.getNetwork()).chainId;
      const block = await this.provider.getBlock("latest");
      const baseBlockFee =
        block && block.baseFeePerGas
          ? block.baseFeePerGas
          : utils.parseUnits("1", "gwei");
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
        gasPrice: await this.getGasPrice(),
      };
    }
  }

  /**
   * Calculates the priority fee per gas according (adding a 10% buffer)
   */
  private getPreferredPriorityFee(
    defaultPriorityFeePerGas: BigNumber,
  ): BigNumber {
    const extraTip = defaultPriorityFeePerGas.div(100).mul(10); // + 10%
    const txGasPrice = defaultPriorityFeePerGas.add(extraTip);
    const maxGasPrice = utils.parseUnits("300", "gwei"); // no more than 300 gwei
    const minGasPrice = utils.parseUnits("2.5", "gwei"); // no less than 2.5 gwei

    if (txGasPrice.gt(maxGasPrice)) {
      return maxGasPrice;
    }
    if (txGasPrice.lt(minGasPrice)) {
      return minGasPrice;
    }

    return txGasPrice;
  }

  /**
   * Calculates the gas price for transactions (adding a 10% tip buffer)
   */
  public async getGasPrice(): Promise<BigNumber> {
    const gasPrice = await this.provider.getGasPrice();
    const maxGasPrice = utils.parseUnits("300", "gwei"); // 300 gwei
    const extraTip = gasPrice.div(100).mul(10); // + 10%
    const txGasPrice = gasPrice.add(extraTip);

    if (txGasPrice.gt(maxGasPrice)) {
      return maxGasPrice;
    }

    return txGasPrice;
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
    const provider = this.provider as ethers.providers.Provider & {
      connection?: ConnectionInfo;
    };

    // Get metadata for transaction to populate into error
    const network = await provider.getNetwork();
    const from = await (this.overrides.from || this.getSignerAddress());
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
      const metadata = await fetchContractMetadataFromAddress(
        this.contract.address,
        this.provider,
        this.storage,
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

    return new TransactionError({
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
    });
  }
}
