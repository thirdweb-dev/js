"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  DownloadIcon,
  ExternalLinkIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useTrack } from "../../../../../../../hooks/analytics/useTrack";

export function CreateEngineLink(props: {
  label: string;
  engineLinkPrefix: string;
}) {
  const trackEvent = useTrack();

  return (
    <Button
      asChild
      variant="default"
      size="sm"
      onClick={() => {
        trackEvent({
          category: "engine",
          action: "click",
          label: "add-engine-instance",
        });
      }}
    >
      <Link href={`${props.engineLinkPrefix}/create`} className="gap-2">
        <PlusIcon className="size-3" />
        {props.label}
      </Link>
    </Button>
  );
}

export function ImportEngineLink(props: {
  label: string;
  engineLinkPrefix: string;
}) {
  const trackEvent = useTrack();

  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="gap-2 bg-card"
      onClick={() => {
        trackEvent({
          category: "engine",
          action: "import",
        });
      }}
    >
      <Link href={`${props.engineLinkPrefix}/import`}>
        <DownloadIcon className="size-3" />
        {props.label}
      </Link>
    </Button>
  );
}

export function EngineInfoCard(props: { team_slug: string }) {
  const engineLinkPrefix = `/team/${props.team_slug}/~/engine`;
  const trackEvent = useTrack();

  return (
    <div className=" rounded-lg border border-border bg-card">
      <div className="p-6">
        <h1 className="font-semibold text-xl tracking-tight">
          Your scalable web3 backend server
        </h1>

        <div className="h-2" />

        <ul className="list-disc space-y-2 pl-3 text-muted-foreground text-sm">
          <li>Read, write, and deploy contracts at production scale</li>
          <li>
            Reliably parallelize and retry transactions with gas & nonce
            management
          </li>
          <li>Securely manage backend wallets</li>
          <li>Built-in support for account abstraction, relayers, and more</li>
        </ul>
      </div>

      <div className="flex justify-end gap-3 border-border border-t p-4 lg:px-6">
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

        <Button
          size="sm"
          asChild
          onClick={() => {
            trackEvent({
              category: "engine",
              action: "try-demo",
              label: "clicked-try-demo",
            });
          }}
          variant="outline"
        >
          <Link href={`${engineLinkPrefix}/sandbox`} className="gap-2">
            Try Demo Engine
            <ArrowRightIcon className="size-3 text-muted-foreground" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
