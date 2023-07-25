import { AbstractClaimConditionContractStruct } from "../../schema/contracts/common/claim-conditions";
import { IClaimCondition } from "@thirdweb-dev/contracts-js/dist/declarations/src/Drop";

export function abstractContractModelToNew(
  model: AbstractClaimConditionContractStruct,
): IClaimCondition.ClaimConditionStruct {
  return {
    startTimestamp: model.startTimestamp,
    maxClaimableSupply: model.maxClaimableSupply,
    supplyClaimed: model.supplyClaimed,
    merkleRoot: model.merkleRoot,
    pricePerToken: model.pricePerToken,
    currency: model.currency,
    quantityLimitPerWallet: model.maxClaimablePerWallet,
    metadata: model.metadata || "",
  };
}
