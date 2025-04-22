import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { createVaultClient, listEoas } from "@thirdweb-dev/vault-sdk";
import { notFound, redirect } from "next/navigation";
import { THIRDWEB_VAULT_URL } from "../../../../../@/constants/env";
import { getAuthToken } from "../../../../api/lib/getAuthToken";
import { TransactionsAnalyticsPageContent } from "./analytics/analytics-page";
import { TransactionAnalyticsSummary } from "./analytics/summary";
import type { Wallet } from "./server-wallets/wallet-table/types";

export default async function TransactionsAnalyticsPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<{
    from?: string | string[] | undefined;
    to?: string | string[] | undefined;
    interval?: string | string[] | undefined;
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

  const [team, project] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const projectEngineCloudService = project.services.find(
    (service) => service.name === "engineCloud",
  );

  const vaultClient = await createVaultClient({
    baseUrl: THIRDWEB_VAULT_URL,
  });

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

  return (
    <div className="flex grow flex-col">
      <TransactionAnalyticsSummary
        teamId={project.teamId}
        clientId={project.publishableKey}
      />
      <div className="h-10" />
      <TransactionsAnalyticsPageContent
        searchParams={searchParams}
        teamId={project.teamId}
        clientId={project.publishableKey}
        project_slug={params.project_slug}
        team_slug={params.team_slug}
        wallets={wallets}
      />
    </div>
  );
}
