import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { Separator } from "@/components/ui/separator";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { SimpleGrid } from "@chakra-ui/react";
import { fetchPublishedContractVersions } from "components/contract-components/fetch-contracts-with-versions";
import { PublishedContract } from "components/contract-components/published-contract";
import { notFound } from "next/navigation";
import { isAddress } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
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
  let publisherAddress: string | undefined = undefined;

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

  const [authToken, account] = await Promise.all([
    getAuthToken(),
    getRawAccount(),
  ]);

  return (
    <>
      <DeployContractHeader
        {...params}
        allVersions={publishedContractVersions}
        activeVersion={publishedContract}
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
            publishedContract={publishedContract}
            isLoggedIn={!!account}
            client={getClientThirdwebClient({
              jwt: authToken,
              teamId: undefined,
            })}
          />
        </SimpleGrid>
      </ChakraProviderSetup>
    </>
  );
}
