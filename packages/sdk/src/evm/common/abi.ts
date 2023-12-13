import { GENERATED_ABI } from "@thirdweb-dev/generated-abis";
import { ContractInterface } from "ethers/lib/ethers";

/**
 * @internal
 */
export function getCachedAbiForContract(
  address: string,
): ContractInterface | undefined {
  if (address in GENERATED_ABI) {
    return (GENERATED_ABI as any)[address];
  }

  return undefined;
}
