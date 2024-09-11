import type { AbiConstructor, AbiFunction } from "abitype";

export function normalizeFunctionParams(
  abiFunction: AbiFunction | AbiConstructor | undefined,
  params: Record<string, unknown> = {},
): unknown[] {
  if (!abiFunction) {
    return [];
  }
  if (abiFunction.inputs?.length !== Object.keys(params).length) {
    throw new Error(
      `Expected ${abiFunction.inputs?.length || 0} parameters, but got ${Object.keys(params).length}`,
    );
  }
  return abiFunction.inputs.map((input, index) => {
    const value = input.name;
    if (value === undefined) {
      throw new Error(
        `Missing named parameter for ${"name" in abiFunction ? abiFunction.name : "constructor"} at index ${index}`,
      );
    }
    const valueWithoutUnderscore = value.replace(/^_+/, "");
    const normalizedValue = params[value] ?? params[valueWithoutUnderscore]; // handle _name, _symbol, etc passed without underscore in the keys
    if (normalizedValue === undefined) {
      throw new Error(`Missing value for parameter ${value} at index ${index}`);
    }
    return normalizedValue;
  });
}
