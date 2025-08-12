import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { FooterLinksSection } from "../components/footer/FooterLinksSection";
import { DeployedContractsPage } from "./DeployedContractsPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;

  const [authToken, team, project] = await Promise.all([
    getAuthToken(),
    getTeamBySlug(params.team_slug),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/contracts`);
  }

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <div className="flex grow flex-col">
      <DeployedContractsPage
        authToken={authToken}
        client={client}
        projectId={project.id}
        projectSlug={params.project_slug}
        teamId={team.id}
        teamSlug={params.team_slug}
      />
      <div className="h-20" />
      <ContractsFooter />
    </div>
  );
}

function ContractsFooter() {
  return (
    <div className="border-t">
      <div className="container max-w-7xl">
        <FooterLinksSection
          center={{
            links: [
              {
                href: "https://thirdweb.com/templates/hardhat-starter",
                label: "Hardhat Starter",
              },
              {
                href: "https://thirdweb.com/templates/forge-starter",
                label: "Forge Starter",
              },
            ],
            title: "Templates",
          }}
          left={{
            links: [
              {
                href: "https://portal.thirdweb.com/contracts/deploy/overview",
                label: "Deployment Tools",
              },
              {
                href: "https://portal.thirdweb.com/contracts/modular-contracts/overview",
                label: "Modular Contracts",
              },
              {
                href: "https://portal.thirdweb.com/contracts/explore/overview",
                label: "Pre-built Contracts",
              },
            ],
            title: "Documentation",
          }}
          right={{
            links: [
              {
                href: "https://www.youtube.com/watch?v=cZt-CkzxrNM",
                label:
                  "Everything you need to know about upgradeable smart contracts",
              },
              {
                href: "https://www.youtube.com/watch?v=ZoOk41y4f_k",
                label:
                  "Modular Contracts SDK: Build Core & Modules from Scratch (Advanced Guide)",
              },
            ],
            title: "Tutorials",
          }}
        />
      </div>
    </div>
  );
}
