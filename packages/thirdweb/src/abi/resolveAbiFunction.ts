import type { AbiFunction } from "abitype";

export type MethodType = AbiFunction | string;

// helpers

export function isAbiFunction(item: unknown): item is AbiFunction {
  return !!(
    item &&
    typeof item === "object" &&
    "name" in item &&
    "type" in item
  );
}
