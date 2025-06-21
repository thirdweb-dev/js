"use client";
import { useMutation } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileCode2Icon,
  LogOutIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import {
  AccountAvatar,
  AccountBlobbie,
  AccountProvider,
  useActiveWallet,
  WalletIcon,
  WalletName,
  WalletProvider,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { useIsClientMounted } from "@/components/blocks/client-only";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { TabButtons } from "@/components/ui/tabs";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { nebulaAppThirdwebClient } from "@/constants/nebula-client";
import { NebulaIcon } from "@/icons/NebulaIcon";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { doNebulaLogout } from "../../login/auth-actions";
import type { TruncatedSessionInfo } from "../api/types";
import { useNewChatPageLink } from "../hooks/useNewChatPageLink";
import { useSessionsWithLocalOverrides } from "../hooks/useSessionsWithLocalOverrides";
import { AssetsSection } from "./AssetsSection/AssetsSection";
import { ChatSidebarLink } from "./ChatSidebarLink";
import { NebulaConnectWallet } from "./NebulaConnectButton";
import { TransactionsSection } from "./TransactionsSection/TransactionsSection";

export function ChatSidebar(props: {
  sessions: TruncatedSessionInfo[];
  authToken: string;
  type: "desktop" | "mobile";
}) {
  const sessions = useSessionsWithLocalOverrides(props.sessions);
  const sessionsToShow = sessions.slice(0, 10);
  const newChatPage = useNewChatPageLink();
  const router = useDashboardRouter();
  const logoutMutation = useMutation({
    mutationFn: doNebulaLogout,
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-start gap-3 p-4 lg:justify-between">
        <Link className="flex items-center gap-1" href="/">
          <NebulaIcon aria-label="Nebula" className="size-6 text-foreground" />
          <span className="font-medium text-lg">Nebula</span>
        </Link>

        <Badge className="gap-1 py-1" variant="secondary">
          Beta
        </Badge>
      </div>

      <div className="h-1" />

      <div className="flex flex-col gap-2 px-4">
        <Button
          asChild
          className="w-full gap-2 rounded-lg border-nebula-pink-foreground"
          variant="pink"
        >
          <Link href={newChatPage}>
            <PlusIcon className="size-4" />
            New Chat
          </Link>
        </Button>
      </div>

      <div className="h-5" />

      {sessionsToShow.length > 0 && (
        <div className="flex-1 overflow-auto border-t border-dashed p-2 pt-2">
          <div className="flex items-center justify-between px-2 py-3">
            <h3 className="text-muted-foreground text-xs">Recent Chats</h3>
            {sessionsToShow.length < sessions.length && (
              <Link
                className="flex items-center gap-1 rounded-full text-foreground text-xs hover:underline"
                href="/chat/history"
              >
                View All
                <ChevronRightIcon className="size-3.5 text-muted-foreground" />
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-1">
            {sessionsToShow.map((session) => {
              return (
                <ChatSidebarLink
                  authToken={props.authToken}
                  key={session.id}
                  sessionId={session.id}
                  title={session.title || "Untitled Chat"}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-auto">
        <WalletDetails />
      </div>

      <div className="flex items-center justify-center gap-2 border-t px-4 py-3">
        <SidebarIconLink
          href="https://portal.thirdweb.com/nebula"
          icon={FileCode2Icon}
          label="Documentation"
          target="_blank"
        />

        <ToggleThemeButton />

        <SidebarIconButton
          icon={logoutMutation.isPending ? Spinner : LogOutIcon}
          label="Log Out"
          onClick={async () => {
            try {
              await logoutMutation.mutateAsync();
              router.replace("/login");
            } catch {
              toast.error("Failed to log out");
            }
          }}
        />
      </div>
    </div>
  );
}

function WalletDetails() {
  const [tab, setTab] = useState<"assets" | "transactions">("assets");
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <DynamicHeight transition="height 220ms ease">
      <div className="flex items-center justify-between gap-2 border-t px-2 py-1.5">
        <CustomConnectButton />
        <Button
          className={cn(
            "h-auto w-auto p-1.5 transition-transform duration-300",
            isExpanded ? "rotate-180" : "",
          )}
          onClick={() => setIsExpanded(!isExpanded)}
          size="sm"
          variant="ghost"
        >
          <ChevronDownIcon className="size-4" />
        </Button>
      </div>

      {isExpanded && (
        <div className="border-t border-dashed">
          <TabButtons
            tabClassName="!text-sm py-1.5"
            tabContainerClassName="px-2 pt-2"
            tabs={[
              {
                isActive: tab === "assets",
                name: "Assets",
                onClick: () => setTab("assets"),
              },
              {
                isActive: tab === "transactions",
                name: "Recent Activity",
                onClick: () => setTab("transactions"),
              },
            ]}
          />

          {isExpanded && (
            <div className="h-[230px] overflow-y-auto py-4 pr-1 pl-2">
              {tab === "assets" && (
                <AssetsSection client={nebulaAppThirdwebClient} />
              )}

              {tab === "transactions" && (
                <TransactionsSection client={nebulaAppThirdwebClient} />
              )}
            </div>
          )}
        </div>
      )}
    </DynamicHeight>
  );
}

function CustomConnectButton() {
  const activeWallet = useActiveWallet();
  const accountBlobbie = <AccountBlobbie className="size-8 rounded-full" />;
  const accountAvatarFallback = (
    <WalletIcon
      className="size-8 rounded-lg"
      fallbackComponent={accountBlobbie}
      loadingComponent={accountBlobbie}
    />
  );

  return (
    <div className="[&>*]:!w-full grow">
      <NebulaConnectWallet
        customDetailsButton={
          activeWallet
            ? (address) => {
                return (
                  <WalletProvider id={activeWallet.id}>
                    <AccountProvider
                      address={address}
                      client={nebulaAppThirdwebClient}
                    >
                      <Button
                        className="flex h-auto w-full items-center justify-start gap-2.5 rounded-lg px-2 hover:bg-accent"
                        variant="ghost"
                      >
                        <AccountAvatar
                          className="size-8 rounded-full"
                          fallbackComponent={accountAvatarFallback}
                          loadingComponent={accountAvatarFallback}
                        />
                        <div className="flex flex-col items-start justify-start">
                          <div className="text-sm">
                            {shortenAddress(address)}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {activeWallet.id === "smart" ? (
                              <span> Smart Wallet </span>
                            ) : (
                              <WalletName
                                fallbackComponent={<span>Wallet</span>}
                                loadingComponent={<span>Wallet</span>}
                              />
                            )}
                          </div>
                        </div>
                      </Button>
                    </AccountProvider>
                  </WalletProvider>
                );
              }
            : undefined
        }
        detailsButtonClassName="!bg-background hover:!border-active-border"
      />
    </div>
  );
}

function ToggleThemeButton() {
  const { theme, setTheme } = useTheme();
  const isClientMounted = useIsClientMounted();

  return (
    <SidebarIconButton
      icon={
        isClientMounted ? (theme === "light" ? SunIcon : MoonIcon) : Spinner
      }
      label="Toggle Theme"
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");
      }}
    />
  );
}

function SidebarIconLink(props: {
  icon: React.FC<{ className?: string }>;
  label: string;
  target?: "_blank";
  href: string;
}) {
  return (
    <ToolTipLabel label={props.label}>
      <Button
        asChild
        className="size-10 rounded-full p-0 text-muted-foreground hover:text-foreground"
        variant="ghost"
      >
        <Link
          aria-label={props.label}
          href={props.href}
          prefetch={false}
          target={props.target}
        >
          <props.icon className="size-5" />
        </Link>
      </Button>
    </ToolTipLabel>
  );
}

function SidebarIconButton(props: {
  icon: React.FC<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <ToolTipLabel label={props.label}>
      <Button
        aria-label={props.label}
        className="size-10 rounded-full p-0 text-muted-foreground hover:text-foreground"
        onClick={props.onClick}
        variant="ghost"
      >
        <props.icon className="size-5" />
      </Button>
    </ToolTipLabel>
  );
}
