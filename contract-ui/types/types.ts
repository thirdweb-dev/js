import { SmartContract, ValidContractInstance } from "@thirdweb-dev/sdk";

// We're using it everywhere.
export type PotentialContractInstance =
  | ValidContractInstance
  | SmartContract
  | null
  | undefined;
