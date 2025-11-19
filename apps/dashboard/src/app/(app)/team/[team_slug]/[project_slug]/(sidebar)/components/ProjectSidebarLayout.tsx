"use client";
import { Badge } from "@workspace/ui/components/badge";
import {
  BotIcon,
  DatabaseIcon,
  DoorOpenIcon,
  HomeIcon,
  Settings2Icon,
  WebhookIcon,
} from "lucide-react";
import {
  FullWidthSidebarLayout,
  type ShadcnSidebarLink,
} from "@/components/blocks/full-width-sidebar-layout";
import { BridgeIcon } from "@/icons/BridgeIcon";
import { ContractIcon } from "@/icons/ContractIcon";
import { PayIcon } from "@/icons/PayIcon";
import { TokenIcon } from "@/icons/TokenIcon";
import { WalletProductIcon } from "@/icons/WalletProductIcon";

export function ProjectSidebarLayout(props: {
  layoutPath: string;
  children: React.ReactNode;
  hasEngines: boolean;
  showContracts: boolean;
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
    ...(props.showContracts
      ? [
          {
            href: `${props.layoutPath}/contracts`,
            icon: ContractIcon,
            label: "Contracts",
          },
        ]
      : []),
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
    {
      href: `${props.layoutPath}/ai`,
      icon: BotIcon,
      label: "AI",
    },
    {
      subMenu: {
        icon: DoorOpenIcon,
        label: "Gateway",
      },
      links: [
        {
          href: `${props.layoutPath}/gateway/rpc`,
          label: "RPC",
        },
        {
          href: `${props.layoutPath}/gateway/indexer`,
          label: "Indexer",
        },
      ],
    },
    // only show engine link if there the user already has an engine instance
    ...(props.hasEngines
      ? [
          {
            href: `${props.layoutPath}/engine`,
            icon: DatabaseIcon,
            label: "Engine",
          },
        ]
      : []),
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
