import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonPlatformFeeSchema,
  CommonPrimarySaleSchema,
  CommonSymbolSchema,
  CommonTrustedForwarderSchema,
} from "./common";
import { MerkleSchema } from "./common/snapshots";

export const DropErc20ContractInput =
  CommonContractSchema.merge(MerkleSchema).merge(CommonSymbolSchema);

export const DropErc20ContractOutput =
  CommonContractOutputSchema.merge(MerkleSchema).merge(CommonSymbolSchema);

export const DropErc20ContractDeploy = DropErc20ContractInput.merge(
  CommonPlatformFeeSchema,
)
  .merge(CommonPrimarySaleSchema)
  .merge(CommonTrustedForwarderSchema);

export const DropErc20ContractSchema = {
  deploy: DropErc20ContractDeploy,
  output: DropErc20ContractOutput,
  input: DropErc20ContractInput,
};
