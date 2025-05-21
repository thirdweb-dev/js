import { getProjects } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { getTeamSubscriptions } from "@/api/team-subscription";
import { fetchRPCUsage } from "@/api/usage/rpc";
import { normalizeTimeISOString } from "@/lib/time";
import { redirect } from "next/navigation";
import { getClientThirdwebClient } from "../../../../../../../@/constants/thirdweb-client.client";
import { getValidAccount } from "../../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../login/loginRedirect";
import { Usage } from "./overview/components/Usage";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const [account, team, authToken] = await Promise.all([
    getValidAccount(`/team/${params.team_slug}/~/usage`),
    getTeamBySlug(params.team_slug),
    getAuthToken(),
  ]);

  if (!team) {
    redirect("/team");
  }

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/~/usage`);
  }

  const [subscriptions, projects, rpcUsage] = await Promise.all([
    getTeamSubscriptions(team.slug),
    getProjects(team.slug),
    fetchRPCUsage({
      authToken,
      period: "day",
      // 7 days ago
      from: normalizeTimeISOString(
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      ),
      // now
      to: normalizeTimeISOString(new Date()),
      teamId: team.id,
    }),
  ]);

  if (!subscriptions) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-lg border p-4 text-destructive-text">
        Something went wrong. Please try again later.
      </div>
    );
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <Usage
      subscriptions={subscriptions}
      account={account}
      team={team}
      client={client}
      rpcUsage={rpcUsage.ok ? rpcUsage.data : []}
      projects={projects.map((project) => ({
        id: project.id,
        name: project.name,
        image: project.image,
        slug: project.slug,
      }))}
    />
  );
}
