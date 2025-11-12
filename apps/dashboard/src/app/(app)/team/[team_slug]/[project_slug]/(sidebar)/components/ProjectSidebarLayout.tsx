"use client";
import { Badge } from "@workspace/ui/components/badge";
import {
  BookTextIcon,
  BoxIcon,
  DatabaseIcon,
  HomeIcon,
  RssIcon,
  Settings2Icon,
  WebhookIcon,
} from "lucide-react";
import {
  FullWidthSidebarLayout,
  type ShadcnSidebarLink,
} from "@/components/blocks/full-width-sidebar-layout";
import { BridgeIcon } from "@/icons/BridgeIcon";
import { ContractIcon } from "@/icons/ContractIcon";
import { InsightIcon } from "@/icons/InsightIcon";
import { NebulaIcon } from "@/icons/NebulaIcon";
import { PayIcon } from "@/icons/PayIcon";
import { TokenIcon } from "@/icons/TokenIcon";
import { WalletProductIcon } from "@/icons/WalletProductIcon";

export function ProjectSidebarLayout(props: {
  layoutPath: string;
  children: React.ReactNode;
}) {
  const contentSidebarLinks = [
    {
      exactMatch: true,
      href: props.layoutPath,
      icon: HomeIcon,
      label: "Overview",
    },
    {
      separator: true,
    },
    {
      group: "Build",
      links: [
        {
          subMenu: {
            icon: WalletProductIcon,
            label: "Wallets",
          },
          links: [
            {
              href: `${props.layoutPath}/wallets/user-wallets`,
              label: "User Wallets",
            },
            {
              href: `${props.layoutPath}/wallets/server-wallets`,
              label: "Server Wallets",
            },
            {
              href: `${props.layoutPath}/wallets/sponsored-gas`,
              label: "Gas Sponsorship",
            },
          ],
        },
        {
          href: `${props.layoutPath}/contracts`,
          icon: ContractIcon,
          label: "Contracts",
        },
        {
          href: `${props.layoutPath}/ai`,
          icon: NebulaIcon,
          label: "AI",
        },
      ],
    },
    {
      separator: true,
    },
    {
      group: "Monetize",
      links: [
        {
          href: `${props.layoutPath}/x402`,
          icon: PayIcon,
          label: (
            <span className="flex items-center gap-2">
              x402 <Badge>New</Badge>
            </span>
          ),
        },
        {
          href: `${props.layoutPath}/bridge`,
          icon: BridgeIcon,
          label: "Bridge",
        },
        {
          href: `${props.layoutPath}/tokens`,
          icon: TokenIcon,
          label: "Tokens",
        },
      ],
    },
    {
      separator: true,
    },
    {
      group: "Scale",
      links: [
        {
          href: `${props.layoutPath}/insight`,
          icon: InsightIcon,
          label: "Insight",
        },
        {
          href: `${props.layoutPath}/rpc`,
          icon: RssIcon,
          label: "RPC",
        },
        // linkely want to move this to `team` level eventually
        {
          href: `${props.layoutPath}/engine`,
          icon: DatabaseIcon,
          label: "Engine",
        },
      ],
    },
  ] satisfies ShadcnSidebarLink[];

  const footerSidebarLinks = [
    {
      separator: true,
    },
    {
      href: `${props.layoutPath}/webhooks/contracts`,
      icon: WebhookIcon,
      isActive: (pathname) => {
        return pathname.startsWith(`${props.layoutPath}/webhooks`);
      },
      label: "Webhooks",
    },
    {
      href: `${props.layoutPath}/settings`,
      icon: Settings2Icon,
      label: "Project Settings",
    },
    {
      separator: true,
    },
    {
      href: "https://portal.thirdweb.com",
      icon: BookTextIcon,
      label: "Documentation",
    },
    {
      href: "https://playground.thirdweb.com/wallets/sign-in/button",
      icon: BoxIcon,
      label: "Playground",
    },
  ] satisfies ShadcnSidebarLink[];

  return (
    <FullWidthSidebarLayout
      contentSidebarLinks={contentSidebarLinks}
      footerSidebarLinks={footerSidebarLinks}
    >
      {props.children}
    </FullWidthSidebarLayout>
  );
}
