import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonPlatformFeeSchema,
  CommonPrimarySaleSchema,
  CommonRoyaltySchema,
  CommonSymbolSchema,
  CommonTrustedForwarderSchema,
} from "./common";

export const LoyaltyCardContractInput = /* @__PURE__ */ (() =>
  CommonContractSchema.merge(CommonRoyaltySchema).merge(CommonSymbolSchema))();

export const LoyaltyCardContractOutput = /* @__PURE__ */ (() =>
  CommonContractOutputSchema.merge(CommonRoyaltySchema).merge(
    CommonSymbolSchema,
  ))();

export const LoyaltyCardContractDeploy = /* @__PURE__ */ (() =>
  LoyaltyCardContractInput.merge(CommonPlatformFeeSchema)
    .merge(CommonPrimarySaleSchema)
    .merge(CommonTrustedForwarderSchema))();
