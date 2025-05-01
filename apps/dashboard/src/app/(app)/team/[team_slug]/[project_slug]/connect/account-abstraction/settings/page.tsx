import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { AccountAbstractionSettingsPage } from "components/smart-wallets/SponsorshipPolicies";
import { CircleAlertIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getAuthToken } from "../../../../../../api/lib/getAuthToken";
import { getValidTeamPlan } from "../../../../../components/TeamHeader/getValidTeamPlan";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;

  const [project, team, authToken] = await Promise.all([
    getProject(team_slug, project_slug),
    getTeamBySlug(team_slug),
    getAuthToken(),
  ]);

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  const client = await getThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  const bundlerService = project.services.find((s) => s.name === "bundler");

  if (!bundlerService) {
    return (
      <Alert variant="warning">
        <CircleAlertIcon className="size-5" />
        <AlertTitle>Account Abstraction service is disabled</AlertTitle>
        <AlertDescription>
          Enable Account Abstraction service in{" "}
          <UnderlineLink href={`/team/${team_slug}/${project_slug}/settings`}>
            project settings
          </UnderlineLink>{" "}
          to configure the sponsorship rules
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ChakraProviderSetup>
      <AccountAbstractionSettingsPage
        client={client}
        bundlerService={bundlerService}
        trackingCategory="account-abstraction-project-settings"
        project={project}
        teamId={team.id}
        teamSlug={team.slug}
        validTeamPlan={getValidTeamPlan(team)}
      />
    </ChakraProviderSetup>
  );
}
