import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { BridgeIcon } from "@/icons/BridgeIcon";
import { loginRedirect } from "@/utils/redirects";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const [params, authToken] = await Promise.all([props.params, getAuthToken()]);

  const project = await getProject(params.team_slug, params.project_slug);

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/bridge`);
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
        client,
        title: "Bridge",
        icon: BridgeIcon,
        description: (
          <>
            Bridge lets developers swap and transfer any token across any chain
            instantly
          </>
        ),
        actions: null,
        links: [
          {
            type: "docs",
            href: "https://portal.thirdweb.com/bridge",
          },
          {
            type: "playground",
            href: "https://playground.thirdweb.com/bridge/swap-widget",
          },
          {
            type: "api",
            href: "https://api.thirdweb.com/reference#tag/bridge",
          },
        ],
      }}
      tabs={[
        {
          name: "Overview",
          path: `/team/${params.team_slug}/${params.project_slug}/bridge`,
          exactMatch: true,
        },
        {
          name: "Configuration",
          path: `/team/${params.team_slug}/${params.project_slug}/bridge/configuration`,
        },
        {
          name: "Webhooks",
          path: `/team/${params.team_slug}/${params.project_slug}/bridge/webhooks`,
        },
      ]}
    >
      {props.children}
    </ProjectPage>
  );
}
