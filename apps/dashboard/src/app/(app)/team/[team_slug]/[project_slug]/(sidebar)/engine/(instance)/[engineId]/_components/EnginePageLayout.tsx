import type { SidebarLink } from "@/components/blocks/Sidebar";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";

const sidebarLinkMeta: Array<{ pathId: string; label: string }> = [
  {
    label: "Overview",
    pathId: "",
  },
  {
    label: "Explorer",
    pathId: "explorer",
  },
  {
    label: "Relayers",
    pathId: "relayers",
  },
  {
    label: "Contract Subscriptions",
    pathId: "contract-subscriptions",
  },
  {
    label: "Admins",
    pathId: "admins",
  },
  {
    label: "Access Tokens",
    pathId: "access-tokens",
  },
  {
    label: "Webhooks",
    pathId: "webhooks",
  },
  {
    label: "Metrics",
    pathId: "metrics",
  },
  {
    label: "Alerts",
    pathId: "alerts",
  },
  {
    label: "Wallet Credentials",
    pathId: "wallet-credentials",
  },
  {
    label: "Configuration",
    pathId: "configuration",
  },
];

export function EngineSidebarLayout(props: {
  engineId: string;
  teamSlug: string;
  projectSlug: string;
  children: React.ReactNode;
}) {
  const rootPath = `/team/${props.teamSlug}/${props.projectSlug}/engine`;

  const links: SidebarLink[] = sidebarLinkMeta.map((linkMeta) => {
    return {
      exactMatch: true,
      href: `${rootPath}/${props.engineId}${linkMeta.pathId === "" ? "" : `/${linkMeta.pathId}`}`,
      label: linkMeta.label,
      tracking: {
        action: "navigate-tab",
        category: "engine",
        label: linkMeta.label,
      },
    };
  });

  return <SidebarLayout sidebarLinks={links}>{props.children}</SidebarLayout>;
}
