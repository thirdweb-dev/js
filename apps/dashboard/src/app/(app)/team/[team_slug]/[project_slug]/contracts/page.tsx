import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { redirect } from "next/navigation";
import { DeployedContractsPage } from "../../../../account/contracts/_components/DeployedContractsPage";
import { getAuthToken } from "../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../login/loginRedirect";
import { FooterLinksSection } from "../components/footer/FooterLinksSection";

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

  const client = getThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <div className="flex grow flex-col">
      <DeployedContractsPage
        teamId={team.id}
        projectId={project.id}
        authToken={authToken}
        client={client}
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
          trackingCategory="contracts"
          left={{
            title: "Documentation",
            links: [
              {
                label: "Deployment Tools",
                href: "https://portal.thirdweb.com/contracts/deploy/overview",
              },
              {
                label: "Modular Contracts",
                href: "https://portal.thirdweb.com/contracts/modular-contracts/overview",
              },
              {
                label: "Pre-built Contracts",
                href: "https://portal.thirdweb.com/contracts/explore/overview",
              },
            ],
          }}
          center={{
            title: "Templates",
            links: [
              {
                label: "Hardhat Starter",
                href: "https://thirdweb.com/templates/hardhat-starter",
              },
              {
                href: "https://thirdweb.com/templates/forge-starter",
                label: "Forge Starter",
              },
            ],
          }}
          right={{
            title: "Tutorials",
            links: [
              {
                label:
                  "Everything you need to know about upgradeable smart contracts",
                href: "https://www.youtube.com/watch?v=cZt-CkzxrNM",
              },
              {
                label:
                  "Modular Contracts SDK: Build Core & Modules from Scratch (Advanced Guide)",
                href: "https://www.youtube.com/watch?v=ZoOk41y4f_k",
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
