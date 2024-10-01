import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { Separator } from "@/components/ui/separator";
import { PublishedContract } from "../../../../../components/contract-components/published-contract";
import { PublishedActions } from "../../components/contract-actions-published.client";
import { DeployContractHeader } from "../../components/contract-header";
import { getPublishedContractsWithPublisherMapping } from "./utils/getPublishedContractsWithPublisherMapping";

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
        <div className="grid w-full grid-cols-12 gap-6 md:gap-10">
          <PublishedContract
            publishedContract={publishedContract}
            walletOrEns={props.params.publisher}
          />
        </div>
      </ChakraProviderSetup>
    </>
  );
}
