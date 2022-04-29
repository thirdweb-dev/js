import { ContractId } from "./types";
import { KNOWN_CONTRACTS_MAP } from "@thirdweb-dev/sdk";

export function isContractIdBuiltInContract(
  contractId: ContractId,
): contractId is keyof typeof KNOWN_CONTRACTS_MAP {
  return contractId in KNOWN_CONTRACTS_MAP;
}
