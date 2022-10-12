import { ValidContractInstance } from "@thirdweb-dev/sdk/evm";

// We're using it everywhere.
export type PotentialContractInstance =
  | ValidContractInstance
  | null
  | undefined;
