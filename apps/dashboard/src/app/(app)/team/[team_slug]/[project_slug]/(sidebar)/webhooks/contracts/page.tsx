import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getSupportedWebhookChains } from "@/api/insight/webhooks";
import { getProject } from "@/api/project/projects";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { CreateContractWebhookButton } from "../components/CreateWebhookModal";
import { ContractsWebhooksPageContent } from "../contract-webhooks/contract-webhooks-page";

export default async function ContractsPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
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

  let supportedChainIds: number[] = [];
  const supportedChainsRes = await getSupportedWebhookChains();
  if ("chains" in supportedChainsRes) {
    supportedChainIds = supportedChainsRes.chains;
  }

  return (
    <ProjectPage
      header={{
        client,
        title: "Webhooks",
        description:
          "Get notified about blockchain events, transactions and more.",
        actions: {
          primary: {
            component: (
              <CreateContractWebhookButton
                projectClientId={project.publishableKey}
                supportedChainIds={supportedChainIds}
                client={client}
              />
            ),
          },
          secondary: {
            label: "Documentation",
            href: "https://portal.thirdweb.com/insight/webhooks",
            external: true,
          },
        },
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
      <ContractsWebhooksPageContent
        authToken={authToken}
        project={project}
        supportedChainIds={supportedChainIds}
      />
    </ProjectPage>
  );
}
