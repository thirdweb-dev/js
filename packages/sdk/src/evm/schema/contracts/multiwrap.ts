import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonRoyaltySchema,
  CommonSymbolSchema,
  CommonTrustedForwarderSchema,
} from "./common";

const MultiwrapContractInput = /* @__PURE__ */ (() =>
  CommonContractSchema.merge(CommonRoyaltySchema).merge(CommonSymbolSchema))();

const MultiwrapContractOutput = /* @__PURE__ */ (() =>
  CommonContractOutputSchema.merge(CommonRoyaltySchema).merge(
    CommonSymbolSchema,
  ))();

const MultiwrapContractDeploy = /* @__PURE__ */ (() =>
  MultiwrapContractInput.merge(CommonTrustedForwarderSchema))();

export const MultiwrapContractSchema = {
  deploy: MultiwrapContractDeploy,
  output: MultiwrapContractOutput,
  input: MultiwrapContractInput,
};
