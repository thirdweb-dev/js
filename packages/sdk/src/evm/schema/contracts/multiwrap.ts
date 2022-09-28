import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonRoyaltySchema,
  CommonSymbolSchema,
  CommonTrustedForwarderSchema,
} from "./common";

export const MultiwrapContractInput =
  CommonContractSchema.merge(CommonRoyaltySchema).merge(CommonSymbolSchema);

export const MultiwrapContractOutput =
  CommonContractOutputSchema.merge(CommonRoyaltySchema).merge(
    CommonSymbolSchema,
  );

export const MultiwrapContractDeploy = MultiwrapContractInput.merge(
  CommonTrustedForwarderSchema,
);

export const MultiwrapContractSchema = {
  deploy: MultiwrapContractDeploy,
  output: MultiwrapContractOutput,
  input: MultiwrapContractInput,
};
