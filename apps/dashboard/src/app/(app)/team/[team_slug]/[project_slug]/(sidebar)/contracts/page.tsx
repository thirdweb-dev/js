import { ArrowUpFromLineIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { ContractIcon } from "@/icons/ContractIcon";
import { loginRedirect } from "@/utils/redirects";
import { DeployedContractsPage } from "./DeployedContractsPage";
import { ImportContractButton } from "./import-contract-button";

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
    <ProjectPage
      header={{
        client,
        title: "Contracts",
        icon: ContractIcon,
        description: (
          <>
            Read, write, and deploy smart contracts on any EVM compatible
            blockchain. <br className="max-sm:hidden" /> Deploy contracts from
            templates, or build your own from scratch
          </>
        ),
        actions: {
          primary: {
            label: "Deploy Contract",
            href: "/explore",
            icon: <ArrowUpFromLineIcon className="size-3.5" />,
          },
          secondary: {
            component: (
              <ImportContractButton
                teamId={team.id}
                projectId={project.id}
                projectSlug={params.project_slug}
                teamSlug={params.team_slug}
                client={client}
              />
            ),
          },
        },
        links: [
          {
            type: "docs",
            href: "https://portal.thirdweb.com/contracts",
          },
          {
            type: "playground",
            href: "https://playground.thirdweb.com/contracts/read",
          },
          {
            type: "api",
            href: "https://api.thirdweb.com/reference#tag/contracts",
          },
          {
            type: "webhooks",
            href: `/team/${params.team_slug}/${params.project_slug}/webhooks/contracts`,
          },
        ],
      }}
      footer={{
        left: {
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
        },
        center: {
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
        },
        right: {
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
        },
      }}
    >
      <DeployedContractsPage
        authToken={authToken}
        client={client}
        projectId={project.id}
        projectSlug={params.project_slug}
        teamId={team.id}
        teamSlug={params.team_slug}
      />
    </ProjectPage>
  );
}
