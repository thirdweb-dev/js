import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function EngineInfoSection(props: { team_slug: string; project_slug: string }) {
  const engineLinkPrefix = `/team/${props.team_slug}/${props.project_slug}/engine`;

  return (
    <div className="">
      <h3 className="mb-3 font-semibold text-lg tracking-tight">
        What is Engine?
      </h3>

      <ul className="list-disc space-y-1.5 pl-3 text-muted-foreground text-sm">
        <li>Read, write, and deploy contracts at production scale</li>
        <li>
          Reliably parallelize and retry transactions with gas & nonce
          management
        </li>
        <li>Securely manage backend wallets</li>
        <li>Built-in support for account abstraction, relayers, and more</li>
      </ul>

      <div className="mt-5 flex justify-start gap-3">
        <Button
          asChild
          size="sm"
          variant="outline"
          className="rounded-full bg-card"
        >
          <Link
            className="gap-2"
            href="https://portal.thirdweb.com/engine"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn More
            <ArrowUpRightIcon className="size-3.5 text-muted-foreground" />
          </Link>
        </Button>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="rounded-full bg-card"
        >
          <Link className="gap-2" href={`${engineLinkPrefix}/sandbox`}>
            Try Demo Engine
            <ArrowRightIcon className="size-3.5 text-muted-foreground" />
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
