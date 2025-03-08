import { getProject } from "@/api/projects";
import { TabPathLinks } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import { UnderlineLink } from "../../../../../../@/components/ui/UnderlineLink";

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
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row">
        <div className="max-w-[700px]">
          <h1 className="mb-1 font-semibold text-2xl tracking-tight lg:mb-2 lg:text-3xl">
            Universal Bridge
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
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
      </div>

      <TabPathLinks
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

      {props.children}
    </div>
  );
}
