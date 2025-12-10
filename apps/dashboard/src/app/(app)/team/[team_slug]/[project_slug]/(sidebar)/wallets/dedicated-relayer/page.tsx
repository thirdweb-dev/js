import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import { getLastNDaysRange } from "@/components/analytics/date-range-selector";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { DedicatedRelayerPageClient } from "./components/page-client";
import { buildFleetId, type Fleet } from "./types";

export const dynamic = "force-dynamic";

export default async function DedicatedRelayerPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const [params, authToken] = await Promise.all([props.params, getAuthToken()]);

  if (!authToken) {
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/wallets/dedicated-relayer`,
    );
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

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  // Build fleet ID from team and project
  const fleetId = buildFleetId(team.id, project.id);

  // Default date range: last 7 days
  const range = getLastNDaysRange("last-7");

  // Extract fleet configuration from bundler service
  const bundlerService = project.services.find((s) => s.name === "bundler");
  const fleetConfig =
    bundlerService && "dedicatedRelayer" in bundlerService
      ? (bundlerService.dedicatedRelayer as {
          sku: string;
          chainIds: number[];
          executors: string[];
        } | null)
      : null;

  // Convert fleet config to Fleet type
  // If fleet is undefined/null, show empty state (not-purchased)
  // If fleet.executors is empty, show pending state
  // If fleet.executors has addresses, show active state
  let initialFleet: Fleet | null = null;
  if (fleetConfig) {
    initialFleet = {
      id: fleetId,
      chainIds: fleetConfig.chainIds,
      executors: fleetConfig.executors,
    };
  }

  return (
    <DedicatedRelayerPageClient
      teamId={team.id}
      projectId={project.id}
      teamSlug={params.team_slug}
      projectSlug={params.project_slug}
      client={client}
      fleetId={fleetId}
      from={range.from.toISOString()}
      to={range.to.toISOString()}
      rangeType={range.type}
      initialFleet={initialFleet}
    />
  );
}
