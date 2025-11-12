"use client";
import {
  AtomIcon,
  BookTextIcon,
  BoxIcon,
  ChartNoAxesColumnIcon,
  DatabaseIcon,
  DollarSignIcon,
  FileTextIcon,
  HelpCircleIcon,
  HomeIcon,
  SettingsIcon,
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
        // ecosystem below here
        // TODO: make this one link to an overview page that has a list of all the ecosystems currently deployed
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
            icon: AtomIcon,
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

        {
          separator: true,
        } as const,
      ]}
      footerSidebarLinks={[
        {
          href: `${layoutPath}/~/support`,
          icon: HelpCircleIcon,
          label: "Support",
        },
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
          href: "https://playground.thirdweb.com/wallets/sign-in/button",
          icon: BoxIcon,
          label: "Playground",
        },
      ]}
    >
      {children}
    </FullWidthSidebarLayout>
  );
}
