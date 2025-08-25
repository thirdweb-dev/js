import { Button } from "@workspace/ui/components/button";
import { PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { ThirdwebClient } from "thirdweb";
import { getAuthToken } from "@/api/auth-token";
import { getSortedDeployedContracts } from "@/api/project/getSortedDeployedContracts";
import { getProject } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import { ClientOnly } from "@/components/blocks/client-only";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { ContractTable } from "@/components/contract-components/tables/contract-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { Cards, ImportTokenButton } from "./cards";

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
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/tokens`);
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
        title: "Tokens",
        description: "Create and manage tokens for your project",
        actions: {
          primary: {
            component: (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-1.5 rounded-full" size="sm">
                    <PlusIcon className="size-4" />
                    Create Token
                  </Button>
                </DialogTrigger>
                <DialogContent className="!max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Token</DialogTitle>
                  </DialogHeader>
                  <Cards
                    client={client}
                    projectId={project.id}
                    projectSlug={params.project_slug}
                    teamId={team.id}
                    teamSlug={params.team_slug}
                  />
                </DialogContent>
              </Dialog>
            ),
          },
          secondary: {
            component: (
              <ImportTokenButton
                client={client}
                projectId={project.id}
                projectSlug={params.project_slug}
                teamId={team.id}
                teamSlug={params.team_slug}
              />
            ),
          },
        },
        links: [
          {
            type: "docs",
            href: "https://portal.thirdweb.com/tokens",
          },
          {
            type: "playground",
            href: "https://playground.thirdweb.com/tokens/token-components",
          },
          {
            type: "api",
            href: "https://api.thirdweb.com/reference#tag/tokens",
          },
        ],
      }}
    >
      <Suspense fallback={<GenericLoadingPage />}>
        <AssetsPageAsync
          authToken={authToken}
          client={client}
          projectId={project.id}
          projectSlug={params.project_slug}
          teamId={team.id}
          teamSlug={params.team_slug}
        />
      </Suspense>
    </ProjectPage>
  );
}

async function AssetsPageAsync(props: {
  teamId: string;
  projectId: string;
  authToken: string;
  client: ThirdwebClient;
  teamSlug: string;
  projectSlug: string;
}) {
  const deployedContracts = await getSortedDeployedContracts({
    authToken: props.authToken,
    deploymentType: "asset",
    projectId: props.projectId,
    teamId: props.teamId,
  });

  return (
    <ClientOnly ssr={<GenericLoadingPage />}>
      <ContractTable
        client={props.client}
        contracts={deployedContracts}
        pageSize={10}
        projectId={props.projectId}
        projectSlug={props.projectSlug}
        teamId={props.teamId}
        teamSlug={props.teamSlug}
        variant="asset"
      />
    </ClientOnly>
  );
}
