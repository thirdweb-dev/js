import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonSymbolSchema,
  CommonPlatformFeeSchema,
  CommonPrimarySaleSchema,
  CommonTrustedForwarderSchema,
} from "./common";

export const TokenErc20ContractInput = /* @__PURE__ */ (() =>
  CommonContractSchema.merge(CommonSymbolSchema))();

export const TokenErc20ContractOutput = /* @__PURE__ */ (() =>
  CommonContractOutputSchema.merge(CommonSymbolSchema))();

export const TokenErc20ContractDeploy = /* @__PURE__ */ (() =>
  TokenErc20ContractInput.merge(CommonPlatformFeeSchema)
    .merge(CommonPrimarySaleSchema)
    .merge(CommonTrustedForwarderSchema))();

export const TokenErc20ContractSchema = {
  deploy: TokenErc20ContractDeploy,
  output: TokenErc20ContractOutput,
  input: TokenErc20ContractInput,
};
