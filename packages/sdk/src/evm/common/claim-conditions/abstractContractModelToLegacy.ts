import { AbstractClaimConditionContractStruct } from "../../schema/contracts/common/claim-conditions";
import { IDropClaimCondition_V2 } from "@thirdweb-dev/contracts-js/dist/declarations/src/IDropERC20_V2";

export function abstractContractModelToLegacy(
  model: AbstractClaimConditionContractStruct,
): IDropClaimCondition_V2.ClaimConditionStruct {
  return {
    startTimestamp: model.startTimestamp,
    maxClaimableSupply: model.maxClaimableSupply,
    supplyClaimed: model.supplyClaimed,
    merkleRoot: model.merkleRoot,
    pricePerToken: model.pricePerToken,
    currency: model.currency,
    quantityLimitPerTransaction: model.maxClaimablePerWallet,
    waitTimeInSecondsBetweenClaims: model.waitTimeInSecondsBetweenClaims || 0,
  };
}
