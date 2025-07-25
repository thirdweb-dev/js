import { redirect } from "next/navigation";
import { getProject } from "@/api/projects";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { PaymentLinksTable } from "./components/PaymentLinksTable.client";
import { CreatePaymentLinkButton } from "./components/CreatePaymentLinkButton.client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

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
            Payment Links
          </h2>
          <p className="text-muted-foreground text-sm">
            Get notified for Bridge, Swap and Onramp events.{" "}
            <UnderlineLink
              href="https://portal.thirdweb.com/payments/webhooks"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn more
            </UnderlineLink>
          </p>
        </div>
        <CreatePaymentLinkButton
          key="create-payment-link"
          teamId={project.teamId}
        >
          <Button className="gap-1" variant="default" size="sm">
            <PlusIcon className="size-4" />
            Create Payment Link
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
