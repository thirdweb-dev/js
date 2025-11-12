import { WebhookIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const [authToken, params] = await Promise.all([getAuthToken(), props.params]);

  const project = await getProject(params.team_slug, params.project_slug);

  if (!project || !authToken) {
    notFound();
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  return (
    <ProjectPage
      header={{
        client,
        icon: WebhookIcon,
        title: "Webhooks",
        description: "Get notified for Bridge, Swap and Onramp events.",
        actions: null,
        links: [
          {
            type: "docs",
            href: "https://portal.thirdweb.com/payments/webhooks",
          },
        ],
      }}
      tabs={[
        {
          name: "Contracts",
          path: `/team/${params.team_slug}/${params.project_slug}/webhooks/contracts`,
        },
        {
          name: "Bridge",
          path: `/team/${params.team_slug}/${params.project_slug}/webhooks/payments`,
        },
      ]}
    >
      {props.children}
    </ProjectPage>
  );
}
