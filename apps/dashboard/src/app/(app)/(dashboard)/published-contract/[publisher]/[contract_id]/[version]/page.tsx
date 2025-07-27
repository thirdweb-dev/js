import { notFound } from "next/navigation";
import { isAddress } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import { getUserThirdwebClient } from "@/api/auth-token";
import { fetchPublishedContractVersions } from "@/components/contract-components/fetch-contracts-with-versions";
import { PublishedContract } from "@/components/contracts/published-contract";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { PublishedActions } from "../../../components/contract-actions-published.client";
import { DeployContractHeader } from "../../../components/contract-header";
import { PublishedContractBreadcrumbs } from "../components/breadcrumbs.client";

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
    <div>
      <div className="border-border border-b border-dashed">
        <PublishedContractBreadcrumbs className="container max-w-7xl" />
      </div>

      <div className="border-border border-b">
        <DeployContractHeader
          {...params}
          activeVersion={publishedContract}
          allVersions={publishedContractVersions}
          className="container max-w-7xl"
        >
          <PublishedActions
            {...params}
            displayName={
              publishedContract.displayName || publishedContract.name
            }
          />
        </DeployContractHeader>
      </div>

      <PublishedContract
        className="container max-w-7xl"
        client={client}
        isLoggedIn={!!account}
        publishedContract={publishedContract}
      />
    </div>
  );
}
