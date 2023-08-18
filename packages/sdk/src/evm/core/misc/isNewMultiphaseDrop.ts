import { Drop } from "@thirdweb-dev/contracts-js";
import { detectContractFeature } from "../../common/feature-detection/detectContractFeature";
import { ContractWrapper } from "../classes/contract-wrapper";

export function isNewMultiphaseDrop(
  contractWrapper: ContractWrapper<any>,
): contractWrapper is ContractWrapper<Drop> {
  return (
    detectContractFeature<Drop>(contractWrapper, "ERC721ClaimPhasesV2") ||
    detectContractFeature<Drop>(contractWrapper, "ERC20ClaimPhasesV2")
  );
}
