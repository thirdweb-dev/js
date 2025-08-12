"use client";
import {
  ArrowLeftRightIcon,
  BellIcon,
  BookTextIcon,
  BoxIcon,
  HomeIcon,
  LockIcon,
  RssIcon,
  SettingsIcon,
} from "lucide-react";
import { FullWidthSidebarLayout } from "@/components/blocks/full-width-sidebar-layout";
import { Badge } from "@/components/ui/badge";
import { ContractIcon } from "@/icons/ContractIcon";
import { InsightIcon } from "@/icons/InsightIcon";
import { PayIcon } from "@/icons/PayIcon";
import { SmartAccountIcon } from "@/icons/SmartAccountIcon";
import { TokenIcon } from "@/icons/TokenIcon";
import { WalletProductIcon } from "@/icons/WalletProductIcon";

export function ProjectSidebarLayout(props: {
  layoutPath: string;
  engineLinkType: "cloud" | "dedicated";
  children: React.ReactNode;
  isCentralizedWebhooksFeatureFlagEnabled: boolean;
}) {
  const {
    layoutPath,
    engineLinkType,
    children,
    isCentralizedWebhooksFeatureFlagEnabled,
  } = props;

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
          separator: true,
        },
        {
          group: "Build",
          links: [
            {
              href: `${layoutPath}/wallets`,
              icon: WalletProductIcon,
              label: "Wallets",
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
              href: `${layoutPath}/contracts`,
              icon: ContractIcon,
              label: "Contracts",
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
              href: `${layoutPath}/payments`,
              icon: PayIcon,
              label: "Payments",
            },
            {
              href: `${layoutPath}/tokens`,
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
              href: `${layoutPath}/insight`,
              icon: InsightIcon,
              label: "Insight",
            },
            {
              href: `${layoutPath}/account-abstraction`,
              icon: SmartAccountIcon,
              label: "Account Abstraction",
            },
            {
              href: `${layoutPath}/rpc`,
              icon: RssIcon,
              label: "RPC",
            },
            {
              href: `${layoutPath}/vault`,
              icon: LockIcon,
              label: "Vault",
            },
          ],
        },
      ]}
      footerSidebarLinks={[
        {
          href: isCentralizedWebhooksFeatureFlagEnabled
            ? `${layoutPath}/webhooks`
            : `${layoutPath}/webhooks/contracts`,
          icon: BellIcon,
          isActive: (pathname) => {
            return pathname.startsWith(`${layoutPath}/webhooks`);
          },
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
