import { Button } from "@workspace/ui/components/button";
import { PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { TokenIcon } from "@/icons/TokenIcon";
import { loginRedirect } from "@/utils/redirects";
import { Cards, ImportTokenButton } from "./cards";

export default async function Layout(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  children: React.ReactNode;
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
        icon: TokenIcon,
        client,
        title: "Tokens",
        description: "Create and manage tokens for your project",
        actions: {
          primary: {
            component: (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2 rounded-full" size="sm">
                    <PlusIcon className="size-3.5" />
                    Create Token
                  </Button>
                </DialogTrigger>
                <DialogContent className="!max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Token</DialogTitle>
                    <DialogDescription>
                      Launch your own ERC-20 coin or NFT collection
                    </DialogDescription>
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
      tabs={[
        {
          name: "Overview",
          path: `/team/${params.team_slug}/${params.project_slug}/tokens`,
          exactMatch: true,
        },
        {
          name: "Webhooks",
          path: `/team/${params.team_slug}/${params.project_slug}/tokens/webhooks`,
        },
      ]}
    >
      {props.children}
    </ProjectPage>
  );
}
