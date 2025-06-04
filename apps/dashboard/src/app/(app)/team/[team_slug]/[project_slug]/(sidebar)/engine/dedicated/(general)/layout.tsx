import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabPathLinks } from "@/components/ui/tabs";
import { DatabaseIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { EngineIcon } from "../../../../../../../(dashboard)/(chain)/components/server/icons/EngineIcon";
import { ImportEngineLink } from "./_components";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const linkPrefix = `/team/${params.team_slug}/${params.project_slug}/engine/dedicated`;

  return (
    <div className="flex grow flex-col">
      {/* header */}
      <header className="pt-10 pb-6">
        <div className="container max-w-7xl">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-2">
              <h1 className="flex items-center gap-2 font-semibold text-3xl tracking-tight">
                Engine{" "}
                <Badge
                  variant="warning"
                  className="flex items-center gap-2 text-sm"
                >
                  <DatabaseIcon className="size-4" /> Dedicated
                </Badge>
              </h1>
              <p className="flex flex-col text-muted-foreground text-sm">
                Manage your deployed Engine instances
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ImportEngineLink
                label="Import Engine"
                engineLinkPrefix={linkPrefix}
              />
            </div>
          </div>
          <div className="h-6" />
          <EngineLegacyBannerUI
            teamSlug={params.team_slug}
            projectSlug={params.project_slug}
          />
        </div>
      </header>

      <div className="relative">
        <div className="absolute right-0 bottom-0 left-0 h-[1px] bg-border" />
        <div className="container max-w-7xl">
          <TabPathLinks
            className="pt-2"
            bottomLineClassName="hidden"
            links={[
              {
                name: "Engine Instances",
                path: `${linkPrefix}`,
                exactMatch: true,
              },
              {
                name: "Import Engine",
                path: `${linkPrefix}/import`,
              },
            ]}
          />
        </div>
      </div>

      <div className="container max-w-7xl pt-8 pb-10">{props.children}</div>
    </div>
  );
}

function EngineLegacyBannerUI(props: {
  teamSlug: string;
  projectSlug: string;
}) {
  return (
    <Alert variant="info">
      <AlertTitle>Engine Cloud (Beta)</AlertTitle>
      <AlertDescription className="pt-1">
        <p className="text-foreground text-sm">
          Try Engine Cloud (Beta) - now included for free in every thirdweb
          project.
        </p>
        <div className="h-2" />
        <ul className="list-disc space-y-1.5 pl-4 text-muted-foreground text-sm">
          <li>No recurring monthly cost, pay-per-request model</li>
          <li>Powered by Vault: our new TEE based key management system</li>
          <li>Improved performance and simplified transaction API</li>
        </ul>
        <div className="h-6" />
        <div className="flex justify-start gap-3">
          <Button className="flex items-center gap-2" asChild size="sm">
            <Link
              href={`/team/${props.teamSlug}/${props.projectSlug}/engine/cloud`}
            >
              <EngineIcon className="size-4" /> Try Engine Cloud
            </Link>
          </Button>

          <Button variant="outline" asChild size="sm">
            <Link
              href={"https://portal.thirdweb.com/engine/v3"}
              target="_blank"
              className="gap-2 bg-background"
            >
              Learn More <ExternalLinkIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
