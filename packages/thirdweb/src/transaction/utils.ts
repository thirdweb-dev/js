import type { AbiFunction } from "abitype";

/**
 * @internal
 */
export function isAbiFunction(item: unknown): item is AbiFunction {
  return !!(
    item &&
    typeof item === "object" &&
    "type" in item &&
    item.type === "function"
  );
}
