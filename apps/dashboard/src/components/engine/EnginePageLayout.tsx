import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { ArrowLeftIcon, CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import invariant from "tiny-invariant";
import { CopyTextButton } from "../../@/components/ui/CopyTextButton";
import { Button } from "../../@/components/ui/button";
import { Separator } from "../../@/components/ui/separator";
import { useDashboardRouter } from "../../@/lib/DashboardRouter";
import {
  type EngineInstance,
  useEngineInstances,
} from "../../@3rdweb-sdk/react/hooks/useEngine";
import { SidebarNav } from "../../core-ui/sidebar/nav";
import type { Route } from "../../core-ui/sidebar/types";
import { useTrack } from "../../hooks/analytics/useTrack";
import { EngineVersionBadge } from "./badges/version";
import { useHasEnginePermission } from "./useHasEnginePermission";

export type ActivePage =
  | "overview"
  | "explorer"
  | "relayers"
  | "contract-subscriptions"
  | "admins"
  | "access-tokens"
  | "webhooks"
  | "configuration"
  | "metrics";

const NEXT_PUBLIC_DEMO_ENGINE_URL = process.env.NEXT_PUBLIC_DEMO_ENGINE_URL;

export function EnginePageLayout(props: {
  engineId: string;
  activePage: ActivePage;
  content: React.FC<{ instance: EngineInstance }>;
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
      <RenderInstance
        instance={sandboxEngine}
        activePage={props.activePage}
        content={props.content}
      />
    );
  }

  return <QueryAndRenderInstance {...props} />;
}

function QueryAndRenderInstance(props: {
  activePage: ActivePage;
  engineId: string;
  content: React.FC<{ instance: EngineInstance }>;
}) {
  const instancesQuery = useEngineInstances();
  const instance = instancesQuery.data?.find((x) => x.id === props.engineId);

  if (instancesQuery.isLoading) {
    return <PageLoading />;
  }

  if (!instance) {
    return <EngineErrorPage>Engine Instance Not Found</EngineErrorPage>;
  }

  return (
    <EnsurePermissionAndRenderInstance
      instance={instance}
      activePage={props.activePage}
      content={props.content}
    />
  );
}

function EnsurePermissionAndRenderInstance(props: {
  activePage: ActivePage;
  content: React.FC<{ instance: EngineInstance }>;
  instance: EngineInstance;
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
        <EngineErrorPage>
          <p>Unable to connect to Engine</p>

          <p>Ensure that your Engine is publicly accessible</p>
        </EngineErrorPage>
      );
    }

    return (
      <EngineErrorPage>
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
    <RenderInstance
      instance={props.instance}
      activePage={props.activePage}
      content={props.content}
    />
  );
}

function RenderInstance(props: {
  instance: EngineInstance;
  activePage: ActivePage;
  content: React.FC<{ instance: EngineInstance }>;
}) {
  const { instance, activePage } = props;
  const router = useDashboardRouter();
  const trackEvent = useTrack();

  const handleClick = useCallback(
    (id: ActivePage) => {
      trackEvent({
        category: "engine",
        action: "navigate-tab",
        label: id,
        url: instance.url,
      });
      if (id === "overview") {
        router.push(`/dashboard/engine/${instance.id}`);
      } else {
        router.push(`/dashboard/engine/${instance.id}/${id}`);
      }
    },
    [instance.url, instance.id, trackEvent, router],
  );

  const links = useMemo(
    () =>
      [
        {
          path: `/dashboard/engine/${instance.id}`,
          title: "Overview",
          name: "overview",
          onClick: () => handleClick("overview"),
        },
        {
          path: `/dashboard/engine/${instance.id}/explorer`,
          title: "Explorer",
          name: "explorer",
          onClick: () => handleClick("explorer"),
        },
        {
          path: `/dashboard/engine/${instance.id}/relayers`,
          title: "Relayers",
          name: "relayers",
          onClick: () => handleClick("relayers"),
        },
        {
          path: `/dashboard/engine/${instance.id}/contract-subscriptions`,
          title: "Contract Subscriptions",
          name: "contract-subscriptions",
          onClick: () => handleClick("contract-subscriptions"),
        },
        {
          path: `/dashboard/engine/${instance.id}/admins`,
          title: "Admins",
          name: "admins",
          onClick: () => handleClick("admins"),
        },
        {
          path: `/dashboard/engine/${instance.id}/access-tokens`,
          title: "Access Tokens",
          name: "access-tokens",
          onClick: () => handleClick("access-tokens"),
        },
        {
          path: `/dashboard/engine/${instance.id}/webhooks`,
          title: "Webhooks",
          name: "webhooks",
          onClick: () => handleClick("webhooks"),
        },
        {
          path: `/dashboard/engine/${instance.id}/configuration`,
          title: "Configuration",
          name: "configuration",
          onClick: () => handleClick("configuration"),
        },
        {
          path: `/dashboard/engine/${instance.id}/metrics`,
          title: "Metrics",
          name: "metrics",
          onClick: () => handleClick("metrics"),
        },
      ] satisfies Route[],
    [handleClick, instance.id],
  );

  return (
    <>
      <SidebarNav links={links} activePage={activePage} title="Engine" />

      <div className="flex">
        <Button
          variant="ghost"
          className="px-2 py-1 -translate-x-2 flex items-center gap-2 text-muted-foreground hover:text-foreground h-auto"
        >
          <Link
            href="/dashboard/engine"
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
    </>
  );
}

function EngineErrorPage(props: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Link
        href="/dashboard/engine"
        className="gap-2 flex items-center text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-5" />
        Back
      </Link>

      <div className="border rounded-lg border-border mt-5">
        <MessageContainer>
          <div className="flex flex-col gap-4 items-center">
            <CircleAlertIcon className="size-16 text-destructive-text" />
            <p className="text-secondary-foreground text-center">
              {props.children}
            </p>
          </div>
        </MessageContainer>
      </div>
    </div>
  );
}

export function MessageContainer(props: {
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
