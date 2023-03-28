import { ContractAddress, GENERATED_ABI } from "@thirdweb-dev/generated-abis";
import { ExtractAbiFunctionNames, ExtractAbiFunctions, Abi } from "abitype";
import type { BaseContract, ContractFunction } from "ethers";

type ExtractAbiForContract<TAddress extends ContractAddress> =
  (typeof GENERATED_ABI)[TAddress];

type ContractFunctionsFromAbi<TAbi extends Abi> = Record<
  ExtractAbiFunctionNames<TAbi>,
  ExtractAbiFunctions<TAbi>
>;

export interface BaseContractInterface<
  TFunctions extends { [name: string]: ContractFunction } = {
    [name: string]: ContractFunction;
  },
> extends BaseContract {
  readonly functions: TFunctions;
}

export type BaseContractForAddress<TAddress extends ContractAddress> =
  BaseContractInterface<
    ContractFunctionsFromAbi<ExtractAbiForContract<TAddress>>
  >;
