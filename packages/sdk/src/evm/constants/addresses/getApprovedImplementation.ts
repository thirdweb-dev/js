import type { PrebuiltContractType } from "../../contracts";
import { APPROVED_IMPLEMENTATIONS } from "./APPROVED_IMPLEMENTATIONS";
import { SUPPORTED_CHAIN_ID } from "../chains/SUPPORTED_CHAIN_ID";

/**
 * @internal
 * @param chainId - The chainId to get the approved implementation for
 * @param contractType - The contract type to get the approved implementation for
 */
export function getApprovedImplementation(
  chainId: SUPPORTED_CHAIN_ID, // TODO use SupportedChainId once we deploy to all chains
  contractType: PrebuiltContractType,
): string | null {
  if (chainId in APPROVED_IMPLEMENTATIONS) {
    const approvedImpls = APPROVED_IMPLEMENTATIONS[chainId];
    if (contractType in approvedImpls) {
      return approvedImpls[contractType as keyof typeof approvedImpls];
    }
  }
  return null;
}
