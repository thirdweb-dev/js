import type * as ox__AbiParameters from "ox/AbiParameters";
import * as ox__Bytes from "ox/Bytes";
import * as ox__TypedData from "ox/TypedData";
import { encodeAbiParameters } from "../abi/encodeAbiParameters.js";
import { type Hex, toHex } from "../encoding/hex.js";
import { keccak256 } from "./keccak256.js";

type MessageTypeProperty = {
  name: string;
  type: string;
};

export type HashTypedDataParams<
  typedData extends
    | ox__TypedData.TypedData
    | Record<string, unknown> = ox__TypedData.TypedData,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
> = ox__TypedData.Definition<typedData, primaryType>;

/**
 * @internal
 */
export function hashTypedData<
  const typedData extends ox__TypedData.TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | "EIP712Domain",
>(parameters: HashTypedDataParams<typedData, primaryType>): Hex {
  const {
    domain = {},
    message,
    primaryType,
  } = parameters as HashTypedDataParams;
  const types = {
    EIP712Domain: ox__TypedData.extractEip712DomainTypes(domain),
    ...parameters.types,
  };

  // Need to do a runtime validation check on addresses, byte ranges, integer ranges, etc
  // as we can't statically check this with TypeScript.
  ox__TypedData.validate({
    domain,
    message,
    primaryType,
    types,
  });

  const parts: Hex[] = ["0x1901"];
  if (domain)
    parts.push(
      ox__TypedData.hashDomain({
        domain,
        types: types as Record<string, MessageTypeProperty[]>,
      }),
    );

  if (primaryType !== "EIP712Domain") {
    const hashedStruct = (() => {
      const encoded = encodeData({
        data: message,
        primaryType,
        types: types as Record<string, MessageTypeProperty[]>,
      });
      return keccak256(encoded);
    })();

    parts.push(hashedStruct);
  }

  return keccak256(ox__Bytes.concat(...parts.map((p) => ox__Bytes.fromHex(p))));
}

function encodeData({
  data,
  primaryType,
  types,
}: {
  data: Record<string, unknown>;
  primaryType: string;
  types: Record<string, MessageTypeProperty[]>;
}) {
  const encodedTypes: ox__AbiParameters.Parameter[] = [{ type: "bytes32" }];
  const encodedValues: unknown[] = [hashType({ primaryType, types })];

  if (!types[primaryType]) throw new Error("Invalid types");
  for (const field of types[primaryType]) {
    const [type, value] = encodeField({
      name: field.name,
      type: field.type,
      types,
      value: data[field.name],
    });
    encodedTypes.push(type);
    encodedValues.push(value);
  }

  return encodeAbiParameters(encodedTypes, encodedValues);
}

function hashType({
  primaryType,
  types,
}: {
  primaryType: string;
  types: Record<string, MessageTypeProperty[]>;
}) {
  const encodedHashType = toHex(encodeType({ primaryType, types }));
  return keccak256(encodedHashType);
}

function encodeType({
  primaryType,
  types,
}: {
  primaryType: string;
  types: Record<string, MessageTypeProperty[]>;
}) {
  let result = "";
  const unsortedDeps = findTypeDependencies({ primaryType, types });
  unsortedDeps.delete(primaryType);

  const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
  for (const type of deps) {
    if (!types[type]) throw new Error("Invalid types");
    result += `${type}(${types[type]
      .map(({ name, type: t }) => `${t} ${name}`)
      .join(",")})`;
  }

  return result;
}

function findTypeDependencies(
  {
    primaryType: primaryType_,
    types,
  }: {
    primaryType: string;
    types: Record<string, MessageTypeProperty[]>;
  },
  results: Set<string> = new Set(),
): Set<string> {
  const match = primaryType_.match(/^\w*/u);
  const primaryType = match?.[0] as string;
  if (results.has(primaryType) || types[primaryType] === undefined) {
    return results;
  }

  results.add(primaryType);

  for (const field of types[primaryType]) {
    findTypeDependencies({ primaryType: field.type, types }, results);
  }
  return results;
}

function encodeField({
  types,
  name,
  type,
  value,
}: {
  types: Record<string, MessageTypeProperty[]>;
  name: string;
  type: string;
  // biome-ignore lint/suspicious/noExplicitAny: Can't anticipate types of nested values
  value: any;
  // biome-ignore lint/suspicious/noExplicitAny: Can't anticipate types of nested values
}): [type: ox__AbiParameters.Parameter, value: any] {
  if (types[type] !== undefined) {
    return [
      { type: "bytes32" },
      keccak256(encodeData({ data: value, primaryType: type, types })),
    ];
  }

  if (type === "bytes") {
    const prepend = value.length % 2 ? "0" : "";
    value = `0x${prepend + value.slice(2)}`;
    return [{ type: "bytes32" }, keccak256(value)];
  }

  if (type === "string") return [{ type: "bytes32" }, keccak256(toHex(value))];

  if (type.lastIndexOf("]") === type.length - 1) {
    const parsedType = type.slice(0, type.lastIndexOf("["));
    const typeValuePairs =
      // biome-ignore lint/suspicious/noExplicitAny: Can't anticipate types of nested values
      (value as [ox__AbiParameters.Parameter, any][]).map((item) =>
        encodeField({
          name,
          type: parsedType,
          types,
          value: item,
        }),
      );
    return [
      { type: "bytes32" },
      keccak256(
        encodeAbiParameters(
          typeValuePairs.map(([t]) => t),
          typeValuePairs.map(([, v]) => v),
        ),
      ),
    ];
  }

  return [{ type }, value];
}
