import { ContractId } from "../types";
import CustomContractForm from "./custom-contract";
import { useAddress, useChainId } from "@thirdweb-dev/react";
import { CustomSDKContext } from "contexts/custom-sdk-context";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import { useEffect, useState } from "react";

interface ContractDeployFormProps {
  contractId: ContractId;
  chainId?: number;
  onSuccessCallback?: (contractAddress: string) => void;
  isImplementationDeploy?: true;
}

export const ContractDeployForm: React.FC<ContractDeployFormProps> = ({
  contractId,
  chainId: chainIdProp,
  onSuccessCallback,
  isImplementationDeploy,
}) => {
  const walletAddress = useAddress();
  const connectedChainId = useChainId();
  const configuredNetworksRecord = useSupportedChainsRecord();
  const [selectedChain, setSelectedChain] = useState<number | undefined>(
    chainIdProp
      ? chainIdProp
      : connectedChainId && connectedChainId in configuredNetworksRecord
        ? connectedChainId
        : undefined,
  );

  useEffect(() => {
    // If the user has not selected a chain, and the connected chain is configured, select it
    if (
      !selectedChain &&
      connectedChainId &&
      connectedChainId in configuredNetworksRecord
    ) {
      setSelectedChain(connectedChainId);
    }
  }, [connectedChainId, selectedChain, configuredNetworksRecord]);

  if (!contractId) {
    return null;
  }
  if (contractId === "custom") {
    return <div>Invalid attempt to deploy &quot;custom&quot; contract.</div>;
  }

  return (
    <CustomSDKContext desiredChainId={selectedChain}>
      <CustomContractForm
        ipfsHash={contractId}
        selectedChain={selectedChain}
        onChainSelect={setSelectedChain}
        isImplementationDeploy={isImplementationDeploy}
        onSuccessCallback={onSuccessCallback}
        // has to be passed in because if we use `useAddress()` inside it will start out as undefined -> not be overwritten -> not trigger a re-render
        // we can clean this up once the we can can call functions without constructing a whole new SDK each time
        walletAddress={walletAddress}
      />
    </CustomSDKContext>
  );
};
