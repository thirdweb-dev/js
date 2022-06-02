import {
  Multiwrap,
  SmartContract,
  Split,
  ValidContractInstance,
  Vote,
} from "@thirdweb-dev/sdk";

// We're using it everywhere.
export type PotentialContractInstance =
  | ValidContractInstance
  | SmartContract
  | null
  | undefined;

export type ContractWithRoles =
  | Exclude<ValidContractInstance, Vote | Split | Multiwrap>
  | SmartContract;
