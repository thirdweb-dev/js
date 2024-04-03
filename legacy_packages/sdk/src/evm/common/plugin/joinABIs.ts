import { Abi, AbiSchema } from "../../schema/contracts/custom";
import { unique } from "../utils";

/**
 * @internal
 */
export function joinABIs(abis: Abi[], abiWithConstructor?: Abi): Abi {
  const parsedABIs = abis.map((abi) => AbiSchema.parse(abi)).flat();
  const filteredABIs = parsedABIs.filter((item) => item.type !== "constructor");

  if (abiWithConstructor) {
    filteredABIs.push(...AbiSchema.parse(abiWithConstructor));
  }

  const finalABIs = unique(filteredABIs, (a, b): boolean => {
    return (
      a.name === b.name &&
      a.type === b.type &&
      a.inputs.length === b.inputs.length
    );
  });

  return AbiSchema.parse(finalABIs);
}
