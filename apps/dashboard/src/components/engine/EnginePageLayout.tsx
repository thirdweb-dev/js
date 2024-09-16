"use client";

import { MobileSidebar } from "@/components/blocks/MobileSidebar";
import { Sidebar, type SidebarLink } from "@/components/blocks/Sidebar";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import {
  type EngineInstance,
  useEngineInstances,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { ArrowLeftIcon, ChevronDownIcon, CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import invariant from "tiny-invariant";
import { EngineVersionBadge } from "./badges/version";
import { useHasEnginePermission } from "./useHasEnginePermission";

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
    pathId: "configuration",
    label: "Configuration",
  },
  {
    pathId: "metrics",
    label: "Metrics",
  },
];

const NEXT_PUBLIC_DEMO_ENGINE_URL = process.env.NEXT_PUBLIC_DEMO_ENGINE_URL;

export function EngineSidebarLayout(props: {
  engineId: string;
  rootPath: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const links: SidebarLink[] = sidebarLinkMeta.map((linkMeta) => {
    return {
      href: `${props.rootPath}/${props.engineId}${linkMeta.pathId === "" ? "" : `/${linkMeta.pathId}`}`,
      label: linkMeta.label,
      exactMatch: true,
      tracking: {
        category: "engine",
        action: "navigate-tab",
        label: linkMeta.label,
      },
    };
  });

  const activeLink = links.find((link) => pathname === link.href);

  return (
    <div className="flex gap-6">
      <Sidebar links={links} />
      <div className="grow max-sm:w-full pt-6 pb-10">
        <MobileSidebar
          links={links}
          trigger={
            <Button
              className="w-full lg:hidden text-left justify-between gap-2 mb-6"
              variant="outline"
            >
              {activeLink?.label || "Connect"}
              <ChevronDownIcon className="size-5 text-muted-foreground" />
            </Button>
          }
        />

        {props.children}
      </div>
    </div>
  );
}

export function WithEngineInstance(props: {
  engineId: string;
  content: React.FC<{ instance: EngineInstance }>;
  rootPath: string;
}) {
  const { data } = useAccount();

  if (props.engineId === "sandbox" && data) {
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
        rootPath={props.rootPath}
      />
    );
  }

  return <QueryAndRenderInstanceHeader {...props} />;
}

function QueryAndRenderInstanceHeader(props: {
  engineId: string;
  content: React.FC<{ instance: EngineInstance }>;
  rootPath: string;
}) {
  const instancesQuery = useEngineInstances();
  const instance = instancesQuery.data?.find((x) => x.id === props.engineId);

  if (instancesQuery.isLoading) {
    return <PageLoading />;
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
    />
  );
}

function EnsurePermissionAndRenderInstance(props: {
  content: React.FC<{ instance: EngineInstance }>;
  instance: EngineInstance;
  rootPath: string;
}) {
  const permissionQuery = useHasEnginePermission({
    instanceUrl: props.instance.url,
  });

  if (permissionQuery.isLoading) {
    return <PageLoading />;
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
    />
  );
}

function RenderEngineInstanceHeader(props: {
  instance: EngineInstance;
  content: React.FC<{ instance: EngineInstance }>;
  rootPath: string;
}) {
  const { instance } = props;

  return (
    <div>
      <div className="flex">
        <Button
          variant="ghost"
          className="px-2 py-1 -translate-x-2 flex items-center gap-2 text-muted-foreground hover:text-foreground h-auto"
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

      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between">
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter">
            {instance.name}
          </h1>

          <div className="h-1" />

          <div className="flex gap-3 items-center">
            {!instance.name.startsWith("https://") && (
              <CopyTextButton
                copyIconPosition="right"
                textToShow={instance.url}
                textToCopy={instance.url}
                tooltip="Copy Engine URL"
                variant="ghost"
                className="px-2 py-1 -translate-x-2 h-auto text-muted-foreground"
              />
            )}
          </div>
        </div>
        <EngineVersionBadge instance={instance} />
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
    <div>
      <Link
        href={props.rootPath}
        className="gap-2 flex items-center text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-5" />
        Back
      </Link>

      <div className="border rounded-lg border-border mt-5">
        <MessageContainer>
          <div className="flex flex-col gap-4 items-center">
            <CircleAlertIcon className="size-16 text-destructive-text" />
            <p className="text-muted-foreground text-center">
              {props.children}
            </p>
          </div>
        </MessageContainer>
      </div>
    </div>
  );
}

function MessageContainer(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[300px] lg:h-[400px] flex items-center justify-center">
      {props.children}
    </div>
  );
}

export function PageLoading() {
  return (
    <MessageContainer>
      <Spinner className="size-10" />
    </MessageContainer>
  );
}
