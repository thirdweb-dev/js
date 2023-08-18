import { DropSinglePhase_V1 } from "@thirdweb-dev/contracts-js";
import { ContractWrapper } from "../classes/contract-wrapper";
import { detectContractFeature } from "../../common/feature-detection/detectContractFeature";

export function isLegacySinglePhaseDrop(
  contractWrapper: ContractWrapper<any>,
): contractWrapper is ContractWrapper<DropSinglePhase_V1> {
  return (
    detectContractFeature<DropSinglePhase_V1>(
      contractWrapper,
      "ERC721ClaimConditionsV1",
    ) ||
    detectContractFeature<DropSinglePhase_V1>(
      contractWrapper,
      "ERC20ClaimConditionsV1",
    )
  );
}
