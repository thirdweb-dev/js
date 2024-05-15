import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonPlatformFeeSchema,
  CommonRoyaltySchema,
  CommonSymbolSchema,
  CommonTrustedForwarderSchema,
} from "./common";

export const PackContractInput = /* @__PURE__ */ (() =>
  CommonContractSchema.merge(CommonRoyaltySchema).merge(CommonSymbolSchema))();

export const PackContractOutput = /* @__PURE__ */ (() =>
  CommonContractOutputSchema.merge(CommonRoyaltySchema).merge(
    CommonSymbolSchema,
  ))();

export const PackContractDeploy = /* @__PURE__ */ (() =>
  PackContractInput.merge(CommonPlatformFeeSchema).merge(
    CommonTrustedForwarderSchema,
  ))();

export const PackContractSchema = {
  deploy: PackContractDeploy,
  output: PackContractOutput,
  input: PackContractInput,
};
