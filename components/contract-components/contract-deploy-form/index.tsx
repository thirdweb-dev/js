import { ContractId } from "../types";
import { isContractIdBuiltInContract } from "../utils";
import { useChainId } from "@thirdweb-dev/react";
import { SUPPORTED_CHAIN_ID, SUPPORTED_CHAIN_IDS } from "@thirdweb-dev/sdk";
import { CustomSDKContext } from "contexts/custom-sdk-context";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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

  if (!contractId) {
    return null;
  }
  if (contractId === "custom") {
    return <div>Invalid attempt to deploy &quot;custom&quot; contract.</div>;
  }

  return (
    <CustomSDKContext desiredChainId={selectedChain}>
      {isContractIdBuiltInContract(contractId) ? (
        <BuiltinContractForm
          contractType={contractId}
          selectedChain={selectedChain}
          onChainSelect={setSelectedChain}
        />
      ) : (
        <CustomContractForm
          ipfsHash={contractId}
          selectedChain={selectedChain}
          onChainSelect={setSelectedChain}
          isImplementationDeploy={!!chainIdProp}
          onSuccessCallback={onSuccessCallback}
        />
      )}
    </CustomSDKContext>
  );
};
