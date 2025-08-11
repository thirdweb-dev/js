import { PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getProject } from "@/api/project/projects";
import { Button } from "@/components/ui/button";
import { CreatePaymentLinkButton } from "./components/CreatePaymentLinkButton.client";
import { PaymentLinksTable } from "./components/PaymentLinksTable.client";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  const params = await props.params;
  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  return (
    <div>
      <div className="w-full flex flex-col md:flex-row justify-between gap-4 items-start">
        <div>
          <h2 className="mb-0.5 font-semibold text-xl tracking-tight">
            Create a Payment
          </h2>
          <p className="text-muted-foreground text-sm">
            Make money in any token instantly with a hosted payments UI.
          </p>
        </div>
        <CreatePaymentLinkButton
          key="create-payment-link"
          clientId={project.publishableKey}
          teamId={project.teamId}
        >
          <Button className="gap-1" variant="default" size="sm">
            <PlusIcon className="size-4" />
            Create Payment
          </Button>
        </CreatePaymentLinkButton>
      </div>
      <div className="h-4" />
      <PaymentLinksTable
        clientId={project.publishableKey}
        teamId={project.teamId}
      />
    </div>
  );
}
