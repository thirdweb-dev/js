import { ContractWrapper } from "./contract-wrapper";
import { BaseContract, BigNumber, utils } from "ethers";

/**
 * Estimates the gas cost of Contract calls
 * @public
 */
export class GasCostEstimator<TContract extends BaseContract> {
  private contractWrapper;

  constructor(contractWrapper: ContractWrapper<TContract>) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * Estimates the cost of gas in native token of the current chain
   * Pass in the same parameters as the contract's function.
   * @remarks Estimate the cost of gas in native token of the current chain
   * @example
   * ```javascript
   * const costOfClaim = await nftDrop?.estimator.gasCostOf("claim", [
   *   "0x...", // receiver
   *   1, // quantity
   *   "0x...", // currency
   *   1, // price per token
   *   [], // proofs
   *   1, // proof max quantity per transaction
   * ]);
   * ```
   * @returns the estimated price in native currency (ETH, MATIC, etc) of calling this function
   * @public
   */
  public async gasCostOf(
    // eslint-disable-next-line @typescript-eslint/ban-types
    fn: keyof TContract["functions"] | (string & {}),
    args: Parameters<TContract["functions"][typeof fn]> | any[],
  ): Promise<string> {
    const [price, gasUnits] = await Promise.all([
      this.contractWrapper.getProvider().getGasPrice(),
      this.contractWrapper.estimateGas(fn, args),
    ]);
    return utils.formatEther(gasUnits.mul(price));
  }

  /**
   * Estimates the gas limit of a transaction
   * Pass in the same parameters as the contract's function.
   * @remarks Estimates the gas limit of a transaction
   * @example
   * ```javascript
   * const gasLimitOfClaim = await nftDrop?.estimator.gasLimitOf("claim", [
   *   "0x...", // receiver
   *   1, // quantity
   *   "0x...", // currency
   *   1, // price per token
   *   [], // proofs
   *   1, // proof max quantity per transaction
   * ]);
   * ```
   * @returns the estimated gas limit of the transaction
   * @public
   */
  public async gasLimitOf(
    // eslint-disable-next-line @typescript-eslint/ban-types
    fn: keyof TContract["functions"] | (string & {}),
    args: Parameters<TContract["functions"][typeof fn]> | any[],
  ): Promise<BigNumber> {
    return this.contractWrapper.estimateGas(fn, args);
  }

  /**
   * Returns the current gas price in gwei
   * @remarks Get the current gas price in gwei
   * @example
   * ```javascript
   * const gasCostInGwei = await contract.estimator.currentGasPriceInGwei();
   * ```
   * @returns the current gas price in gwei
   * @public
   */
  public async currentGasPriceInGwei(): Promise<string> {
    const price = await this.contractWrapper.getProvider().getGasPrice();
    return utils.formatUnits(price, "gwei");
  }
}
