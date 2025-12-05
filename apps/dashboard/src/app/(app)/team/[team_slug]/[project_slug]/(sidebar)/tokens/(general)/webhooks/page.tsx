import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getSupportedWebhookChains } from "@/api/insight/webhooks";
import { getProject } from "@/api/project/projects";
import { ContractsWebhooksPageContent } from "./components/contract-webhooks-page";

export default async function ContractsPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const [authToken, params] = await Promise.all([getAuthToken(), props.params]);

  const project = await getProject(params.team_slug, params.project_slug);

  if (!project || !authToken) {
    notFound();
  }

  let supportedChainIds: number[] = [];
  const supportedChainsRes = await getSupportedWebhookChains();
  if ("chains" in supportedChainsRes) {
    supportedChainIds = supportedChainsRes.chains;
  }

  return (
    <ContractsWebhooksPageContent
      authToken={authToken}
      project={project}
      supportedChainIds={supportedChainIds}
    />
  );
}
