import { AbstractClaimConditionContractStruct } from "../../schema/contracts/common/claim-conditions";
import { IDropClaimCondition_V2 } from "@thirdweb-dev/contracts-js/dist/declarations/src/IDropERC20_V2";

export function legacyContractModelToAbstract(
  model: IDropClaimCondition_V2.ClaimConditionStruct,
): AbstractClaimConditionContractStruct {
  return {
    startTimestamp: model.startTimestamp,
    maxClaimableSupply: model.maxClaimableSupply,
    supplyClaimed: model.supplyClaimed,
    merkleRoot: model.merkleRoot.toString(),
    pricePerToken: model.pricePerToken,
    currency: model.currency,
    maxClaimablePerWallet: model.quantityLimitPerTransaction,
    waitTimeInSecondsBetweenClaims: model.waitTimeInSecondsBetweenClaims,
  };
}
