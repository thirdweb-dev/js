"use client";
import { FullWidthSidebarLayout } from "@/components/blocks/SidebarLayout";
import { Badge } from "@/components/ui/badge";
import {
  BellIcon,
  BookTextIcon,
  BoxIcon,
  CoinsIcon,
  HomeIcon,
  SettingsIcon,
  WalletIcon,
} from "lucide-react";
import { ContractIcon } from "../../../../../(dashboard)/(chain)/components/server/icons/ContractIcon";
import { EngineIcon } from "../../../../../(dashboard)/(chain)/components/server/icons/EngineIcon";
import { InsightIcon } from "../../../../../(dashboard)/(chain)/components/server/icons/InsightIcon";
import { NebulaIcon } from "../../../../../(dashboard)/(chain)/components/server/icons/NebulaIcon";
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
          label: "In-App Wallets",
          href: `${layoutPath}/connect/in-app-wallets`,
          icon: WalletIcon,
        },
        {
          label: "Account Abstraction",
          href: `${layoutPath}/connect/account-abstraction`,
          icon: SmartAccountIcon,
        },
        {
          href: `${layoutPath}/connect/universal-bridge`,
          icon: PayIcon,
          label: "Universal Bridge",
        },
        {
          href: `${layoutPath}/contracts`,
          label: "Contracts",
          icon: ContractIcon,
        },
        {
          href: `${layoutPath}/assets`,
          label: (
            <span className="flex items-center gap-2">
              Assets <Badge>New</Badge>
            </span>
          ),
          icon: CoinsIcon,
        },
        {
          href: `${layoutPath}/engine`,
          label: "Engine",
          icon: EngineIcon,
        },
        {
          href: `${layoutPath}/insight`,
          label: "Insight",
          icon: InsightIcon,
        },
        {
          href: `${layoutPath}/nebula`,
          label: "Nebula",
          icon: NebulaIcon,
        },
        {
          href: `${layoutPath}/webhooks`,
          label: (
            <span className="flex items-center gap-2">
              Webhooks <Badge>New</Badge>
            </span>
          ),
          icon: BellIcon,
        },
      ]}
      footerSidebarLinks={[
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
