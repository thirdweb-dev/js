import { ArrowRightIcon, DownloadIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ImportEngineLink(props: {
  label: string;
  engineLinkPrefix: string;
}) {
  return (
    <Button asChild className="gap-2 bg-card" size="sm" variant="outline">
      <Link href={`${props.engineLinkPrefix}/import`}>
        <DownloadIcon className="size-3" />
        {props.label}
      </Link>
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
        <Button asChild size="sm" variant="outline">
          <Link
            className="gap-2"
            href="https://portal.thirdweb.com/engine"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn More
            <ExternalLinkIcon className="size-3 text-muted-foreground" />
          </Link>
        </Button>

        <Button asChild size="sm" variant="outline">
          <Link className="gap-2" href={`${engineLinkPrefix}/sandbox`}>
            Try Demo Engine
            <ArrowRightIcon className="size-3 text-muted-foreground" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function EngineFooterCard(props: {
  teamSlug: string;
  projectSlug: string;
}) {
  return (
    <div className="relative rounded-lg border p-6">
      <EngineInfoSection
        project_slug={props.projectSlug}
        team_slug={props.teamSlug}
      />
    </div>
  );
}
