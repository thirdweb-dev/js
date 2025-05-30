import { getProject } from "@/api/projects";
import { NEXT_PUBLIC_THIRDWEB_VAULT_URL } from "@/constants/public-envs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { createVaultClient, listEoas } from "@thirdweb-dev/vault-sdk";
import { notFound, redirect } from "next/navigation";
import { getAuthToken } from "../../../../../../api/lib/getAuthToken";
import { TransactionsAnalyticsPageContent } from "./analytics/analytics-page";
import { EngineChecklist } from "./analytics/ftux.client";
import { TransactionAnalyticsSummary } from "./analytics/summary";
import {
  type TransactionSummaryData,
  getTransactionAnalyticsSummary,
} from "./lib/analytics";
import type { Wallet } from "./server-wallets/wallet-table/types";

export default async function TransactionsAnalyticsPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<{
    from?: string | string[] | undefined;
    to?: string | string[] | undefined;
    interval?: string | string[] | undefined;
    testTxWithWallet?: string | string[] | undefined;
  }>;
}) {
  const [params, searchParams, authToken] = await Promise.all([
    props.params,
    props.searchParams,
    getAuthToken(),
  ]);

  if (!authToken) {
    notFound();
  }

  const [vaultClient, project] = await Promise.all([
    createVaultClient({
      baseUrl: NEXT_PUBLIC_THIRDWEB_VAULT_URL,
    }).catch(() => undefined),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  if (!vaultClient) {
    return <div>Error: Failed to connect to Vault</div>;
  }

  const projectEngineCloudService = project.services.find(
    (service) => service.name === "engineCloud",
  );

  const managementAccessToken =
    projectEngineCloudService?.managementAccessToken;

  const eoas = managementAccessToken
    ? await listEoas({
        client: vaultClient,
        request: {
          auth: {
            accessToken: managementAccessToken,
          },
          options: {},
        },
      })
    : { data: { items: [] }, error: null, success: true };

  const wallets = eoas.data?.items as Wallet[] | undefined;

  let initialData: TransactionSummaryData | undefined;
  if (wallets && wallets.length > 0) {
    const summary = await getTransactionAnalyticsSummary({
      teamId: project.teamId,
      clientId: project.publishableKey,
    }).catch(() => undefined);
    initialData = summary;
  }
  const hasTransactions = initialData ? initialData.totalCount > 0 : false;

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  return (
    <div className="flex grow flex-col">
      <EngineChecklist
        teamSlug={params.team_slug}
        managementAccessToken={managementAccessToken ?? undefined}
        hasTransactions={hasTransactions}
        project={project}
        wallets={wallets ?? []}
        testTxWithWallet={searchParams.testTxWithWallet as string | undefined}
      />
      {hasTransactions && !searchParams.testTxWithWallet && (
        <TransactionAnalyticsSummary
          initialData={initialData}
          teamId={project.teamId}
          clientId={project.publishableKey}
        />
      )}
      <div className="h-10" />
      <TransactionsAnalyticsPageContent
        teamSlug={params.team_slug}
        searchParams={searchParams}
        project={project}
        showAnalytics={hasTransactions && !searchParams.testTxWithWallet}
        wallets={wallets}
        client={client}
      />
    </div>
  );
}
