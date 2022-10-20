import { ContractWrapper } from "../core/classes/contract-wrapper";
import { hasFunction } from "./feature-detection";
import type {
  DropSinglePhase,
  Drop,
  DropSinglePhase_V1,
  DropERC721_V3,
  DropERC20_V2,
} from "@thirdweb-dev/contracts-js";

// TODO (cc)
export function isSinglePhase(
  contractWrapper: ContractWrapper<any>,
): contractWrapper is ContractWrapper<DropSinglePhase> {
  return (
    !hasFunction<DropSinglePhase>("getClaimConditionById", contractWrapper) &&
    hasFunction<DropSinglePhase>("getSupplyClaimedByWallet", contractWrapper)
  );
}

// TODO (cc)
export function isMultiphase(
  contractWrapper: ContractWrapper<any>,
): contractWrapper is ContractWrapper<Drop> {
  return (
    hasFunction<Drop>("getClaimConditionById", contractWrapper) &&
    hasFunction<Drop>("getClaimTimestamp", contractWrapper)
  );
}

export function isLegacySinglePhaseDrop(
  contractWrapper: ContractWrapper<any>,
): contractWrapper is ContractWrapper<DropSinglePhase_V1> {
  return (
    !hasFunction<DropSinglePhase_V1>(
      "getClaimConditionById",
      contractWrapper,
    ) && hasFunction<DropSinglePhase_V1>("getClaimTimestamp", contractWrapper)
  );
}

export function isLegacyMultiPhaseDrop(
  contractWrapper: ContractWrapper<any>,
): contractWrapper is ContractWrapper<DropERC721_V3 | DropERC20_V2> {
  return (
    hasFunction<DropERC721_V3>("getClaimConditionById", contractWrapper) &&
    hasFunction<DropERC721_V3>("setWalletClaimCount", contractWrapper)
  );
}
