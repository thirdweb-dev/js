import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonPlatformFeeSchema,
  CommonPrimarySaleSchema,
  CommonRoyaltySchema,
  CommonSymbolSchema,
  CommonTrustedForwarderSchema,
} from "./common";
import { MerkleSchema } from "./common/snapshots";

export const DropErc721ContractInput = /* @__PURE__ */ (() =>
  CommonContractSchema.merge(CommonRoyaltySchema)
    .merge(MerkleSchema)
    .merge(CommonSymbolSchema))();

export const DropErc721ContractOutput = /* @__PURE__ */ (() =>
  CommonContractOutputSchema.merge(CommonRoyaltySchema)
    .merge(MerkleSchema)
    .merge(CommonSymbolSchema))();

export const DropErc721ContractDeploy = /* @__PURE__ */ (() =>
  DropErc721ContractInput.merge(CommonPlatformFeeSchema)
    .merge(CommonPrimarySaleSchema)
    .merge(CommonTrustedForwarderSchema))();

export const DropErc721ContractSchema = {
  deploy: DropErc721ContractDeploy,
  output: DropErc721ContractOutput,
  input: DropErc721ContractInput,
};
