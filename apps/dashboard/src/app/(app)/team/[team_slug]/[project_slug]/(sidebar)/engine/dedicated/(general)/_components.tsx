import type { Team } from "@/api/team";
import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { ArrowRightIcon, DownloadIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

export function ImportEngineLink(props: {
  label: string;
  engineLinkPrefix: string;
}) {
  return (
    <Button asChild variant="outline" size="sm" className="gap-2 bg-card">
      <TrackedLinkTW
        href={`${props.engineLinkPrefix}/import`}
        category="engine"
        trackingProps={{
          action: "import",
        }}
      >
        <DownloadIcon className="size-3" />
        {props.label}
      </TrackedLinkTW>
    </Button>
  );
}

function EngineInfoSection(props: { team_slug: string; project_slug: string }) {
  const engineLinkPrefix = `/team/${props.team_slug}/${props.project_slug}/engine/dedicated`;

  return (
    <div className="">
      <h3 className="mb-1 font-semibold text-lg tracking-tight">
        What is Engine?
      </h3>

      <ul className="list-disc space-y-2 pl-3 text-muted-foreground text-sm">
        <li>Read, write, and deploy contracts at production scale</li>
        <li>
          Reliably parallelize and retry transactions with gas & nonce
          management
        </li>
        <li>Securely manage backend wallets</li>
        <li>Built-in support for account abstraction, relayers, and more</li>
      </ul>

      <div className="mt-4 flex justify-start gap-3">
        <Button asChild variant="outline" size="sm">
          <Link
            href="https://portal.thirdweb.com/engine"
            className="gap-2"
            target="_blank"
          >
            Learn More
            <ExternalLinkIcon className="size-3 text-muted-foreground" />
          </Link>
        </Button>

        <Button size="sm" asChild variant="outline">
          <TrackedLinkTW
            href={`${engineLinkPrefix}/sandbox`}
            className="gap-2"
            category="engine"
            label="click-try-demo"
            trackingProps={{
              action: "try-demo",
            }}
          >
            Try Demo Engine
            <ArrowRightIcon className="size-3 text-muted-foreground" />
          </TrackedLinkTW>
        </Button>
      </div>
    </div>
  );
}

export function EngineFooterCard(props: {
  teamPlan: Team["billingPlan"];
  team_slug: string;
  project_slug: string;
}) {
  return (
    <div className="relative rounded-lg border p-6">
      <EngineInfoSection
        team_slug={props.team_slug}
        project_slug={props.project_slug}
      />
    </div>
  );
}
