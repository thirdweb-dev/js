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

export const DropErc1155ContractInput = CommonContractSchema.merge(
  CommonRoyaltySchema,
)
  .merge(MerkleSchema)
  .merge(CommonSymbolSchema);

export const DropErc1155ContractOutput = CommonContractOutputSchema.merge(
  CommonRoyaltySchema,
)
  .merge(MerkleSchema)
  .merge(CommonSymbolSchema);

export const DropErc1155ContractDeploy = DropErc1155ContractInput.merge(
  CommonPlatformFeeSchema,
)
  .merge(CommonPrimarySaleSchema)
  .merge(CommonTrustedForwarderSchema);

export const DropErc1155ContractSchema = {
  deploy: DropErc1155ContractDeploy,
  output: DropErc1155ContractOutput,
  input: DropErc1155ContractInput,
};
