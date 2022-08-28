import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonPlatformFeeSchema,
  CommonRoyaltySchema,
  CommonSymbolSchema,
  CommonTrustedForwarderSchema,
} from "./common";

export const PackContractInput =
  CommonContractSchema.merge(CommonRoyaltySchema).merge(CommonSymbolSchema);

export const PackContractOutput =
  CommonContractOutputSchema.merge(CommonRoyaltySchema).merge(
    CommonSymbolSchema,
  );

export const PackContractDeploy = PackContractInput.merge(
  CommonPlatformFeeSchema,
).merge(CommonTrustedForwarderSchema);

export const PackContractSchema = {
  deploy: PackContractDeploy,
  output: PackContractOutput,
  input: PackContractInput,
};
