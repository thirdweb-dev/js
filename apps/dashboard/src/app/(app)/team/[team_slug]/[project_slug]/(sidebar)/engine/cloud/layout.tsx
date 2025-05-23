import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabPathLinks } from "@/components/ui/tabs";
import { NEXT_PUBLIC_ENGINE_CLOUD_URL } from "@/constants/public-envs";
import Link from "next/link";
import { EngineIcon } from "../../../../../../(dashboard)/(chain)/components/server/icons/EngineIcon";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  children: React.ReactNode;
}) {
  const { team_slug, project_slug } = await props.params;

  return (
    <TransactionsLayout projectSlug={project_slug} teamSlug={team_slug}>
      {props.children}
    </TransactionsLayout>
  );
}

function TransactionsLayout(props: {
  projectSlug: string;
  teamSlug: string;
  children: React.ReactNode;
}) {
  const engineBaseSlug = `/team/${props.teamSlug}/${props.projectSlug}/engine`;
  const engineLayoutSlug = `${engineBaseSlug}/cloud`;

  return (
    <div className="flex grow flex-col">
      {/* top */}
      <div className="pt-4 lg:pt-6">
        {/* header */}
        <div className="container flex max-w-7xl flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <h1 className="mb-0.5 flex items-center gap-2 font-semibold text-3xl tracking-tight">
                Engine{" "}
                <Badge
                  variant="success"
                  className="mt-0.5 flex items-center gap-2 text-sm"
                >
                  <EngineIcon className="size-4" /> Cloud
                </Badge>
                <Badge
                  variant="outline"
                  className="mt-0.5 flex items-center gap-2 text-sm"
                >
                  Beta
                </Badge>
              </h1>
              <div className="flex items-center gap-2">
                <Link
                  href={`${NEXT_PUBLIC_ENGINE_CLOUD_URL}/reference`} // TODO: change this
                  target="_blank"
                  className="max-w-full truncate py-1 text-muted-foreground"
                >
                  {NEXT_PUBLIC_ENGINE_CLOUD_URL}
                </Link>
              </div>
            </div>
            <Link href={`${engineBaseSlug}/dedicated`}>
              <Button variant="outline">View dedicated engines</Button>
            </Link>
          </div>
        </div>

        <div className="h-4" />

        {/* Nav */}
        <TabPathLinks
          scrollableClassName="container max-w-7xl"
          links={[
            {
              name: "Transactions",
              path: `${engineLayoutSlug}`,
              exactMatch: true,
            },
            {
              name: "API Explorer",
              path: `${engineLayoutSlug}/explorer`,
            },
            {
              name: "Server Wallets",
              path: `${engineLayoutSlug}/server-wallets`,
            },
            {
              name: "Vault",
              path: `${engineLayoutSlug}/vault`,
            },
          ]}
        />
      </div>
      <div className="h-6" />
      <div className="container flex max-w-7xl grow flex-col gap-6">
        <div>{props.children}</div>
      </div>
      <div className="h-20" />
    </div>
  );
}
