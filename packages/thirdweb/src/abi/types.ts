import type {
  ParseAbiItem,
  AbiFunction,
  Abi,
  ExtractAbiFunction,
} from "abitype";

export type ParseMethod<abi extends Abi, method extends AbiFunction | string> =
  // if the method IS an AbiFunction, return it
  method extends AbiFunction
    ? method
    : method extends string // we now know we are in "string" territory
      ? // if the string starts with `function` then we can parse it
        method extends `function ${string}`
        ? ParseAbiItem<method>
        : // do we have an ABI to check, check the length
          abi extends { length: 0 }
          ? // if not, we return AbiFunction
            AbiFunction
          : // if we do have a length, extract the abi function
            ExtractAbiFunction<abi, method>
      : // this means its neither have an AbiFunction NOR a string -> never
        never;
