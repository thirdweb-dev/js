"use client";
import {
  ArrowLeftRightIcon,
  BellIcon,
  BookTextIcon,
  BoxIcon,
  CoinsIcon,
  HomeIcon,
  LockIcon,
  SettingsIcon,
  WalletIcon,
} from "lucide-react";
import { FullWidthSidebarLayout } from "@/components/blocks/SidebarLayout";
import { Badge } from "@/components/ui/badge";
import { ContractIcon } from "@/icons/ContractIcon";
import { InsightIcon } from "@/icons/InsightIcon";
import { PayIcon } from "@/icons/PayIcon";
import { SmartAccountIcon } from "@/icons/SmartAccountIcon";

export function ProjectSidebarLayout(props: {
  layoutPath: string;
  engineLinkType: "cloud" | "dedicated";
  children: React.ReactNode;
}) {
  const { layoutPath, engineLinkType, children } = props;

  return (
    <FullWidthSidebarLayout
      contentSidebarLinks={[
        {
          exactMatch: true,
          href: layoutPath,
          icon: HomeIcon,
          label: "Overview",
        },
        {
          href: `${layoutPath}/wallets`,
          icon: WalletIcon,
          label: "Wallets",
        },
        {
          href: `${layoutPath}/account-abstraction`,
          icon: SmartAccountIcon,
          label: "Account Abstraction",
        },
        {
          href: `${layoutPath}/universal-bridge`,
          icon: PayIcon,
          label: "Universal Bridge",
        },
        {
          href: `${layoutPath}/contracts`,
          icon: ContractIcon,
          label: "Contracts",
        },
        {
          href: `${layoutPath}/tokens`,
          icon: CoinsIcon,
          label: (
            <span className="flex items-center gap-2">
              Tokens <Badge>New</Badge>
            </span>
          ),
        },
        {
          href:
            engineLinkType === "cloud"
              ? `${layoutPath}/transactions`
              : `${layoutPath}/engine/dedicated`,
          icon: ArrowLeftRightIcon,
          isActive: (pathname) => {
            return (
              pathname.startsWith(`${layoutPath}/transactions`) ||
              pathname.startsWith(`${layoutPath}/engine/dedicated`)
            );
          },
          label: "Transactions",
        },
        {
          href: `${layoutPath}/insight`,
          icon: InsightIcon,
          label: "Insight",
        },
        {
          href: `${layoutPath}/vault`,
          icon: LockIcon,
          label: "Vault",
        },
      ]}
      footerSidebarLinks={[
        {
          href: `${layoutPath}/webhooks`,
          icon: BellIcon,
          label: (
            <span className="flex items-center gap-2">
              Webhooks <Badge>New</Badge>
            </span>
          ),
        },
        {
          href: `${layoutPath}/settings`,
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
      {children}
    </FullWidthSidebarLayout>
  );
}
