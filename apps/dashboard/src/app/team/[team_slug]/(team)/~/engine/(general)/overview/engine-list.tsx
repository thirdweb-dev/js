"use client";
import { UnorderedList } from "@/components/ui/List/List";
import { Button } from "@/components/ui/button";
import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import { useTrack } from "hooks/analytics/useTrack";
import {
  CloudDownloadIcon,
  ExternalLinkIcon,
  PlusIcon,
  RocketIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import emptyStateHeaderImage from "../../../../../../../../../public/assets/engine/empty-state-header.png";
import { EngineInstancesTable } from "./engine-instances-table";

export const EngineInstancesList = (props: {
  team_slug: string;
  instances: EngineInstance[];
}) => {
  const engineLinkPrefix = `/team/${props.team_slug}/~/engine`;

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="font-bold text-4xl">Engine</h1>
        <div className="flex flex-row gap-2">
          <ImportEngineLink
            label="Import"
            engineLinkPrefix={engineLinkPrefix}
          />
          <CreateEngineLink
            label="Create Engine Instance"
            engineLinkPrefix={engineLinkPrefix}
          />
        </div>
      </div>

      <div className="h-6" />

      <EngineInstancesTable
        instances={props.instances}
        engineLinkPrefix={engineLinkPrefix}
      />

      <div className="h-10" />
      <LearnMoreCard />
    </div>
  );
};

export function NoEngineInstancesPage(props: { team_slug: string }) {
  const engineLinkPrefix = `/team/${props.team_slug}/~/engine`;
  const trackEvent = useTrack();

  return (
    <div className="mx-auto max-w-[600px]">
      <Image alt="Engine hero image" src={emptyStateHeaderImage} />

      <div className="h-6" />

      <h1 className="font-bold text-2xl tracking-tighter md:text-3xl">
        Your scalable web3 backend server
      </h1>

      <div className="h-3" />

      <UnorderedList>
        <li>Read, write, and deploy contracts at production scale</li>
        <li>
          Reliably parallelize and retry transactions with gas & nonce
          management
        </li>
        <li>Securely manage backend wallets</li>
        <li>Built-in support for account abstraction, relayers, and more</li>
      </UnorderedList>

      <div className="h-6" />

      <div className="flex gap-3">
        <CreateEngineLink
          label="Get Started"
          engineLinkPrefix={engineLinkPrefix}
        />

        <Button
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
            Try Demo
            <RocketIcon className="size-4 text-muted-foreground" />
          </Link>
        </Button>
      </div>

      <div className="h-10" />

      <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-6">
        <p className="font-semibold text-lg tracking-tight">
          Already have an Engine Instance?
        </p>

        <ImportEngineLink label="Import" engineLinkPrefix={engineLinkPrefix} />
      </div>

      <div className="h-20" />
      <LearnMoreCard />
    </div>
  );
}

function LearnMoreCard() {
  return (
    <div className="relative rounded-lg border border-border p-4 hover:border-active-border">
      <h3 className="mb-1 font-semibold tracking-tight">
        <Link
          href="https://portal.thirdweb.com/engine"
          target="_blank"
          className="before:content before:absolute before:inset-0"
        >
          Learn more about Engine
        </Link>
      </h3>

      <p className="text-muted-foreground text-sm">
        Dive into features and integration guides.
      </p>

      <ExternalLinkIcon className="absolute top-4 right-4 size-4 text-muted-foreground" />
    </div>
  );
}

function CreateEngineLink(props: {
  label: string;
  engineLinkPrefix: string;
}) {
  const trackEvent = useTrack();

  return (
    <Button
      asChild
      variant="default"
      onClick={() => {
        trackEvent({
          category: "engine",
          action: "click",
          label: "add-engine-instance",
        });
      }}
    >
      <Link href={`${props.engineLinkPrefix}/create`} className="gap-2">
        <PlusIcon className="size-4" />
        {props.label}
      </Link>
    </Button>
  );
}

function ImportEngineLink(props: {
  label: string;
  engineLinkPrefix: string;
}) {
  const trackEvent = useTrack();

  return (
    <Button
      asChild
      variant="outline"
      className="gap-2 bg-card"
      onClick={() => {
        trackEvent({
          category: "engine",
          action: "import",
        });
      }}
    >
      <Link href={`${props.engineLinkPrefix}/import`}>
        <CloudDownloadIcon className="size-4" />
        {props.label}
      </Link>
    </Button>
  );
}
