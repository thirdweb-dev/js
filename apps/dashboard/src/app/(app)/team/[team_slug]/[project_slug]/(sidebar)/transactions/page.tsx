import { createVaultClient, listEoas } from "@thirdweb-dev/vault-sdk";
import { notFound, redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { NEXT_PUBLIC_THIRDWEB_VAULT_URL } from "@/constants/public-envs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { TransactionsAnalyticsPageContent } from "./analytics/analytics-page";
import { EngineChecklist } from "./analytics/ftux.client";
import { TransactionAnalyticsSummary } from "./analytics/summary";
import { getTransactionAnalyticsSummary } from "./lib/analytics";
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
  const isManagedVault = !!projectEngineCloudService?.encryptedAdminKey;

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

  const initialData = await getTransactionAnalyticsSummary({
    clientId: project.publishableKey,
    teamId: project.teamId,
  }).catch(() => undefined);
  const hasTransactions = initialData ? initialData.totalCount > 0 : false;

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  return (
    <div className="flex grow flex-col">
      <EngineChecklist
        isManagedVault={isManagedVault}
        client={client}
        hasTransactions={hasTransactions}
        managementAccessToken={managementAccessToken ?? undefined}
        project={project}
        teamSlug={params.team_slug}
        testTxWithWallet={searchParams.testTxWithWallet as string | undefined}
        wallets={wallets ?? []}
      />
      {hasTransactions && !searchParams.testTxWithWallet && (
        <TransactionAnalyticsSummary
          clientId={project.publishableKey}
          initialData={initialData}
          teamId={project.teamId}
        />
      )}
      <div className="h-10" />
      <TransactionsAnalyticsPageContent
        client={client}
        project={project}
        searchParams={searchParams}
        showAnalytics={hasTransactions && !searchParams.testTxWithWallet}
        teamSlug={params.team_slug}
        wallets={wallets}
      />
    </div>
  );
}
