"use client";
import { FullWidthSidebarLayout } from "@/components/blocks/SidebarLayout";
import { Badge } from "@/components/ui/badge";
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
import { ContractIcon } from "../../../../../(dashboard)/(chain)/components/server/icons/ContractIcon";
import { InsightIcon } from "../../../../../(dashboard)/(chain)/components/server/icons/InsightIcon";
import { PayIcon } from "../../../../../(dashboard)/(chain)/components/server/icons/PayIcon";
import { SmartAccountIcon } from "../../../../../(dashboard)/(chain)/components/server/icons/SmartAccountIcon";

export function ProjectSidebarLayout(props: {
  layoutPath: string;
  children: React.ReactNode;
}) {
  const { layoutPath, children } = props;

  return (
    <FullWidthSidebarLayout
      contentSidebarLinks={[
        {
          href: layoutPath,
          exactMatch: true,
          label: "Overview",
          icon: HomeIcon,
        },
        {
          label: "Wallets",
          href: `${layoutPath}/wallets`,
          icon: WalletIcon,
        },
        {
          label: "Account Abstraction",
          href: `${layoutPath}/account-abstraction`,
          icon: SmartAccountIcon,
        },
        {
          href: `${layoutPath}/universal-bridge`,
          icon: PayIcon,
          label: "Universal Bridge",
        },
        {
          href: `${layoutPath}/contracts`,
          label: "Contracts",
          icon: ContractIcon,
        },
        {
          href: `${layoutPath}/tokens`,
          label: (
            <span className="flex items-center gap-2">
              Tokens <Badge>New</Badge>
            </span>
          ),
          icon: CoinsIcon,
        },
        {
          href: `${layoutPath}/engine`,
          label: "Transactions",
          icon: ArrowLeftRightIcon,
        },
        {
          href: `${layoutPath}/insight`,
          label: "Insight",
          icon: InsightIcon,
        },
        {
          href: `${layoutPath}/vault`,
          label: "Vault",
          icon: LockIcon,
        },
      ]}
      footerSidebarLinks={[
        {
          href: `${layoutPath}/webhooks`,
          label: (
            <span className="flex items-center gap-2">
              Webhooks <Badge>New</Badge>
            </span>
          ),
          icon: BellIcon,
        },
        {
          href: `${layoutPath}/settings`,
          label: "Project Settings",
          icon: SettingsIcon,
        },
        {
          separator: true,
        },
        {
          href: "https://portal.thirdweb.com",
          label: "Documentation",
          icon: BookTextIcon,
        },
        {
          href: "https://playground.thirdweb.com/connect/sign-in/button",
          label: "Playground",
          icon: BoxIcon,
        },
      ]}
    >
      {children}
    </FullWidthSidebarLayout>
  );
}
