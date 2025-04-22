import { getProject } from "@/api/projects";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { TabPathLinks } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import { FooterLinksSection } from "../../components/footer/FooterLinksSection";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const payLayoutPath = `/team/${params.team_slug}/${params.project_slug}/connect/universal-bridge`;

  return (
    <div className="flex grow flex-col">
      <div className="pt-4 lg:pt-6">
        <div className="container max-w-7xl">
          <h1 className="mb-1 font-semibold text-2xl tracking-tight lg:mb-2 lg:text-3xl">
            Universal Bridge
          </h1>
          <p className="max-w-3xl text-muted-foreground text-sm leading-relaxed">
            Universal Bridge allows your users to bridge, swap, and purchase
            cryptocurrencies and execute transactions with any fiat options or
            tokens via cross-chain routing.{" "}
            <UnderlineLink
              target="_blank"
              href="https://portal.thirdweb.com/connect/pay/overview"
            >
              Learn more
            </UnderlineLink>
          </p>
        </div>

        <div className="h-4" />
        <TabPathLinks
          scrollableClassName="container max-w-7xl"
          className="w-full"
          links={[
            {
              name: "Analytics",
              path: payLayoutPath,
              exactMatch: true,
            },
            {
              name: "Webhooks",
              path: `${payLayoutPath}/webhooks`,
            },
            {
              name: "Settings",
              path: `${payLayoutPath}/settings`,
            },
          ]}
        />
      </div>

      <div className="h-6" />
      <div className="container flex max-w-7xl grow flex-col">
        {props.children}
      </div>

      <div className="h-20" />
      <div className="border-border border-t">
        <div className="container max-w-7xl">
          <UBFooter />
        </div>
      </div>
    </div>
  );
}

function UBFooter() {
  return (
    <FooterLinksSection
      trackingCategory="universal-bridge"
      left={{
        title: "Documentation",
        links: [
          {
            href: "https://portal.thirdweb.com/connect/pay/overview",
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
      }}
      right={{
        title: "Tutorials",
        links: [
          {
            label: "Implement cross-chain payments in any app",
            href: "https://www.youtube.com/watch?v=aBu175-VsNY",
          },
        ],
      }}
      center={{
        title: "Demos",
        links: [
          {
            label: "UI Component",
            href: "https://playground.thirdweb.com/connect/pay",
          },
          {
            label: "Buy Crypto",
            href: "https://playground.thirdweb.com/connect/pay/fund-wallet",
          },
          {
            label: "Commerce",
            href: "https://playground.thirdweb.com/connect/pay/commerce",
          },
          {
            label: "Transactions",
            href: "https://playground.thirdweb.com/connect/pay/transactions",
          },
        ],
      }}
    />
  );
}
