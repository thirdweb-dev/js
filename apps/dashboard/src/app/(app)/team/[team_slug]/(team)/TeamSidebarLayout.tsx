"use client";
import {
  BookTextIcon,
  BoxIcon,
  ChartNoAxesColumnIcon,
  DatabaseIcon,
  DollarSignIcon,
  FileTextIcon,
  HomeIcon,
  SettingsIcon,
  WalletCardsIcon,
} from "lucide-react";
import { FullWidthSidebarLayout } from "@/components/blocks/full-width-sidebar-layout";

export function TeamSidebarLayout(props: {
  layoutPath: string;
  children: React.ReactNode;
  ecosystems: Array<{ name: string; slug: string }>;
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
          href: `${layoutPath}/~/analytics`,
          icon: ChartNoAxesColumnIcon,
          label: "Analytics",
        },
        {
          links: [
            ...props.ecosystems.map((ecosystem) => ({
              href: `${layoutPath}/~/ecosystem/${ecosystem.slug}`,
              label: ecosystem.name,
            })),
            {
              href: `${layoutPath}/~/ecosystem/create`,
              label: "Create Ecosystem",
            },
          ],
          subMenu: {
            icon: WalletCardsIcon,
            label: "Ecosystems",
          },
        },
        {
          href: `${layoutPath}/~/audit-log`,
          icon: FileTextIcon,
          label: "Audit Log",
        },
        {
          href: `${layoutPath}/~/usage`,
          icon: DatabaseIcon,
          label: "Usage",
        },
      ]}
      footerSidebarLinks={[
        {
          href: `${layoutPath}/~/billing`,
          icon: DollarSignIcon,
          label: "Billing",
        },
        {
          href: `${layoutPath}/~/settings`,
          icon: SettingsIcon,
          label: "Team Settings",
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
