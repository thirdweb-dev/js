import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { PublishedContract } from "../../../../../components/contract-components/published-contract";
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
  const publishedContractVersions =
    await getPublishedContractsWithPublisherMapping({
      publisher: (await props.params).publisher,
      contract_id: (await props.params).contract_id,
    });

  if (!publishedContractVersions) {
    notFound();
  }

  const publishedContract = publishedContractVersions[0];

  if (!publishedContract) {
    notFound();
  }

  return (<>
    <DeployContractHeader
      {...(await props.params)}
      allVersions={publishedContractVersions}
      activeVersion={publishedContract}
    >
      <PublishedActions
        {...(await props.params)}
        dispayName={publishedContract.displayName || publishedContract.name}
      />
    </DeployContractHeader>
    <Separator />
    {/* TODO: remove the chakra things :) */}
    <ChakraProviderSetup>
      <div className="grid w-full grid-cols-12 gap-6 md:gap-10">
        <PublishedContract
          publishedContract={publishedContract}
          walletOrEns={(await props.params).publisher}
        />
      </div>
    </ChakraProviderSetup>
  </>);
}
