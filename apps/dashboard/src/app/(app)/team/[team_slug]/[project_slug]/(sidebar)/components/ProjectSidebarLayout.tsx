"use client";
import { FullWidthSidebarLayout } from "@/components/blocks/SidebarLayout";
import { Badge } from "@/components/ui/badge";
import {
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
import { PayIcon } from "../../../../../(dashboard)/(chain)/components/server/icons/PayIcon";
import { SmartAccountIcon } from "../../../../../(dashboard)/(chain)/components/server/icons/SmartAccountIcon";
import { NebulaIcon } from "../../../../../../nebula-app/(app)/icons/NebulaIcon";

export function ProjectSidebarLayout(props: {
  layoutPath: string;
  children: React.ReactNode;
}) {
  const { layoutPath, children } = props;

  const tracking = (label: string) => ({
    category: "project-sidebar",
    action: "click",
    label,
  });

  return (
    <FullWidthSidebarLayout
      contentSidebarLinks={[
        {
          href: layoutPath,
          exactMatch: true,
          label: "Overview",
          icon: HomeIcon,
          tracking: tracking("overview"),
        },
        {
          label: "In-App Wallets",
          href: `${layoutPath}/connect/in-app-wallets`,
          icon: WalletIcon,
          tracking: tracking("in-app-wallets"),
        },
        {
          label: "Account Abstraction",
          href: `${layoutPath}/connect/account-abstraction`,
          icon: SmartAccountIcon,
          tracking: tracking("account-abstraction"),
        },
        {
          href: `${layoutPath}/connect/universal-bridge`,
          icon: PayIcon,
          label: "Universal Bridge",
          tracking: tracking("universal-bridge"),
        },
        {
          href: `${layoutPath}/contracts`,
          label: "Contracts",
          icon: ContractIcon,
          tracking: tracking("contracts"),
        },
        {
          href: `${layoutPath}/assets`,
          label: (
            <span className="flex items-center gap-2">
              Assets <Badge>New</Badge>
            </span>
          ),
          icon: CoinsIcon,
          tracking: tracking("assets"),
        },
        {
          href: `${layoutPath}/engine`,
          label: (
            <span className="flex items-center gap-2">
              Engine <Badge>New</Badge>
            </span>
          ),
          icon: EngineIcon,
          tracking: tracking("engine"),
        },
        {
          href: `${layoutPath}/insight`,
          label: "Insight",
          icon: InsightIcon,
          tracking: tracking("insight"),
        },
        {
          href: `${layoutPath}/nebula`,
          label: "Nebula",
          icon: NebulaIcon,
          tracking: tracking("nebula"),
        },
      ]}
      footerSidebarLinks={[
        {
          href: `${layoutPath}/settings`,
          label: "Project Settings",
          icon: SettingsIcon,
          tracking: tracking("project-settings"),
        },
        {
          separator: true,
        },
        {
          href: "https://portal.thirdweb.com",
          label: "Documentation",
          icon: BookTextIcon,
          tracking: tracking("documentation"),
        },
        {
          href: "https://playground.thirdweb.com/connect/sign-in/button",
          label: "Playground",
          icon: BoxIcon,
          tracking: tracking("playground"),
        },
      ]}
    >
      {children}
    </FullWidthSidebarLayout>
  );
}
