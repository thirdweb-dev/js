import { ResponsiveSuspense } from "responsive-rsc";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/project/projects";
import type { Range } from "@/components/analytics/date-range-selector";
import { LoadingChartState } from "@/components/analytics/empty-chart-state";
import { TransactionsChartCardAsync } from "../components/Transactions";
import { AIAnalyticsChartCard } from "./ai-card";
import { AllWalletConnectionsChart } from "./all-wallet-connections-chart";
import { BridgeChartCard } from "./bridge-card";
import { ProjectHighlightCard } from "./highlights-card";
import { IndexerRequestsChartCard } from "./indexer-card";
import { RPCRequestsChartCard } from "./rpc-card";
import type { PageParams, PageSearchParams } from "./types";
import { X402RequestsChartCard } from "./x402-card";

export async function ProjectAnalytics(props: {
  project: Project;
  params: PageParams;
  range: Range;
  interval: "day" | "week";
  searchParams: PageSearchParams;
  client: ThirdwebClient;
  authToken: string;
}) {
  const { project, params, range, interval, searchParams, client, authToken } =
    props;

  return (
    <div className="flex grow flex-col gap-6">
      {/* highlights */}
      <ProjectHighlightCard
        authToken={authToken}
        client={client}
        interval={interval}
        params={params}
        project={project}
        range={range}
        searchParams={searchParams}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* wallets */}
        <AllWalletConnectionsChart
          teamSlug={params.team_slug}
          projectSlug={params.project_slug}
          authToken={authToken}
          projectId={project.id}
          from={range.from}
          to={range.to}
          interval={interval}
          teamId={project.teamId}
        />

        {/* bridge */}
        <BridgeChartCard
          teamSlug={params.team_slug}
          projectSlug={params.project_slug}
          from={range.from}
          to={range.to}
          interval={interval}
          projectId={project.id}
          teamId={project.teamId}
          authToken={authToken}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Indexer */}
        <IndexerRequestsChartCard
          teamSlug={params.team_slug}
          projectSlug={params.project_slug}
          from={range.from}
          to={range.to}
          interval={interval}
          projectId={project.id}
          teamId={project.teamId}
          authToken={authToken}
        />

        {/* RPC */}
        <RPCRequestsChartCard
          teamSlug={params.team_slug}
          projectSlug={params.project_slug}
          from={range.from}
          to={range.to}
          interval={interval}
          projectId={project.id}
          teamId={project.teamId}
          authToken={authToken}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* x402 */}
        <X402RequestsChartCard
          teamSlug={params.team_slug}
          projectSlug={params.project_slug}
          from={range.from}
          to={range.to}
          interval={interval}
          projectId={project.id}
          teamId={project.teamId}
          authToken={authToken}
        />

        {/* AI  */}
        <AIAnalyticsChartCard
          teamSlug={params.team_slug}
          projectSlug={params.project_slug}
          from={range.from}
          to={range.to}
          interval={interval}
          projectId={project.id}
          teamId={project.teamId}
          authToken={authToken}
        />
      </div>

      {/* Transactions, Chains, Contracts */}
      <ResponsiveSuspense
        fallback={<LoadingChartState className="h-[458px] border" />}
        searchParamsUsed={["from", "to", "interval", "client_transactions"]}
      >
        <TransactionsChartCardAsync
          client={client}
          params={{
            from: range.from,
            period: interval,
            projectId: project.id,
            teamId: project.teamId,
            to: range.to,
          }}
          authToken={authToken}
          selectedChart={
            typeof searchParams.client_transactions === "string"
              ? searchParams.client_transactions
              : undefined
          }
          selectedChartQueryParam="client_transactions"
        />
      </ResponsiveSuspense>
    </div>
  );
}
