import { DatabaseIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabPathLinks } from "@/components/ui/tabs";
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
            <div>
              <h1 className="mb-1 flex items-center gap-2 font-semibold text-3xl tracking-tight">
                Transactions{" "}
                <Badge
                  className="flex items-center gap-2 text-sm"
                  variant="warning"
                >
                  <DatabaseIcon className="size-4" /> Dedicated Engine
                </Badge>
              </h1>
              <p className="flex flex-col text-muted-foreground text-sm">
                Manage your deployed Engine instances
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ImportEngineLink
                engineLinkPrefix={linkPrefix}
                label="Import Engine"
              />
            </div>
          </div>
          <div className="h-6" />
          <EngineLegacyBannerUI
            projectSlug={params.project_slug}
            teamSlug={params.team_slug}
          />
        </div>
      </header>

      <TabPathLinks
        className="pt-2"
        links={[
          {
            exactMatch: true,
            name: "Engine Instances",
            path: `${linkPrefix}`,
          },
          {
            name: "Import Engine",
            path: `${linkPrefix}/import`,
          },
        ]}
        scrollableClassName="container max-w-7xl"
      />

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
          <Button asChild className="flex items-center gap-2" size="sm">
            <Link
              href={`/team/${props.teamSlug}/${props.projectSlug}/transactions`}
            >
              <EngineIcon className="size-4" /> Try Engine Cloud
            </Link>
          </Button>

          <Button asChild size="sm" variant="outline">
            <Link
              className="gap-2 bg-background"
              href="https://portal.thirdweb.com/engine/v3"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn More <ExternalLinkIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
