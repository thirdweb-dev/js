import { DropERC20_V2, DropERC721_V3 } from "@thirdweb-dev/contracts-js";
import { ContractWrapper } from "../classes/contract-wrapper";
import { detectContractFeature } from "../../common/feature-detection/detectContractFeature";

export function isLegacyMultiPhaseDrop(
  contractWrapper: ContractWrapper<any>,
): contractWrapper is ContractWrapper<DropERC721_V3 | DropERC20_V2> {
  return (
    detectContractFeature<DropERC721_V3 | DropERC20_V2>(
      contractWrapper,
      "ERC721ClaimPhasesV1",
    ) ||
    detectContractFeature<DropERC721_V3 | DropERC20_V2>(
      contractWrapper,
      "ERC20ClaimPhasesV1",
    )
  );
}
