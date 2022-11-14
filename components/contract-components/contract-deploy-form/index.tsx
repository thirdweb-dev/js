import { useContractPublishMetadataFromURI } from "../hooks";
import { ContractId } from "../types";
import { isContractIdBuiltInContract } from "../utils";
import { useChainId } from "@thirdweb-dev/react";
import { SUPPORTED_CHAIN_ID, SUPPORTED_CHAIN_IDS } from "@thirdweb-dev/sdk/evm";
import {
  OSRoyaltyDisabledChains,
  OSRoyaltyToPrebuilt,
} from "constants/mappings";
import { CustomSDKContext } from "contexts/custom-sdk-context";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const CustomContractForm = dynamic(() => import("./custom-contract"));
const BuiltinContractForm = dynamic(() => import("./built-in-contract"));

interface ContractDeployFormProps {
  contractId: ContractId;
  chainId?: SUPPORTED_CHAIN_ID;
  onSuccessCallback?: (contractAddress: string) => void;
}

export const ContractDeployForm: React.FC<ContractDeployFormProps> = ({
  contractId,
  chainId: chainIdProp,
  onSuccessCallback,
}) => {
  const publishMetadata = useContractPublishMetadataFromURI(contractId);
  const chainId = useChainId();
  const [selectedChain, setSelectedChain] = useState<
    SUPPORTED_CHAIN_ID | undefined
  >(
    chainIdProp
      ? chainIdProp
      : chainId && SUPPORTED_CHAIN_IDS.includes(chainId)
      ? chainId
      : undefined,
  );

  useEffect(() => {
    if (!selectedChain && chainId && SUPPORTED_CHAIN_IDS.includes(chainId)) {
      setSelectedChain(chainId);
    }
  }, [chainId, selectedChain]);

  const OSRoyaltyContract =
    OSRoyaltyToPrebuilt[
      publishMetadata.data?.name as keyof typeof OSRoyaltyToPrebuilt
    ];

  const contractType = useMemo(
    () => OSRoyaltyContract || contractId,
    [contractId, OSRoyaltyContract],
  );

  const isImplementationDeploy = !!chainIdProp;

  if (!contractId) {
    return null;
  }
  if (contractId === "custom") {
    return <div>Invalid attempt to deploy &quot;custom&quot; contract.</div>;
  }

  return (
    <CustomSDKContext desiredChainId={selectedChain}>
      {isContractIdBuiltInContract(contractType) && !isImplementationDeploy ? (
        <BuiltinContractForm
          contractType={contractType}
          selectedChain={selectedChain}
          onChainSelect={setSelectedChain}
          disabledChains={OSRoyaltyContract ? OSRoyaltyDisabledChains : []}
        />
      ) : (
        <CustomContractForm
          ipfsHash={contractId}
          selectedChain={selectedChain}
          onChainSelect={setSelectedChain}
          isImplementationDeploy={isImplementationDeploy}
          onSuccessCallback={onSuccessCallback}
        />
      )}
    </CustomSDKContext>
  );
};
