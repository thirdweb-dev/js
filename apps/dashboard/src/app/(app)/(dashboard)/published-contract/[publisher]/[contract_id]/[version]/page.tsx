import { SimpleGrid } from "@chakra-ui/react";
import { ChakraProviderSetup } from "chakra/ChakraProviderSetup";
import { notFound } from "next/navigation";
import { isAddress } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import { getUserThirdwebClient } from "@/api/auth-token";
import { fetchPublishedContractVersions } from "@/components/contract-components/fetch-contracts-with-versions";
import { PublishedContract } from "@/components/contracts/published-contract";
import { Separator } from "@/components/ui/separator";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { PublishedActions } from "../../../components/contract-actions-published.client";
import { DeployContractHeader } from "../../../components/contract-header";

function mapThirdwebPublisher(publisher: string) {
  if (publisher === "thirdweb.eth") {
    return "deployer.thirdweb.eth";
  }
  return publisher;
}

type PublishedContractDeployPageProps = {
  params: Promise<{
    publisher: string;
    contract_id: string;
    version: string;
  }>;
};

export default async function PublishedContractPage(
  props: PublishedContractDeployPageProps,
) {
  const params = await props.params;
  // resolve ENS if required
  let publisherAddress: string | undefined;

  if (isAddress(params.publisher)) {
    publisherAddress = params.publisher;
  } else {
    try {
      publisherAddress = await resolveAddress({
        client: serverThirdwebClient,
        name: mapThirdwebPublisher(params.publisher),
      });
    } catch {
      // ignore
    }
  }

  if (!publisherAddress) {
    notFound();
  }

  // get all the published versions of the contract
  const publishedContractVersions = await fetchPublishedContractVersions(
    publisherAddress,
    params.contract_id,
    serverThirdwebClient,
  );

  // determine the "active" version of the contract based on the version that is passed
  const publishedContract =
    publishedContractVersions.find((v) => v.version === params.version) ||
    publishedContractVersions[0];

  if (!publishedContract) {
    return notFound();
  }

  const [account, client] = await Promise.all([
    getRawAccount(),
    getUserThirdwebClient({
      teamId: undefined,
    }),
  ]);

  return (
    <>
      <DeployContractHeader
        {...params}
        activeVersion={publishedContract}
        allVersions={publishedContractVersions}
      >
        <PublishedActions
          {...params}
          displayName={publishedContract.displayName || publishedContract.name}
        />
      </DeployContractHeader>
      <Separator />
      {/* TODO: remove the chakra things :) */}
      <ChakraProviderSetup>
        <SimpleGrid columns={12} gap={{ base: 6, md: 10 }} w="full">
          <PublishedContract
            client={client}
            isLoggedIn={!!account}
            publishedContract={publishedContract}
          />
        </SimpleGrid>
      </ChakraProviderSetup>
    </>
  );
}
