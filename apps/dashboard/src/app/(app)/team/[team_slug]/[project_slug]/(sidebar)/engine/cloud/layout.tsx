import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabPathLinks } from "@/components/ui/tabs";
import { NEXT_PUBLIC_ENGINE_CLOUD_URL } from "@/constants/public-envs";
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
                  className="mt-0.5 flex items-center gap-2 text-sm"
                  variant="success"
                >
                  <EngineIcon className="size-4" /> Cloud
                </Badge>
                <Badge
                  className="mt-0.5 flex items-center gap-2 text-sm"
                  variant="outline"
                >
                  Beta
                </Badge>
              </h1>
              <div className="flex items-center gap-2">
                <Link
                  className="max-w-full truncate py-1 text-muted-foreground" // TODO: change this
                  href={`${NEXT_PUBLIC_ENGINE_CLOUD_URL}/reference`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {NEXT_PUBLIC_ENGINE_CLOUD_URL}
                </Link>
              </div>
            </div>
            <Link href={`${engineBaseSlug}/dedicated`}>
              <Button variant="outline">View Dedicated Engine</Button>
            </Link>
          </div>
        </div>

        <div className="h-4" />

        {/* Nav */}
        <TabPathLinks
          links={[
            {
              exactMatch: true,
              name: "Transactions",
              path: `${engineLayoutSlug}`,
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
          scrollableClassName="container max-w-7xl"
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
