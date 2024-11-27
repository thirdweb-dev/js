"use client";

import type { SidebarLink } from "@/components/blocks/Sidebar";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import {
  type EngineInstance,
  useEngineInstances,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { ArrowLeftIcon, CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import invariant from "tiny-invariant";
import { useHasEnginePermission } from "./useHasEnginePermission";
import { EngineVersionBadge } from "./version";

const sidebarLinkMeta: Array<{ pathId: string; label: string }> = [
  {
    pathId: "",
    label: "Overview",
  },
  {
    pathId: "explorer",
    label: "Explorer",
  },
  {
    pathId: "relayers",
    label: "Relayers",
  },
  {
    pathId: "contract-subscriptions",
    label: "Contract Subscriptions",
  },
  {
    pathId: "admins",
    label: "Admins",
  },
  {
    pathId: "access-tokens",
    label: "Access Tokens",
  },
  {
    pathId: "webhooks",
    label: "Webhooks",
  },
  {
    pathId: "metrics",
    label: "Metrics",
  },
  {
    pathId: "alerts",
    label: "Alerts",
  },
  {
    pathId: "configuration",
    label: "Configuration",
  },
];

const NEXT_PUBLIC_DEMO_ENGINE_URL = process.env.NEXT_PUBLIC_DEMO_ENGINE_URL;

export function EngineSidebarLayout(props: {
  engineId: string;
  teamSlug: string;
  children: React.ReactNode;
}) {
  const rootPath = `/team/${props.teamSlug}/~/engine`;

  const links: SidebarLink[] = sidebarLinkMeta.map((linkMeta) => {
    return {
      href: `${rootPath}/${props.engineId}${linkMeta.pathId === "" ? "" : `/${linkMeta.pathId}`}`,
      label: linkMeta.label,
      exactMatch: true,
      tracking: {
        category: "engine",
        action: "navigate-tab",
        label: linkMeta.label,
      },
    };
  });

  return <SidebarLayout sidebarLinks={links}>{props.children}</SidebarLayout>;
}

// TODO - move this to layout.tsx and util functions

export function WithEngineInstance(props: {
  engineId: string;
  content: React.FC<{ instance: EngineInstance }>;
  teamSlug: string;
}) {
  const { data } = useAccount();
  const rootPath = `/team/${props.teamSlug}/~/engine`;

  if (!data) {
    return <GenericLoadingPage />;
  }

  if (props.engineId === "sandbox") {
    invariant(
      NEXT_PUBLIC_DEMO_ENGINE_URL,
      "missing NEXT_PUBLIC_DEMO_ENGINE_URL",
    );

    const sandboxEngine: EngineInstance = {
      id: "sandbox",
      url: NEXT_PUBLIC_DEMO_ENGINE_URL,
      name: "Demo Engine",
      status: "active",
      lastAccessedAt: new Date().toISOString(),
      accountId: data?.id,
    };

    return (
      <RenderEngineInstanceHeader
        instance={sandboxEngine}
        content={props.content}
        rootPath={rootPath}
        teamSlug={props.teamSlug}
      />
    );
  }

  return (
    <QueryAndRenderInstanceHeader
      content={props.content}
      engineId={props.engineId}
      rootPath={rootPath}
      teamSlug={props.teamSlug}
    />
  );
}

function QueryAndRenderInstanceHeader(props: {
  engineId: string;
  content: React.FC<{ instance: EngineInstance }>;
  rootPath: string;
  teamSlug: string;
}) {
  const instancesQuery = useEngineInstances();
  const instance = instancesQuery.data?.find((x) => x.id === props.engineId);

  if (instancesQuery.isPending) {
    return <GenericLoadingPage />;
  }

  if (!instance) {
    return (
      <EngineErrorPage rootPath={props.rootPath}>
        Engine Instance Not Found
      </EngineErrorPage>
    );
  }

  return (
    <EnsurePermissionAndRenderInstance
      instance={instance}
      content={props.content}
      rootPath={props.rootPath}
      teamSlug={props.teamSlug}
    />
  );
}

function EnsurePermissionAndRenderInstance(props: {
  content: React.FC<{ instance: EngineInstance }>;
  instance: EngineInstance;
  rootPath: string;
  teamSlug: string;
}) {
  const permissionQuery = useHasEnginePermission({
    instanceUrl: props.instance.url,
  });

  if (permissionQuery.isPending) {
    return <GenericLoadingPage />;
  }

  if (permissionQuery.error instanceof Error) {
    if (permissionQuery.error.message.includes("Failed to fetch")) {
      return (
        <EngineErrorPage rootPath={props.rootPath}>
          <p>Unable to connect to Engine</p>
          <p>Ensure that your Engine is publicly accessible</p>
        </EngineErrorPage>
      );
    }

    return (
      <EngineErrorPage rootPath={props.rootPath}>
        <p>There was an unexpected error reaching your Engine instance</p>
        <p>Try again or contact us if this issue persists.</p>
      </EngineErrorPage>
    );
  }

  if (
    permissionQuery.data &&
    permissionQuery.data.hasPermission === false &&
    permissionQuery.data.reason === "Unauthorized"
  ) {
    return (
      <div>
        You are not an admin for this Engine instance. Contact the owner to add
        your wallet as an admin
      </div>
    );
  }

  return (
    <RenderEngineInstanceHeader
      rootPath={props.rootPath}
      instance={props.instance}
      content={props.content}
      teamSlug={props.teamSlug}
    />
  );
}

function RenderEngineInstanceHeader(props: {
  instance: EngineInstance;
  content: React.FC<{ instance: EngineInstance }>;
  rootPath: string;
  teamSlug: string;
}) {
  const { instance } = props;

  return (
    <div>
      <div className="flex">
        <Button
          variant="ghost"
          className="-translate-x-2 flex h-auto items-center gap-2 px-2 py-1 text-muted-foreground hover:text-foreground"
        >
          <Link
            href={props.rootPath}
            aria-label="Go Back"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" /> Back
          </Link>
        </Button>
      </div>

      <div className="h-5" />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-semibold text-3xl tracking-tighter md:text-5xl">
            {instance.name}
          </h1>

          <div className="h-1" />

          <div className="flex items-center gap-3">
            {!instance.name.startsWith("https://") && (
              <CopyTextButton
                copyIconPosition="right"
                textToShow={instance.url}
                textToCopy={instance.url}
                tooltip="Copy Engine URL"
                variant="ghost"
                className="-translate-x-2 h-auto px-2 py-1 text-muted-foreground"
              />
            )}
          </div>
        </div>
        <EngineVersionBadge instance={instance} teamSlug={props.teamSlug} />
      </div>

      <div className="h-5" />
      <Separator />
      <div className="h-10 " />

      <props.content instance={instance} />
    </div>
  );
}

function EngineErrorPage(props: {
  children: React.ReactNode;
  rootPath: string;
}) {
  return (
    <div className="flex grow flex-col">
      <Link
        href={props.rootPath}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-5" />
        Back
      </Link>

      <div className="mt-5 flex min-h-[300px] grow flex-col items-center justify-center rounded-lg border border-border px-4 lg:min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <CircleAlertIcon className="size-16 text-destructive-text" />
          <div className="text-center text-muted-foreground">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}
