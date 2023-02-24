import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonPlatformFeeSchema,
  CommonTrustedForwarderSchema,
} from "./common";

export const MarketplaceV3ContractInput = CommonContractSchema;

export const MarketplaceV3ContractOutput = CommonContractOutputSchema;

export const MarketplaceV3ContractDeploy = MarketplaceV3ContractInput.merge(
  CommonPlatformFeeSchema,
).merge(CommonTrustedForwarderSchema);

export const MarketplaceV3ContractSchema = {
  deploy: MarketplaceV3ContractDeploy,
  output: MarketplaceV3ContractOutput,
  input: MarketplaceV3ContractInput,
};
