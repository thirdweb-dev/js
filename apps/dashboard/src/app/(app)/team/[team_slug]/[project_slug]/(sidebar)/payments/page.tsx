import { Button } from "@workspace/ui/components/button";
import { PlusIcon, WebhookIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { PayIcon } from "@/icons/PayIcon";
import { loginRedirect } from "@/utils/redirects";
import { AdvancedSection } from "./components/AdvancedSection.client";
import { QuickStartSection } from "./components/QuickstartSection.client";
import { CreatePaymentLinkButton } from "./links/components/CreatePaymentLinkButton.client";
import { PaymentLinksTable } from "./links/components/PaymentLinksTable.client";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  const [params, authToken] = await Promise.all([props.params, getAuthToken()]);
  const project = await getProject(params.team_slug, params.project_slug);

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/payments`);
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
        title: "Payments",
        icon: PayIcon,
        description: (
          <>
            Payments allows developers accept crypto payments for goods and
            services
          </>
        ),
        actions: {
          primary: {
            component: (
              <CreatePaymentLinkButton
                clientId={project.publishableKey}
                teamId={project.teamId}
              >
                <Button className="gap-1.5 rounded-full" size="sm">
                  <PlusIcon className="size-4" />
                  Create Payment
                </Button>
              </CreatePaymentLinkButton>
            ),
          },
          secondary: {
            href: `/team/${params.team_slug}/${params.project_slug}/webhooks/payments`,
            label: "Webhooks",
            icon: <WebhookIcon className="size-3.5 text-muted-foreground" />,
          },
        },
        settings: {
          href: `/team/${params.team_slug}/${params.project_slug}/settings/payments`,
        },
        links: [
          {
            type: "docs",
            href: "https://portal.thirdweb.com/payments",
          },
          {
            type: "playground",
            href: "https://playground.thirdweb.com/payments/ui-components",
          },
          {
            type: "api",
            href: "https://api.thirdweb.com/reference#tag/payments",
          },
        ],
      }}
      footer={{
        center: {
          links: [
            {
              href: "https://playground.thirdweb.com/payments/ui-components",
              label: "UI Component",
            },
            {
              href: "https://playground.thirdweb.com/connect/payments/fund-wallet",
              label: "Buy Crypto",
            },
            {
              href: "https://playground.thirdweb.com/connect/payments/commerce",
              label: "Checkout",
            },
            {
              href: "https://playground.thirdweb.com/connect/payments/transactions",
              label: "Transactions",
            },
          ],
          title: "Demos",
        },
        left: {
          links: [
            {
              href: "https://portal.thirdweb.com/payments",
              label: "Overview",
            },
            {
              href: "https://portal.thirdweb.com/typescript/v5/convertCryptoToFiat",
              label: "TypeScript",
            },
            {
              href: "https://portal.thirdweb.com/react/v5/pay/fund-wallets",
              label: "React",
            },
            {
              href: "https://portal.thirdweb.com/dotnet/universal-bridge/quickstart",
              label: ".NET",
            },
          ],
          title: "Documentation",
        },
        right: {
          links: [
            {
              href: "https://www.youtube.com/watch?v=aBu175-VsNY",
              label: "Implement cross-chain payments in any app",
            },
          ],
          title: "Tutorials",
        },
      }}
    >
      <div className="flex flex-col gap-12">
        <PaymentLinksTable
          clientId={project.publishableKey}
          teamId={project.teamId}
        />
        <QuickStartSection
          projectSlug={params.project_slug}
          teamSlug={params.team_slug}
          clientId={project.publishableKey}
          teamId={project.teamId}
        />

        <AdvancedSection
          teamSlug={params.team_slug}
          projectSlug={params.project_slug}
        />
      </div>
    </ProjectPage>
  );
}
