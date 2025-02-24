import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { AccountAbstractionSettingsPage } from "../../../../../../../components/smart-wallets/SponsorshipPolicies";
import { getValidTeamPlan } from "../../../../../components/TeamHeader/getValidTeamPlan";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;

  const [project, team] = await Promise.all([
    getProject(team_slug, project_slug),
    getTeamBySlug(team_slug),
  ]);

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

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
        bundlerService={bundlerService}
        trackingCategory="account-abstraction-project-settings"
        project={project}
        teamId={team.id}
        validTeamPlan={getValidTeamPlan(team)}
      />
    </ChakraProviderSetup>
  );
}
