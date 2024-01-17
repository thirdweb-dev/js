import type { ParseAbiItem, AbiFunction } from "abitype";

export type ParseMethod<method> =
  // if the method IS an AbiFunction, return it
  method extends AbiFunction
    ? method
    : // if the method IS NOT an AbiFunction, attempt to parse it
      method extends string
      ? ParseAbiItem<method> extends AbiFunction
        ? ParseAbiItem<method>
        : never
      : never;
