import { Box } from "@chakra-ui/react";
import { useChainId } from "@thirdweb-dev/react";
import {
  ContractType,
  SUPPORTED_CHAIN_ID,
  SUPPORTED_CHAIN_IDS,
} from "@thirdweb-dev/sdk";
import { AppLayout } from "components/app-layouts/app";
import BuiltinContractForm from "components/contract-components/contract-deploy-form/built-in-contract";
import { isContractIdBuiltInContract } from "components/contract-components/utils";
import { CustomSDKContext } from "contexts/custom-sdk-context";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "pages/_app";
import React, { ReactElement, useEffect, useState } from "react";
import { Card } from "tw-components";

const DeployContractType: ThirdwebNextPage = () => {
  const contractType = useSingleQueryParam("contractType") as
    | ContractType
    | undefined;
  const chainId = useChainId();
  const [selectedChain, setSelectedChain] = useState<
    SUPPORTED_CHAIN_ID | undefined
  >(chainId && SUPPORTED_CHAIN_IDS.includes(chainId) ? chainId : undefined);

  useEffect(() => {
    if (!selectedChain && chainId && SUPPORTED_CHAIN_IDS.includes(chainId)) {
      setSelectedChain(chainId);
    }
  }, [chainId, selectedChain]);

  if (!contractType) {
    return null;
  }
  if (contractType === "custom") {
    return <div>Invalid attempt to deploy &quot;custom&quot; contract.</div>;
  }

  return (
    <Card p={{ base: 6, md: 10 }}>
      <Box>
        <CustomSDKContext desiredChainId={selectedChain}>
          {isContractIdBuiltInContract(contractType) ? (
            <BuiltinContractForm
              contractType={contractType}
              selectedChain={selectedChain}
              onChainSelect={setSelectedChain}
            />
          ) : null}
        </CustomSDKContext>
      </Box>
    </Card>
  );
};

DeployContractType.getLayout = (page: ReactElement) => (
  <AppLayout>{page}</AppLayout>
);

DeployContractType.pageId = PageId.PreBuiltContractType;

export default DeployContractType;
