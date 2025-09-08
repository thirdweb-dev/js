import { CircleAlertIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getValidTeamPlan } from "@/utils/getValidTeamPlan";
import { loginRedirect } from "@/utils/redirects";
import { DefaultFactoriesSection } from "../../account-abstraction/factories/AccountFactories";
import { YourFactoriesSection } from "../../account-abstraction/factories/AccountFactories/your-factories";
import { AccountAbstractionSettingsPage } from "../../account-abstraction/settings/SponsorshipPolicies";
import { ProjectSettingsBreadcrumb } from "../_components/project-settings-breadcrumb";

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
    loginRedirect(`/team/${team_slug}/settings/account-abstraction`);
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

  const bundlerService = project.services.find((s) => s.name === "bundler");

  return (
    <div>
      <ProjectSettingsBreadcrumb
        teamSlug={team_slug}
        projectSlug={project_slug}
        page="Account Abstraction"
      />

      <div className="space-y-8 mt-6">
        {!bundlerService ? (
          <Alert variant="warning">
            <CircleAlertIcon className="size-5" />
            <AlertTitle>Account Abstraction service is disabled</AlertTitle>
            <AlertDescription>
              Enable Account Abstraction service in{" "}
              <UnderlineLink
                href={`/team/${team_slug}/${project_slug}/settings`}
              >
                project settings
              </UnderlineLink>{" "}
              to configure the sponsorship rules
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <AccountAbstractionSettingsPage
              bundlerService={bundlerService}
              client={client}
              project={project}
              teamId={team.id}
              teamSlug={team.slug}
              validTeamPlan={getValidTeamPlan(team)}
            />

            <DefaultFactoriesSection />
            <YourFactoriesSection
              authToken={authToken}
              clientThirdwebClient={client}
              projectId={project.id}
              projectSlug={project.slug}
              teamId={team.id}
              teamSlug={team.slug}
            />
          </>
        )}
      </div>
    </div>
  );
}
