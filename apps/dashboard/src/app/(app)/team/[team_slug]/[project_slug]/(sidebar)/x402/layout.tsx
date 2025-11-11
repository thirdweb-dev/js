import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { PayIcon } from "@/icons/PayIcon";
import { loginRedirect } from "@/utils/redirects";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const basePath = `/team/${params.team_slug}/${params.project_slug}/x402`;

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
        icon: PayIcon,
        title: "x402 Payments",
        description: "Instant payments for your APIs, apps and agents",
        actions: null,
        client,
        links: [
          {
            type: "docs",
            href: "https://portal.thirdweb.com/x402",
          },
        ],
      }}
      tabs={[
        {
          name: "Overview",
          path: `${basePath}`,
          exactMatch: true,
        },
        {
          name: "Configuration",
          path: `${basePath}/configuration`,
        },
      ]}
    >
      {props.children}
    </ProjectPage>
  );
}
