import { ContractId } from "../types";
import { isContractIdBuiltInContract } from "../utils";
import { CustomSDKContext } from "contexts/custom-sdk-context";
import dynamic from "next/dynamic";
import { useState } from "react";
import { SUPPORTED_CHAIN_ID } from "utils/network";

const CustomContractForm = dynamic(() => import("./custom-contract"));
const BuiltinContractForm = dynamic(() => import("./built-in-contract"));

interface ContractDeployFormProps {
  contractId: ContractId;
}

export const ContractDeployForm: React.FC<ContractDeployFormProps> = ({
  contractId,
}) => {
  const [selectedChain, setSelectedChain] = useState<
    SUPPORTED_CHAIN_ID | undefined
  >(undefined);
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
        />
      )}
    </CustomSDKContext>
  );
};
