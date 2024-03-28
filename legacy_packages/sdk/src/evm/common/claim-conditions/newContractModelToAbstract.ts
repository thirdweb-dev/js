import { AbstractClaimConditionContractStruct } from "../../schema/contracts/common/claim-conditions";
import { IClaimCondition } from "@thirdweb-dev/contracts-js/dist/declarations/src/Drop";

export function newContractModelToAbstract(
  model: IClaimCondition.ClaimConditionStruct,
): AbstractClaimConditionContractStruct {
  return {
    startTimestamp: model.startTimestamp,
    maxClaimableSupply: model.maxClaimableSupply,
    supplyClaimed: model.supplyClaimed,
    merkleRoot: model.merkleRoot.toString(),
    pricePerToken: model.pricePerToken,
    currency: model.currency,
    maxClaimablePerWallet: model.quantityLimitPerWallet,
    waitTimeInSecondsBetweenClaims: 0,
    metadata: model.metadata,
  };
}
