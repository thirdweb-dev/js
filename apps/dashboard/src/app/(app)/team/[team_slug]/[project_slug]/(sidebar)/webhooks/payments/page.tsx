import { Button } from "@workspace/ui/components/button";
import { PlusIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import {
  CreatePaymentWebhookButton,
  PayWebhooksPage,
} from "../../payments/webhooks/components/webhooks.client";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
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
        title: "Webhooks",
        description: "Get notified for Bridge, Swap and Onramp events.",
        actions: {
          primary: {
            component: (
              <CreatePaymentWebhookButton
                clientId={project.publishableKey}
                teamId={project.teamId}
              >
                <Button className="gap-1.5 rounded-full">
                  <PlusIcon className="size-4" />
                  <span>Create Webhook</span>
                </Button>
              </CreatePaymentWebhookButton>
            ),
          },
          secondary: {
            label: "Documentation",
            href: "https://portal.thirdweb.com/payments/webhooks",
            external: true,
          },
        },
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
          name: "Payments",
          path: `/team/${params.team_slug}/${params.project_slug}/webhooks/payments`,
        },
      ]}
    >
      <PayWebhooksPage
        clientId={project.publishableKey}
        teamId={project.teamId}
      />
    </ProjectPage>
  );
}
