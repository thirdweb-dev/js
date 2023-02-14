import { useEVMContractInfo } from "@3rdweb-sdk/react";
import { RequiredParam } from "@thirdweb-dev/react";
import {
  ContractType,
  EditionDrop,
  NFTDrop,
  ValidContractInstance,
} from "@thirdweb-dev/sdk/evm";
import invariant from "tiny-invariant";

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
): contract is EditionDrop | NFTDrop {
  return (
    isPrebuiltContract(contract, contractType) &&
    (contractType === "edition-drop" || contractType === "nft-drop")
  );
}

export function useTabHref(
  tab:
    | "nfts"
    | ""
    | "explorer"
    | "events"
    | "claim-conditions"
    | "permissions"
    | "embed"
    | "code"
    | "settings"
    | "sources",
) {
  const contractInfo = useEVMContractInfo();
  invariant(contractInfo, "can not use useTabHref() without a contractInfo");
  return `/${contractInfo.chainSlug}/${contractInfo.contractAddress}/${tab}`;
}
