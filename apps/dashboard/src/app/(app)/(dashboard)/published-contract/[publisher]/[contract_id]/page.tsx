import { notFound } from "next/navigation";
import { getRawAccount } from "@/api/account/get-account";
import { getAuthToken, getAuthTokenWalletAddress } from "@/api/auth-token";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { PublishedActions } from "../../components/contract-actions-published.client";
import { DeployContractHeader } from "../../components/contract-header";
import { PublishedContractBreadcrumbs } from "./components/breadcrumbs.client";
import { PublishedContract } from "./components/published-contract";
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
  const accountAddress = await getAuthTokenWalletAddress();
  const publishedContractVersions =
    await getPublishedContractsWithPublisherMapping({
      client: serverThirdwebClient,
      contract_id: params.contract_id,
      publisher: params.publisher,
    });

  if (!publishedContractVersions) {
    notFound();
  }

  const publishedContract = publishedContractVersions[0];

  if (!publishedContract) {
    notFound();
  }

  const [account, authToken] = await Promise.all([
    getRawAccount(),
    getAuthToken(),
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
        client={getClientThirdwebClient({
          jwt: authToken,
          teamId: undefined,
        })}
        isLoggedIn={!!account}
        publishedContract={publishedContract}
      />
    </div>
  );
}
