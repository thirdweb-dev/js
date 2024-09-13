import { Separator } from "@/components/ui/separator";
import { SimpleGrid } from "@chakra-ui/react";
import { ChakraProviderSetup } from "../../../../../@/components/ChakraProviderSetup";
import { PublishedContract } from "../../../../../components/contract-components/published-contract";
import { setOverrides } from "../../../../../lib/vercel-utils";
import { PublishedActions } from "../../components/contract-actions-published.client";
import { DeployContractHeader } from "../../components/contract-header";
import { getPublishedContractsWithPublisherMapping } from "./utils/getPublishedContractsWithPublisherMapping";

setOverrides();

type PublishedContractDeployPageProps = {
  params: {
    publisher: string;
    contract_id: string;
  };
};

export default async function PublishedContractPage(
  props: PublishedContractDeployPageProps,
) {
  const publishedContractVersions =
    await getPublishedContractsWithPublisherMapping({
      publisher: props.params.publisher,
      contract_id: props.params.contract_id,
    });

  const publishedContract = publishedContractVersions[0];

  return (
    <>
      <DeployContractHeader
        {...props.params}
        allVersions={publishedContractVersions}
        activeVersion={publishedContract}
      >
        <PublishedActions
          {...props.params}
          dispayName={publishedContract.displayName || publishedContract.name}
        />
      </DeployContractHeader>
      <Separator />
      {/* TODO: remove the chakra things :) */}
      <ChakraProviderSetup>
        <SimpleGrid columns={12} gap={{ base: 6, md: 10 }} w="full">
          <PublishedContract
            publishedContract={publishedContract}
            walletOrEns={props.params.publisher}
          />
        </SimpleGrid>
      </ChakraProviderSetup>
    </>
  );
}
