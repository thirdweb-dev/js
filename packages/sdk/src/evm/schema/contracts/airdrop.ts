import {
  CommonContractSchema,
  CommonSymbolSchema,
  CommonTrustedForwarderSchema,
} from "./common";

const AirdropContractInput = /* @__PURE__ */ (() =>
  CommonContractSchema.merge(CommonSymbolSchema))();

export const AirdropContractDeploy = /* @__PURE__ */ (() =>
  AirdropContractInput.merge(CommonTrustedForwarderSchema))();
