import { type WebhookResponse, getWebhooks } from "@/api/insight/webhooks";
import { getProject } from "@/api/projects";
import { TrackedUnderlineLink } from "@/components/ui/tracked-link";
import { notFound } from "next/navigation";
import { CreateWebhookModal } from "./components/CreateWebhookModal";
import { WebhooksTable } from "./components/WebhooksTable";

export default async function WebhooksPage({
  params,
}: { params: Promise<{ team_slug: string; project_slug: string }> }) {
  let webhooks: WebhookResponse[] = [];
  let clientId = "";
  let errorMessage = "";

  try {
    // Await params before accessing properties
    const resolvedParams = await params;
    const team_slug = resolvedParams.team_slug;
    const project_slug = resolvedParams.project_slug;

    const project = await getProject(team_slug, project_slug);

    if (!project) {
      notFound();
    }

    clientId = project.publishableKey;

    const webhooksRes = await getWebhooks(clientId);
    if (webhooksRes.error) {
      errorMessage = webhooksRes.error;
    } else if (webhooksRes.data) {
      webhooks = webhooksRes.data;
    }
  } catch (error) {
    errorMessage = "Failed to load webhooks. Please try again later.";
    console.error("Error loading project or webhooks", error);
  }

  return (
    <div className="flex grow flex-col">
      <div className="border-b py-10">
        <div className="container max-w-7xl">
          <h1 className="mb-1 font-semibold text-3xl tracking-tight">
            Webhooks
          </h1>
          <p className="text-muted-foreground text-sm">
            Create and manage webhooks to get notified about blockchain events,
            transactions and more.{" "}
            <TrackedUnderlineLink
              category="webhooks"
              label="learn-more"
              target="_blank"
              rel="noopener noreferrer"
              href="https://portal.thirdweb.com/insight/webhooks"
            >
              Learn more about webhooks.
            </TrackedUnderlineLink>
          </p>
        </div>
      </div>
      <div className="h-6" />
      <div className="container max-w-7xl">
        {errorMessage ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive bg-destructive/10 p-12 text-center">
            <div>
              <h3 className="mb-1 font-medium text-destructive text-lg">
                Unable to load webhooks
              </h3>
              <p className="text-muted-foreground">{errorMessage}</p>
            </div>
          </div>
        ) : webhooks.length > 0 ? (
          <WebhooksTable webhooks={webhooks} clientId={clientId} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border p-12 text-center">
            <div>
              <h3 className="mb-1 font-medium text-lg">No webhooks found</h3>
              <p className="text-muted-foreground">
                Create a webhook to get started.
              </p>
            </div>
            <CreateWebhookModal clientId={clientId} />
          </div>
        )}
      </div>
      <div className="h-20" />
    </div>
  );
}
