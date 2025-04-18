import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { PublishedContract } from "../../../../../components/contract-components/published-contract";
import { getRawAccount } from "../../../../account/settings/getAccount";
import { getUserThirdwebClient } from "../../../../api/lib/getAuthToken";
import { PublishedActions } from "../../components/contract-actions-published.client";
import { DeployContractHeader } from "../../components/contract-header";
import { getPublishedContractsWithPublisherMapping } from "./utils/getPublishedContractsWithPublisherMapping";

type PublishedContractDeployPageProps = {
  params: Promise<{
    publisher: string;
    contract_id: string;
  }>;
};

export default async function PublishedContractPage(
  props: PublishedContractDeployPageProps,
) {
  const params = await props.params;
  const client = await getUserThirdwebClient();
  const publishedContractVersions =
    await getPublishedContractsWithPublisherMapping({
      publisher: params.publisher,
      contract_id: params.contract_id,
      client,
    });

  if (!publishedContractVersions) {
    notFound();
  }

  const publishedContract = publishedContractVersions[0];

  if (!publishedContract) {
    notFound();
  }

  const account = await getRawAccount();

  return (
    <>
      <DeployContractHeader
        {...params}
        allVersions={publishedContractVersions}
        activeVersion={publishedContract}
        client={client}
      >
        <PublishedActions
          {...params}
          displayName={publishedContract.displayName || publishedContract.name}
        />
      </DeployContractHeader>
      <Separator />
      {/* TODO: remove the chakra things :) */}
      <ChakraProviderSetup>
        <div className="grid w-full grid-cols-12 gap-6 md:gap-10">
          <PublishedContract
            publishedContract={publishedContract}
            isLoggedIn={!!account}
          />
        </div>
      </ChakraProviderSetup>
    </>
  );
}
