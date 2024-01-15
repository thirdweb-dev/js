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
