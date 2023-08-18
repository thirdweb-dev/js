import { DropSinglePhase } from "@thirdweb-dev/contracts-js";
import { detectContractFeature } from "../../common/feature-detection/detectContractFeature";
import { ContractWrapper } from "../classes/contract-wrapper";

export function isNewSinglePhaseDrop(
  contractWrapper: ContractWrapper<any>,
): contractWrapper is ContractWrapper<DropSinglePhase> {
  return (
    detectContractFeature<DropSinglePhase>(
      contractWrapper,
      "ERC721ClaimConditionsV2",
    ) ||
    detectContractFeature<DropSinglePhase>(
      contractWrapper,
      "ERC20ClaimConditionsV2",
    )
  );
}
