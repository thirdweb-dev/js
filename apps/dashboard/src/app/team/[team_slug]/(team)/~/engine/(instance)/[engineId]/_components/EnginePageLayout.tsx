import type { SidebarLink } from "@/components/blocks/Sidebar";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";

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
