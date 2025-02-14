import type { AbiConstructor, AbiFunction } from "abitype";
import { parseAbiParams } from "../contract/parse-abi-params.js";

export function normalizeFunctionParams(
  abiFunction: AbiFunction | AbiConstructor | undefined,
  params: Record<string, unknown> = {},
): unknown[] {
  if (!abiFunction) {
    return [];
  }

  return parseAbiParams(
    abiFunction.inputs.map((i) => i.type),
    abiFunction.inputs.map((input, index) => {
      const value = input.name;
      if (value === undefined || value.length === 0) {
        // TODO: Handle multiple unnamed params
        if (!params["*"]) {
          throw new Error(
            `Missing named parameter for ${"name" in abiFunction ? abiFunction.name : "constructor"} at index ${index}`,
          );
        }

        return params["*"];
      }
      const valueWithoutUnderscore = value.replace(/^_+/, "");
      const normalizedValue =
        valueWithoutUnderscore in params
          ? params[valueWithoutUnderscore]
          : params[value]; // handle _name, _symbol, etc passed without underscore in the keys
      if (normalizedValue === undefined) {
        throw new Error(
          `Missing value for parameter ${value} at index ${index}`,
        );
      }
      return normalizedValue;
    }),
  );
}
