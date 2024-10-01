import type { Abi } from "abitype";

export function getContractFunctionsFromAbi(abi: Abi) {
  return abi
    .filter((a) => a.type === "function")
    .map((f) => ({
      ...f,
      // fake "field" for the "signature"
      signature: `${f.name}(${f.inputs.map((i) => i.type).join(",")})`,
    }));
}
