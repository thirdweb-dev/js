import type {
  AbiParameter,
  AbiParameterToPrimitiveType,
  AbiParametersToPrimitiveTypes,
} from "abitype";
import {
  numberToHex,
  type Hex,
  padHex,
  stringToHex,
  boolToHex,
} from "../encoding/hex.js";
import { byteSize } from "../encoding/helpers/byte-size.js";
import { concat, slice } from "viem/utils";
import { isAddress } from "../address.js";

/**
 * Encodes the given ABI parameters and values into a hexadecimal string.
 * @template TParams - The type of the ABI parameters.
 * @param params - The ABI parameters.
 * @param values - The corresponding values for the ABI parameters.
 * @returns - The encoded ABI parameters as a hexadecimal string.
 * @throws {Error} - If the number of parameters and values do not match.
 * @example
 * ```ts
 * import { encodeAbiParameters } from "viem";
 *
 * const params = [
 *  { name: "param1", type: "uint256" },
 *  { name: "param2", type: "string" },
 * ];
 * const values = [123, "hello"];
 *
 * const data = encodeAbiParameters(params, values);
 * console.log(data);
 * ```
 */
export function encodeAbiParameters<
  const TParams extends readonly AbiParameter[] | readonly unknown[],
>(
  params: TParams,
  values: TParams extends readonly AbiParameter[]
    ? AbiParametersToPrimitiveTypes<TParams>
    : never,
): Hex {
  if (params.length !== values.length) {
    throw new Error("The number of parameters and values must match.");
  }
  // Prepare the parameters to determine dynamic types to encode.
  const preparedParams = prepareParams({
    params: params as readonly AbiParameter[],
    values,
  });
  const data = encodeParams(preparedParams);
  if (data.length === 0) {
    return "0x";
  }
  return data;
}

//UTILS

type PreparedParam = { dynamic: boolean; encoded: Hex };
type TupleAbiParameter = AbiParameter & { components: readonly AbiParameter[] };
type Tuple = AbiParameterToPrimitiveType<TupleAbiParameter>;

function prepareParams<const TParams extends readonly AbiParameter[]>({
  params,
  values,
}: {
  params: TParams;
  values: AbiParametersToPrimitiveTypes<TParams>;
}) {
  const preparedParams: PreparedParam[] = [];
  for (let i = 0; i < params.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    preparedParams.push(prepareParam({ param: params[i]!, value: values[i] }));
  }
  return preparedParams;
}

function prepareParam<const TParam extends AbiParameter>({
  param,
  value,
}: {
  param: TParam;
  value: AbiParameterToPrimitiveType<TParam>;
}): PreparedParam {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return encodeArray(value, { length, param: { ...param, type } });
  }
  if (param.type === "tuple") {
    return encodeTuple(value as unknown as Tuple, {
      param: param as TupleAbiParameter,
    });
  }
  if (param.type === "address") {
    return encodeAddress(value as unknown as Hex);
  }
  if (param.type === "bool") {
    return encodeBool(value as unknown as boolean);
  }
  if (param.type.startsWith("uint") || param.type.startsWith("int")) {
    const signed = param.type.startsWith("int");
    return encodeNumber(value as unknown as number, { signed });
  }
  if (param.type.startsWith("bytes")) {
    return encodeBytes(value as unknown as Hex, { param });
  }
  if (param.type === "string") {
    return encodeString(value as unknown as string);
  }
  throw new Error(`Unsupported parameter type: ${param.type}`);
}

function encodeParams(preparedParams: PreparedParam[]): Hex {
  // 1. Compute the size of the static part of the parameters.
  let staticSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { dynamic, encoded } = preparedParams[i]!;
    if (dynamic) {
      staticSize += 32;
    } else {
      staticSize += byteSize(encoded);
    }
  }

  // 2. Split the parameters into static and dynamic parts.
  const staticParams: Hex[] = [];
  const dynamicParams: Hex[] = [];
  let dynamicSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { dynamic, encoded } = preparedParams[i]!;
    if (dynamic) {
      staticParams.push(numberToHex(staticSize + dynamicSize, { size: 32 }));
      dynamicParams.push(encoded);
      dynamicSize += byteSize(encoded);
    } else {
      staticParams.push(encoded);
    }
  }

  // 3. Concatenate static and dynamic parts.
  return concat([...staticParams, ...dynamicParams]);
}

/////////////////////////////////////////////////////////////////

function encodeAddress(value: Hex): PreparedParam {
  if (!isAddress(value)) {
    throw new Error("Invalid address.");
  }
  return { dynamic: false, encoded: padHex(value.toLowerCase() as Hex) };
}

function encodeArray<const TParam extends AbiParameter>(
  value: AbiParameterToPrimitiveType<TParam>,
  {
    length,
    param,
  }: {
    length: number | null;
    param: TParam;
  },
): PreparedParam {
  const dynamic = length === null;

  if (!Array.isArray(value)) {
    throw new Error("Invalid array value.");
  }
  if (!dynamic && value.length !== length) {
    throw new Error("Invalid array length.");
  }

  let dynamicChild = false;
  const preparedParams: PreparedParam[] = [];
  for (let i = 0; i < value.length; i++) {
    const preparedParam = prepareParam({ param, value: value[i] });
    if (preparedParam.dynamic) {
      dynamicChild = true;
    }
    preparedParams.push(preparedParam);
  }

  if (dynamic || dynamicChild) {
    const data = encodeParams(preparedParams);
    if (dynamic) {
      const length_ = numberToHex(preparedParams.length, { size: 32 });
      return {
        dynamic: true,
        encoded: preparedParams.length > 0 ? concat([length_, data]) : length_,
      };
    }
    if (dynamicChild) {
      return { dynamic: true, encoded: data };
    }
  }
  return {
    dynamic: false,
    encoded: concat(preparedParams.map(({ encoded }) => encoded)),
  };
}

function encodeBytes<const TParam extends AbiParameter>(
  value: Hex,
  { param }: { param: TParam },
): PreparedParam {
  const [, paramSize] = param.type.split("bytes");
  const bytesSize = byteSize(value);
  if (!paramSize) {
    let value_ = value;
    // If the size is not divisible by 32 bytes, pad the end
    // with empty bytes to the ceiling 32 bytes.
    if (bytesSize % 32 !== 0) {
      value_ = padHex(value_, {
        dir: "right",
        size: Math.ceil((value.length - 2) / 2 / 32) * 32,
      });
    }
    return {
      dynamic: true,
      encoded: concat([padHex(numberToHex(bytesSize, { size: 32 })), value_]),
    };
  }
  if (bytesSize !== parseInt(paramSize)) {
    throw new Error(`Invalid bytes${paramSize} size: ${bytesSize}`);
  }
  return { dynamic: false, encoded: padHex(value, { dir: "right" }) };
}

function encodeBool(value: boolean): PreparedParam {
  return { dynamic: false, encoded: padHex(boolToHex(value)) };
}

function encodeNumber(
  value: number,
  { signed }: { signed: boolean },
): PreparedParam {
  return {
    dynamic: false,
    encoded: numberToHex(value, {
      size: 32,
      signed,
    }),
  };
}

function encodeString(value: string): PreparedParam {
  const hexValue = stringToHex(value);
  const partsLength = Math.ceil(byteSize(hexValue) / 32);
  const parts: Hex[] = [];
  for (let i = 0; i < partsLength; i++) {
    parts.push(
      padHex(slice(hexValue, i * 32, (i + 1) * 32), {
        dir: "right",
      }),
    );
  }
  return {
    dynamic: true,
    encoded: concat([
      padHex(numberToHex(byteSize(hexValue), { size: 32 })),
      ...parts,
    ]),
  };
}

function encodeTuple<
  const TParam extends AbiParameter & { components: readonly AbiParameter[] },
>(
  value: AbiParameterToPrimitiveType<TParam>,
  { param }: { param: TParam },
): PreparedParam {
  let dynamic = false;
  const preparedParams: PreparedParam[] = [];
  for (let i = 0; i < param.components.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const param_ = param.components[i]!;
    const index = Array.isArray(value) ? i : param_.name;
    const preparedParam = prepareParam({
      param: param_,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value: (value as any)[index!] as readonly unknown[],
    });
    preparedParams.push(preparedParam);
    if (preparedParam.dynamic) {
      dynamic = true;
    }
  }
  return {
    dynamic,
    encoded: dynamic
      ? encodeParams(preparedParams)
      : concat(preparedParams.map(({ encoded }) => encoded)),
  };
}

function getArrayComponents(
  type: string,
): [length: number | null, innerType: string] | undefined {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches
    ? // Return `null` if the array is dynamic.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      [matches[2] ? Number(matches[2]) : null, matches[1]!]
    : undefined;
}
