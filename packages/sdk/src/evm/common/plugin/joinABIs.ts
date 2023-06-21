import { Abi, AbiSchema } from "../../schema/contracts/custom";
import { unique } from "../utils";

/**
 * @internal
 */
export function joinABIs(abis: Abi[]): Abi {
  const parsedABIs = abis.map((abi) => AbiSchema.parse(abi)).flat();

  const filteredABIs = unique(parsedABIs, (a, b): boolean => {
    return (
      a.name === b.name &&
      a.type === b.type &&
      a.inputs.length === b.inputs.length
    );
  });

  const finalABIs = filteredABIs.filter((item) => item.type !== "constructor");

  return AbiSchema.parse(finalABIs);
}
