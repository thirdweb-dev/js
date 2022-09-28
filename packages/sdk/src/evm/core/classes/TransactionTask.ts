import { TransactionResult } from "../types";
import { ContractEncoder } from "./contract-encoder";
import { ContractWrapper } from "./contract-wrapper";
import { GasCostEstimator } from "./gas-cost-estimator";
import {
  BigNumber,
  BigNumberish,
  CallOverrides,
  ContractTransaction,
} from "ethers";

/**
 * Arguments for creating a transaction task.
 * @internal
 */
interface TransactionTaskArgs {
  // required
  contractWrapper: ContractWrapper<any>;
  functionName: string;
  // options
  args?: any[];
  overrides?: CallOverrides;
}

/**
 * @internal
 * Represents a transaction to be executed and can be customized.
 */
export class TransactionTask {
  static make(taskArgs: TransactionTaskArgs) {
    return new TransactionTask(taskArgs);
  }

  private contractWrapper: ContractWrapper<any>;
  private functionName: string;
  private args: any[];
  private overrides: CallOverrides | undefined;
  private encoder: ContractEncoder<any>;
  private estimator: GasCostEstimator<any>;

  private constructor(taskArgs: TransactionTaskArgs) {
    this.contractWrapper = taskArgs.contractWrapper;
    this.functionName = taskArgs.functionName;
    this.args = taskArgs.args || [];
    this.overrides = taskArgs.overrides;
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
  }

  // ////////////// Overrides ////////////////

  /**
   * Override the gas limit for this transaction.
   * @param gasLimit
   */
  public overrideGasLimit(gasLimit: BigNumberish): TransactionTask {
    this.overrides = {
      ...this.overrides,
      gasLimit,
    };
    return this;
  }

  /**
   * Override the gas price for this transaction.
   * @param gasPrice
   */
  public overrideGasPrice(gasPrice: BigNumberish): TransactionTask {
    this.overrides = {
      ...this.overrides,
      gasPrice,
    };
    return this;
  }

  /**
   * Override the nonce for this transaction.
   * @param nonce
   */
  public overrideNonce(nonce: BigNumberish): TransactionTask {
    this.overrides = {
      ...this.overrides,
      nonce,
    };
    return this;
  }

  /**
   * Override the value sent with this transaction.
   * @param value
   */
  public overrideValue(value: BigNumberish): TransactionTask {
    this.overrides = {
      ...this.overrides,
      value,
    };
    return this;
  }

  // ////////////// Estimates ////////////////

  /**
   * Returns the gas limit that this transaction would consume if executed.
   * @returns the gas limit in gas units
   */
  public async estimateGasLimit(): Promise<BigNumber> {
    return await this.estimator.gasLimitOf(this.functionName, this.args);
  }

  /**
   * Returns the total gas cost of this transaction if executed.
   * @returns the gas cost in ether
   */
  public async estimateGasCostInEther(): Promise<string> {
    return await this.estimator.gasCostOf(this.functionName, this.args);
  }

  // ////////////// Actions ////////////////

  /**
   * Returns the encoded function data of this transaction if executed.
   */
  public async encodeFunctionData(): Promise<string> {
    return this.encoder.encode(this.functionName, this.args);
  }

  /**
   * Submits this transaction to the network. Does not wait for the transaction to be mined.
   * To wait for the transaction to be mined, you can call `.wait()` on the result of this function.
   */
  public async submit(): Promise<ContractTransaction> {
    return await this.contractWrapper.sendTransactionByFunction(
      this.functionName,
      this.args,
      this.overrides || {},
    );
  }

  /**
   * Submits this transaction to the network and waits for it to be mined.
   */
  public async execute(): Promise<TransactionResult> {
    const receipt = await this.contractWrapper.sendTransaction(
      this.functionName,
      this.args,
      this.overrides || {},
    );
    return {
      receipt,
    };
  }
}
