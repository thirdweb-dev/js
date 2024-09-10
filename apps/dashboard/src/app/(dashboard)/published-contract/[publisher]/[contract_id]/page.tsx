import { Separator } from "@/components/ui/separator";
import { thirdwebClient } from "@/constants/client";
import { SimpleGrid } from "@chakra-ui/react";
import { isAddress } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import { ChakraProviderSetup } from "../../../../../@/components/ChakraProviderSetup";
import { fetchPublishedContractVersions } from "../../../../../components/contract-components/fetch-contracts-with-versions";
import { PublishedContract } from "../../../../../components/contract-components/published-contract";
import { setOverrides } from "../../../../../lib/vercel-utils";
import { PublishedActions } from "../../components/contract-actions-published.client";
import { DeployContractHeader } from "../../components/contract-header";

setOverrides();

function mapThirdwebPublisher(publisher: string) {
  if (publisher === "thirdweb.eth") {
    return "deployer.thirdweb.eth";
  }
  return publisher;
}

type PublishedContractDeployPageProps = {
  params: {
    publisher: string;
    contract_id: string;
  };
};

export default async function PublishedContractPage(
  props: PublishedContractDeployPageProps,
) {
  // resolve ENS if required
  const publisherAddress = isAddress(props.params.publisher)
    ? props.params.publisher
    : await resolveAddress({
        client: thirdwebClient,
        name: mapThirdwebPublisher(props.params.publisher),
      });

  // get all the published versions of the contract
  const publishedContractVersions = await fetchPublishedContractVersions(
    publisherAddress,
    props.params.contract_id,
  );

  // determine the "active" version of the contract based on the version that is passed
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
