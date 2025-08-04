import { notFound } from "next/navigation";
import { isAddress } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import { getRawAccount } from "@/api/account/get-account";
import {
  getAuthTokenWalletAddress,
  getUserThirdwebClient,
} from "@/api/auth-token";
import { fetchPublishedContractVersions } from "@/api/contract/fetch-contracts-with-versions";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { PublishedActions } from "../../../components/contract-actions-published.client";
import { DeployContractHeader } from "../../../components/contract-header";
import { PublishedContractBreadcrumbs } from "../components/breadcrumbs.client";
import { PublishedContract } from "../components/published-contract";

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
  const accountAddress = await getAuthTokenWalletAddress();
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
        <PublishedContractBreadcrumbs className="container max-w-5xl" />
      </div>

      <div className="border-dashed border-b">
        <DeployContractHeader
          {...params}
          activeVersion={publishedContract}
          allVersions={publishedContractVersions}
          className="container max-w-5xl"
          accountAddress={accountAddress || undefined}
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
        maxWidthClassName="container max-w-5xl"
        client={client}
        isLoggedIn={!!account}
        publishedContract={publishedContract}
      />
    </div>
  );
}
