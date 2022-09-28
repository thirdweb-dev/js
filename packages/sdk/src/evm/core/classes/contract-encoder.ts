import { ContractWrapper } from "./contract-wrapper";
import { BaseContract, utils } from "ethers";

/**
 * Encodes and decodes Contract functions
 * @public
 */
export class ContractEncoder<TContract extends BaseContract> {
  private contractWrapper;

  constructor(contractWrapper: ContractWrapper<TContract>) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * Encodes the given contract function with argument
   * @returns the encoded data
   */
  public encode(
    fn: keyof TContract["functions"],
    args: Parameters<TContract["functions"][typeof fn]>,
  ): string {
    return this.contractWrapper.readContract.interface.encodeFunctionData(
      fn as string,
      args,
    );
  }

  /**
   * Decode encoded call data for a given function
   * @param fn - the function to decode
   * @param encodedArgs - the encoded arguments
   */
  public decode(
    fn: keyof TContract["functions"],
    encodedArgs: string,
  ): utils.Result {
    return this.contractWrapper.readContract.interface.decodeFunctionData(
      fn as string,
      encodedArgs,
    );
  }
}
