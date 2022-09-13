import { ValidContractInstance } from "@thirdweb-dev/sdk";

// We're using it everywhere.
export type PotentialContractInstance =
  | ValidContractInstance
  | null
  | undefined;
