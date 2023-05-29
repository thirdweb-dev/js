import { AbiInput } from "../../schema/contracts/custom";
import { extractFunctionsFromAbi } from "./extractFunctionsFromAbi";

/**
 * @internal
 * @param contractAbi
 * @param featureAbis
 * @returns
 */
export function hasMatchingAbi(
  contractAbi: AbiInput,
  featureAbis: readonly AbiInput[],
) {
  const contractFn = extractFunctionsFromAbi(contractAbi);
  const interfaceFn = featureAbis.flatMap((i: any) =>
    extractFunctionsFromAbi(i),
  );
  // match every function and their arguments
  const intersection = contractFn.filter((fn) => {
    const match = interfaceFn.find(
      (iFn) =>
        iFn.name === fn.name &&
        iFn.inputs.length === fn.inputs.length &&
        iFn.inputs.every((i, index) => {
          if (i.type === "tuple" || i.type === "tuple[]") {
            // check that all properties in the tuple are the same type
            return (
              i.type === fn.inputs[index].type &&
              i.components?.every((c, cIndex) => {
                return c.type === fn.inputs[index].components?.[cIndex]?.type;
              })
            );
          }
          return i.type === fn.inputs[index].type;
        }),
    );
    return match !== undefined;
  });
  return intersection.length === interfaceFn.length;
}
