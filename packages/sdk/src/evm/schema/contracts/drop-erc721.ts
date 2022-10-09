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

export const DropErc721ContractInput = CommonContractSchema.merge(
  CommonRoyaltySchema,
)
  .merge(MerkleSchema)
  .merge(CommonSymbolSchema);

export const DropErc721ContractOutput = CommonContractOutputSchema.merge(
  CommonRoyaltySchema,
)
  .merge(MerkleSchema)
  .merge(CommonSymbolSchema);

export const DropErc721ContractDeploy = DropErc721ContractInput.merge(
  CommonPlatformFeeSchema,
)
  .merge(CommonPrimarySaleSchema)
  .merge(CommonTrustedForwarderSchema);

export const DropErc721ContractSchema = {
  deploy: DropErc721ContractDeploy,
  output: DropErc721ContractOutput,
  input: DropErc721ContractInput,
};
