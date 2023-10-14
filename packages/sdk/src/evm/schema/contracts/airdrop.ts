import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonSymbolSchema,
  CommonTrustedForwarderSchema,
} from "./common";

export const AirdropContractInput = /* @__PURE__ */ (() =>
  CommonContractSchema.merge(CommonSymbolSchema))();

export const AirdropContractOutput = /* @__PURE__ */ (() =>
  CommonContractOutputSchema.merge(CommonSymbolSchema))();

export const AirdropContractDeploy = /* @__PURE__ */ (() =>
  AirdropContractInput.merge(CommonTrustedForwarderSchema))();
