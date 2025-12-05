import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { WalletProductIcon } from "@/icons/WalletProductIcon";
import { loginRedirect } from "@/utils/redirects";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const basePath = `/team/${params.team_slug}/${params.project_slug}/wallets/dedicated-relayer`;

  const [authToken, project] = await Promise.all([
    getAuthToken(),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!authToken) {
    loginRedirect(basePath);
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  return (
    <ProjectPage
      header={{
        icon: WalletProductIcon,
        title: "Dedicated Relayer",
        description:
          "Executor wallets which automatically relay transactions with higher throughput and dedicated infrastructure",
        actions: null,
        client,
        links: [
          {
            type: "docs",
            href: "https://portal.thirdweb.com/wallets/server",
          },
        ],
      }}
      tabs={[]}
    >
      {props.children}
    </ProjectPage>
  );
}
