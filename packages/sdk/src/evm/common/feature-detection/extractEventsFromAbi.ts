import { AbiEvent, AbiInput, AbiSchema } from "../../schema/contracts/custom";
import { extractCommentFromMetadata } from "./extractCommentFromMetadata";

/**
 * @internal
 * @param abi
 * @param metadata
 */
export function extractEventsFromAbi(
  abi: AbiInput,
  metadata?: Record<string, any>,
): AbiEvent[] {
  const parsedAbi = AbiSchema.parse(abi || []);
  const events = parsedAbi.filter((el) => el.type === "event");
  const parsed: AbiEvent[] = [];
  for (const e of events) {
    const doc = extractCommentFromMetadata(e.name, metadata, "events");
    parsed.push({
      inputs: e.inputs || [],
      outputs: e.outputs || [],
      name: e.name || "unknown",
      comment: doc,
    });
  }
  return parsed;
}
