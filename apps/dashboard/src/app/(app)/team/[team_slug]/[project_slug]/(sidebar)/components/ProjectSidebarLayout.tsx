"use client";
import {
  ArrowLeftRightIcon,
  BookTextIcon,
  BoxIcon,
  DatabaseIcon,
  HomeIcon,
  LockIcon,
  RssIcon,
  SettingsIcon,
  WebhookIcon,
} from "lucide-react";
import { FullWidthSidebarLayout } from "@/components/blocks/full-width-sidebar-layout";
import { Badge } from "@/components/ui/badge";
import { ContractIcon } from "@/icons/ContractIcon";
import { InsightIcon } from "@/icons/InsightIcon";
import { NebulaIcon } from "@/icons/NebulaIcon";
import { PayIcon } from "@/icons/PayIcon";
import { SmartAccountIcon } from "@/icons/SmartAccountIcon";
import { TokenIcon } from "@/icons/TokenIcon";
import { WalletProductIcon } from "@/icons/WalletProductIcon";

export function ProjectSidebarLayout(props: {
  layoutPath: string;
  children: React.ReactNode;
  hasEngineInstances: boolean;
}) {
  return (
    <FullWidthSidebarLayout
      contentSidebarLinks={[
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
              href: `${props.layoutPath}/wallets`,
              icon: WalletProductIcon,
              label: "Wallets",
            },
            {
              href: `${props.layoutPath}/transactions`,
              icon: ArrowLeftRightIcon,
              label: "Transactions",
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
              href: `${props.layoutPath}/payments`,
              icon: PayIcon,
              label: "Payments",
            },
            {
              href: `${props.layoutPath}/tokens`,
              icon: TokenIcon,
              label: (
                <span className="flex items-center gap-2">
                  Tokens <Badge>New</Badge>
                </span>
              ),
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
              href: `${props.layoutPath}/account-abstraction`,
              icon: SmartAccountIcon,
              label: "Account Abstraction",
            },
            {
              href: `${props.layoutPath}/rpc`,
              icon: RssIcon,
              label: "RPC",
            },
            {
              href: `${props.layoutPath}/vault`,
              icon: LockIcon,
              label: "Vault",
            },
            ...(props.hasEngineInstances
              ? [
                  {
                    href: `${props.layoutPath}/engine`,
                    icon: DatabaseIcon,
                    label: (
                      <span className="flex items-center gap-2">Engine</span>
                    ),
                  },
                ]
              : []),
          ],
        },
      ]}
      footerSidebarLinks={[
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
          icon: SettingsIcon,
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
          href: "https://playground.thirdweb.com/connect/sign-in/button",
          icon: BoxIcon,
          label: "Playground",
        },
      ]}
    >
      {props.children}
    </FullWidthSidebarLayout>
  );
}
