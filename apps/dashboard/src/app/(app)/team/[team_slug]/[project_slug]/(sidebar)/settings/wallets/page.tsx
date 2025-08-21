import { Button } from "@workspace/ui/components/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getValidTeamPlan } from "@/utils/getValidTeamPlan";
import { loginRedirect } from "@/utils/redirects";
import { getSMSCountryTiers } from "./api/sms";
import { InAppWalletSettingsPage } from "./components";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;

  const [team, project, smsCountryTiers, authToken] = await Promise.all([
    getTeamBySlug(team_slug),
    getProject(team_slug, project_slug),
    getSMSCountryTiers(),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${team_slug}/settings/wallets`);
  }

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
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
        <h2 className="text-2xl font-medium">Wallets</h2>
      </div>
      <InAppWalletSettingsPage
        client={client}
        project={project}
        smsCountryTiers={smsCountryTiers}
        teamId={team.id}
        teamPlan={getValidTeamPlan(team)}
        teamSlug={team_slug}
      />
    </div>
  );
}
