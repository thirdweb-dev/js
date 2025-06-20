"use client";
import {
  BellIcon,
  BookTextIcon,
  BoxIcon,
  CoinsIcon,
  HomeIcon,
  SettingsIcon,
  WalletIcon,
} from "lucide-react";
import { FullWidthSidebarLayout } from "@/components/blocks/SidebarLayout";
import { Badge } from "@/components/ui/badge";
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
          exactMatch: true,
          href: layoutPath,
          icon: HomeIcon,
          label: "Overview",
        },
        {
          href: `${layoutPath}/connect/in-app-wallets`,
          icon: WalletIcon,
          label: "In-App Wallets",
        },
        {
          href: `${layoutPath}/connect/account-abstraction`,
          icon: SmartAccountIcon,
          label: "Account Abstraction",
        },
        {
          href: `${layoutPath}/connect/universal-bridge`,
          icon: PayIcon,
          label: "Universal Bridge",
        },
        {
          href: `${layoutPath}/contracts`,
          icon: ContractIcon,
          label: "Contracts",
        },
        {
          href: `${layoutPath}/assets`,
          icon: CoinsIcon,
          label: (
            <span className="flex items-center gap-2">
              Assets <Badge>New</Badge>
            </span>
          ),
        },
        {
          href: `${layoutPath}/engine`,
          icon: EngineIcon,
          label: "Engine",
        },
        {
          href: `${layoutPath}/insight`,
          icon: InsightIcon,
          label: "Insight",
        },
        {
          href: `${layoutPath}/nebula`,
          icon: NebulaIcon,
          label: "Nebula",
        },
        {
          href: `${layoutPath}/webhooks`,
          icon: BellIcon,
          label: (
            <span className="flex items-center gap-2">
              Webhooks <Badge>New</Badge>
            </span>
          ),
        },
      ]}
      footerSidebarLinks={[
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
