import { AbiFunction, AbiInput } from "../../schema/contracts/custom";
import { toJSType } from "./toJSType";
import { extractCommentFromMetadata } from "./extractCommentFromMetadata";

/**
 * @internal
 * @param abi - The abi to extract functions from
 * @param metadata - The metadata to extract comments from
 */
export function extractFunctionsFromAbi(
  abi: AbiInput,
  metadata?: Record<string, any>,
): AbiFunction[] {
  const functions = (abi || []).filter((el) => el.type === "function");

  const parsed: AbiFunction[] = [];
  for (const f of functions) {
    const doc = extractCommentFromMetadata(f.name, metadata, "methods");
    const args =
      f.inputs?.map((i) => `${i.name || "key"}: ${toJSType(i)}`)?.join(", ") ||
      "";
    const fargs = args ? `, [${args}]` : "";
    const out = f.outputs?.map((o) => toJSType(o, true))?.join(", ");
    const promise = out ? `: Promise<${out}>` : `: Promise<TransactionResult>`;
    const signature = `contract.call("${f.name}"${fargs})${promise}`;
    parsed.push({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore we know AbiTypeBaseSchema.name is not going to be undefined since we're doing `.default("")`
      inputs: f.inputs || [],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore we know the AbiTypeBaseSchema.name is not going to be undefined since we're doing `.default("")`
      outputs: f.outputs || [],
      name: f.name || "unknown",
      signature,
      stateMutability: f.stateMutability || "",
      comment: doc,
    });
  }
  return parsed;
}
