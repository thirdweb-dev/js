import type {
  ParseAbiItem,
  AbiFunction,
  AbiParametersToPrimitiveTypes,
} from "abitype";
import type { MethodType } from "./resolveAbiFunction.js";

export type ParseMethod<method extends MethodType> =
  // if the method IS an AbiFunction, return it
  method extends AbiFunction
    ? method
    : // if the method IS NOT an AbiFunction, attempt to parse it
      method extends string
      ? ParseAbiItem<method> extends AbiFunction
        ? ParseAbiItem<method>
        : never
      : never;

export type GetMethodInputs<method extends MethodType> = Readonly<
  ParseMethod<method> extends never
    ? unknown[]
    : AbiParametersToPrimitiveTypes<ParseMethod<method>["inputs"]>
>;

export type GetMethodOutputs<method extends MethodType> = Readonly<
  ParseMethod<method> extends never
    ? unknown[]
    : AbiParametersToPrimitiveTypes<ParseMethod<method>["outputs"]>
>;

// // testing
// type Parsed1 =
//   ParseMethod<"function balanceOf(address owner) view returns (uint256)">;

// type Parsed2 = ParseMethod<{
//   name: "balanceOf";
//   inputs: [
//     {
//       name: "owner";
//       type: "address";
//     },
//   ];
//   outputs: [
//     {
//       name: "balance";
//       type: "uint256";
//     },
//   ];
//   stateMutability: "view";
//   type: "function";
// }>;

// type Unparseable = ParseMethod<"balanceOf">;

// // inputs
// type Inputs1 = GetMethodInputs<Parsed1>;
// type Inputs2 = GetMethodInputs<Parsed2>;
// type Inputs3 = GetMethodInputs<Unparseable>;

// // outputs
// type Outputs1 = GetMethodOutputs<Parsed1>;
// type Outputs2 = GetMethodOutputs<Parsed2>;
// type Outputs3 = GetMethodOutputs<Unparseable>;
