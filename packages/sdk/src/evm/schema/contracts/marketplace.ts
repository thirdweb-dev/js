import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonPlatformFeeSchema,
  CommonTrustedForwarderSchema,
} from "./common";

export const MarketplaceContractInput = CommonContractSchema;

export const MarketplaceContractOutput = CommonContractOutputSchema;

export const MarketplaceContractDeploy = /* @__PURE__ */ (() =>
  MarketplaceContractInput.merge(CommonPlatformFeeSchema).merge(
    CommonTrustedForwarderSchema,
  ))();

export const MarketplaceContractSchema = {
  deploy: MarketplaceContractDeploy,
  output: MarketplaceContractOutput,
  input: MarketplaceContractInput,
};
