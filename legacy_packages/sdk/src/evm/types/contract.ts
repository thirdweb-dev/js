import { ContractAddress, GENERATED_ABI } from "@thirdweb-dev/generated-abis";
import {
  ExtractAbiFunctionNames,
  Abi,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
} from "abitype";
import type { BaseContract, BigNumberish } from "ethers";

declare module "abitype" {
  export interface Config {
    AddressType: string;
    BytesType: {
      inputs: string;
      outputs: string;
    };
    BigIntType: BigNumberish;
    IntType: BigNumberish;
  }
}

export type ExtractAbiForContract<TAddress extends ContractAddress> =
  (typeof GENERATED_ABI)[TAddress];

export type TAbiFunctionNames<TAbi extends Abi> = ExtractAbiFunctionNames<TAbi>;

export type ExtractFunction<
  TAbi extends Abi,
  TFunctionName extends TAbiFunctionNames<TAbi>,
> = ExtractAbiFunction<TAbi, TFunctionName>;

export type ExtractFunctionInputs<
  TAbi extends Abi,
  TFunctionName extends TAbiFunctionNames<TAbi>,
> = ExtractFunction<TAbi, TFunctionName>["inputs"];

export type ExtractFunctionOutputs<
  TAbi extends Abi,
  TFunctionName extends TAbiFunctionNames<TAbi>,
> = ExtractFunction<TAbi, TFunctionName>["outputs"];

export type ExtractFunctionInputsType<
  TAbi extends Abi,
  TFunctionName extends TAbiFunctionNames<TAbi>,
> = AbiParametersToPrimitiveTypes<ExtractFunctionInputs<TAbi, TFunctionName>>;

export type ExtractArrayElement<TArray extends Array<any>> = TArray extends [
  infer TElement,
  ...infer TRest,
]
  ? TRest extends []
    ? TElement
    : TArray
  : never;

export type ExtractFunctionOutputsType<
  TAbi extends Abi,
  TFunctionName extends TAbiFunctionNames<TAbi>,
> = ExtractArrayElement<
  // @ts-expect-error - TODO: fix this
  AbiParametersToPrimitiveTypes<ExtractFunctionOutputs<TAbi, TFunctionName>>
>;

export type ExtractFunctionType<
  TAbi extends Abi,
  TFunctionName extends TAbiFunctionNames<TAbi>,
> = (
  ...args: ExtractFunctionInputsType<TAbi, TFunctionName>
) => ExtractFunctionOutputsType<TAbi, TFunctionName>;

export type ContractFunctionsFromAbi<TAbi extends Abi> = {
  [TFunctionName in TAbiFunctionNames<TAbi>]: ExtractFunctionType<
    TAbi,
    TFunctionName
  >;
};

export interface BaseContractInterface<
  TFunctions extends { [name: string]: any } = { [name: string]: any },
> extends BaseContract {
  readonly functions: TFunctions;
}

export type BaseContractForAddress<TAddress extends ContractAddress> =
  BaseContractInterface<
    ContractFunctionsFromAbi<ExtractAbiForContract<TAddress>>
  >;
