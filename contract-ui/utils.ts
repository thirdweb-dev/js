import { RequiredParam } from "@thirdweb-dev/react";
import {
  ContractType,
  EditionDropImpl,
  NFTDropImpl,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";

export function isPrebuiltContract(
  contract: ValidContractInstance | null | undefined,
  contractType: RequiredParam<ContractType> | null,
): contract is ValidContractInstance {
  if (!contract || !contractType) {
    return false;
  }
  if (contractType === "custom") {
    return false;
  }
  return true;
}

export function isPaperSupportedContract(
  contract: ValidContractInstance | null | undefined,
  contractType: RequiredParam<ContractType> | null,
): contract is EditionDropImpl | NFTDropImpl {
  return (
    isPrebuiltContract(contract, contractType) &&
    (contractType === "edition-drop" || contractType === "nft-drop")
  );
}
