import { getValidAccount } from "@/api/account/get-account";
import { getAuthToken } from "@/api/auth-token";
import { getProjects } from "@/api/project/projects";
import { getTeams } from "@/api/team/get-team";
import { AppFooter } from "@/components/footers/app-footer";
import { DotsBackgroundPattern } from "@/components/ui/background-patterns";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { TeamHeader } from "../../../components/TeamHeader/team-header";
import { GenericProjectSelector } from "../../_components/project-selector";

export default async function Page(props: {
  params: Promise<{
    paths?: string[];
  }>;
}) {
  const params = await props.params;
  const pagePath = `/team/~/~${params.paths?.length ? `/${params.paths.join("/")}` : ""}`;

  const [authToken, account, teams] = await Promise.all([
    getAuthToken(),
    await getValidAccount(pagePath),
    getTeams(),
  ]);

  if (!authToken || !account || !teams) {
    loginRedirect(pagePath);
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: undefined,
  });

  const teamAndAllProjects = await Promise.all(
    teams.map(async (team) => {
      return {
        projects: await getProjects(team.slug).catch(() => []),
        team,
      };
    }),
  );

  return (
    <ProjectSelectionLayout>
      <GenericProjectSelector
        client={client}
        paths={params.paths}
        description={
          params.paths?.[0] === "tokens"
            ? "Select a project to continue with token creation"
            : "Select a project to continue"
        }
        teamAndProjects={teamAndAllProjects}
      />
    </ProjectSelectionLayout>
  );
}

function ProjectSelectionLayout(props: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="border-b bg-card">
        <TeamHeader />
      </div>

      <div className="relative flex grow flex-col overflow-hidden">
        <DotsBackgroundPattern />
        <div className="container z-10 flex grow flex-col items-center justify-center py-20">
          {props.children}
        </div>
      </div>
      <AppFooter className="relative z-10" />
    </div>
  );
}
