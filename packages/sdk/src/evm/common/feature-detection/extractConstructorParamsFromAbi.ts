import { AbiInput, AbiSchema } from "../../schema/contracts/custom";

/**
 *
 * @param abi - The abi to extract constructor params from
 * @returns
 * @internal
 */
export function extractConstructorParamsFromAbi(abi: AbiInput) {
  const parsedAbi = AbiSchema.parse(abi || []);
  for (const input of parsedAbi) {
    if (input.type === "constructor") {
      return input.inputs || [];
    }
  }
  return [];
}
