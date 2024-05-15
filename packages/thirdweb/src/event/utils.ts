import type { AbiEvent } from "abitype";

/**
 * @internal
 */
export function isAbiEvent(item: unknown): item is AbiEvent {
  return !!(
    item &&
    typeof item === "object" &&
    "type" in item &&
    item.type === "event"
  );
}
