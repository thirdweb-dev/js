import { Button } from "@workspace/ui/components/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import { getFees } from "@/api/universal-bridge/developer";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { PayConfig } from "./PayConfig";
import { RouteDiscovery } from "./RouteDiscovery";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;

  const [team, project, authToken] = await Promise.all([
    getTeamBySlug(team_slug),
    getProject(team_slug, project_slug),

    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${team_slug}/settings/payments`);
  }

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  let fees = await getFees({
    clientId: project.publishableKey,
    teamId: team.id,
  }).catch(() => {
    return {
      createdAt: "",
      feeBps: 0,
      feeRecipient: "",
      updatedAt: "",
    };
  });

  if (!fees) {
    fees = {
      createdAt: "",
      feeBps: 0,
      feeRecipient: "",
      updatedAt: "",
    };
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-row items-center gap-2">
        <Button variant="outline" size="icon" className="rounded-full" asChild>
          <Link href={`/team/${team_slug}/${project_slug}/settings`}>
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-medium">Payments</h2>
      </div>

      <PayConfig
        fees={fees}
        project={project}
        teamId={team.id}
        teamSlug={team_slug}
      />

      <RouteDiscovery client={client} project={project} />
    </div>
  );
}
