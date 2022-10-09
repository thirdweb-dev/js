import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonPlatformFeeSchema,
  CommonPrimarySaleSchema,
  CommonRoyaltySchema,
  CommonSymbolSchema,
  CommonTrustedForwarderSchema,
} from "./common";

export const TokenErc721ContractInput =
  CommonContractSchema.merge(CommonRoyaltySchema).merge(CommonSymbolSchema);

export const TokenErc721ContractOutput =
  CommonContractOutputSchema.merge(CommonRoyaltySchema).merge(
    CommonSymbolSchema,
  );

export const TokenErc721ContractDeploy = TokenErc721ContractInput.merge(
  CommonPlatformFeeSchema,
)
  .merge(CommonPrimarySaleSchema)
  .merge(CommonTrustedForwarderSchema);

export const TokenErc721ContractSchema = {
  deploy: TokenErc721ContractDeploy,
  output: TokenErc721ContractOutput,
  input: TokenErc721ContractInput,
};
